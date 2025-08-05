






import traceback
from functools import wraps
from quart import Quart, abort
import os
import json
import asyncio
import httpx
from datetime import datetime, timedelta, timezone
from datetime import datetime, date
from threading import Lock
from quart_rate_limiter import RateLimiter, RateLimit
import google.api_core.exceptions
from hypercorn.config import Config
from hypercorn.asyncio import serve
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from google.api_core.exceptions import FailedPrecondition
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth
from firebase_admin.firestore import FieldFilter
from quart import Quart, jsonify, Blueprint, request
from quart_cors import cors
from google.api_core import retry
from stellar_sdk import Keypair, Server, Network, TransactionBuilder, Asset, Memo, TextMemo
from stellar_sdk.exceptions import NotFoundError, BadRequestError
import hashlib
import requests
import time
import hmac
from collections import defaultdict
from threading import Lock
import logging
# from utils.tokens import create_auth_response, jwt_required, verify_token
from admin import create_admin_blueprint, create_payment_blueprint
from quart import current_app
import re
from functools import partial
from concurrent.futures import ThreadPoolExecutor
import threading
import requests.exceptions
# Import the scheduler
from system_stats import run_scheduler
from cachetools import TTLCache
import time
# from quart_rate_limiter import rate_limit

# PAMM Engine (add to your imports)
from dataclasses import dataclass
# from typing import List, Dict
from typing import Dict, List, Optional, Tuple, Any
import httpx
from cachetools import TTLCache
from config import db, MASTER_KEYPAIR, MASTER_PUBLIC_KEY  # Import from config.py
from decimal import Decimal, ROUND_DOWN



# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('pamm_api.log'),
        logging.StreamHandler()
    ]
)

# Set up logging to handle Unicode characters
logging.basicConfig(level=logging.INFO, encoding='utf-8')
# Initialize logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# Initialize Quart app with CORS
app = Quart(__name__)
# app = cors(app, allow_origin="*")
app = cors(app, allow_origin="*", allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers=["*"])

rate_limiter = RateLimiter(app, default_limits=[RateLimit(100, timedelta(minutes=1))])
executor = ThreadPoolExecutor(max_workers=4)
semaphore = asyncio.Semaphore(2)

# In-memory caches
symbols_cache = TTLCache(maxsize=1, ttl=3600)  # Cache symbols for 1 hour
price_cache = TTLCache(maxsize=100, ttl=60)    # Cache prices for 1 minute
trades_cache = TTLCache(maxsize=200, ttl=300)  # Cache trades for 5 minutes
pnl_cache = TTLCache(maxsize=100, ttl=1800)    # Cache P&L for 30 minutes
order_cache = TTLCache(maxsize=200, ttl=300)   # Cache orders for 5 minutes
trade_sync_lock = Lock()



# Authentication blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


# Constants
DEFAULT_BALANCE = 0.0
DEFAULT_HOLDINGS = 0.0
DEFAULT_PROFIT = 0.0
# Minimum trade amount threshold
MIN_TRADE_AMOUNT = Decimal('0.01')  # Adjust as needed
PROFIT_RATE = Decimal('0.05')  # 5% profit rate for sell trades


# Bybit and Stellar Configuration
BYBIT_API_KEY = os.getenv("BYBIT_API_KEY")
BYBIT_SECRET = os.getenv("BYBIT_SECRET")
BYBIT_MAINNET_URL = os.getenv("BYBIT_MAINNET_URL", "https://api.bybit.com")
STELLAR_NETWORK = Network.TESTNET_NETWORK_PASSPHRASE
STELLAR_SERVER = Server("https://horizon-testnet.stellar.org")
XLM_ASSET = Asset.native()


# Create and register the admin blueprint with the Firestore client
admin_bp = create_admin_blueprint(db)
app.register_blueprint(admin_bp)

payment_bp = create_payment_blueprint(db)
app.register_blueprint(payment_bp)





@app.route('/api/stats', methods=['GET'])
async def get_system_stats():
    try:
        stats_ref = db.collection('system_stats').document('current')
        doc = await asyncio.get_event_loop().run_in_executor(None, lambda: stats_ref.get())
        if not doc.exists:
            logger.error("System stats document not found")
            abort(404, description="Stats not found")
        
        stats = doc.to_dict()
        last_updated = stats.get('last_updated')
        if last_updated:
            last_updated = last_updated.isoformat()

        # Fetch daily trades
        daily_trades_count = 0
        try:
            # Check top-level trades
            trades_ref = db.collection('trades').where(
                filter=FieldFilter('timestamp', '>=', datetime.now(timezone.utc) - timedelta(days=1))
            )
            trades = await asyncio.get_event_loop().run_in_executor(None, lambda: trades_ref.get())
            daily_trades_count += len(trades)
            logger.info(f"Top-level daily trades: {len(trades)}")

            # Check user subcollection trades
            users = await asyncio.get_event_loop().run_in_executor(None, lambda: db.collection('users').get())
            for user in users:
                user_trades_ref = db.collection('users').document(user.id).collection('trades').where(
                    filter=FieldFilter('timestamp', '>=', datetime.now(timezone.utc) - timedelta(days=1))
                )
                user_trades = await asyncio.get_event_loop().run_in_executor(None, lambda: user_trades_ref.get())
                daily_trades_count += len(user_trades)
                logger.info(f"User {user.id} daily trades: {len(user_trades)}")

            # Check trades_manager_bybit and trades_recent
            for collection in ['trades_manager_bybit', 'trades_recent']:
                trades_ref = db.collection(collection).where(
                    filter=FieldFilter('timestamp', '>=', datetime.now(timezone.utc) - timedelta(days=1))
                )
                trades = await asyncio.get_event_loop().run_in_executor(None, lambda: trades_ref.get())
                daily_trades_count += len(trades)
                logger.info(f"{collection} daily trades: {len(trades)}")
        except Exception as e:
            logger.warning(f"Failed to query trades with timestamp: {str(e)}. Falling back to total trades.")
            total_trades = 0
            # Fallback: count all trades
            trades = await asyncio.get_event_loop().run_in_executor(None, lambda: db.collection('trades').get())
            total_trades += len(trades)
            for user in users:
                user_trades = await asyncio.get_event_loop().run_in_executor(None, lambda: db.collection('users').document(user.id).collection('trades').get())
                total_trades += len(user_trades)
            for collection in ['trades_manager_bybit', 'trades_recent']:
                trades = await asyncio.get_event_loop().run_in_executor(None, lambda: db.collection(collection).get())
                total_trades += len(trades)
            daily_trades_count = total_trades
            logger.info(f"Fallback total trades: {daily_trades_count}")

        daily_trades = f"{daily_trades_count:,}" if daily_trades_count < 5000 else f"{daily_trades_count:,}+"

        response = {
            "activeTraders": stats.get('active_users', 0),
            "dailyTrades": daily_trades,
            "totalTrades": stats.get('total_trades', 0),
            "lastUpdated": last_updated,
            "totalDeposits": stats.get('total_deposits', 0),
            "totalVolume": stats.get('total_volume', 0)
        }
        logger.info(f"Stats response: {response}")
        return response
    except Exception as e:
        logger.error(f"Error fetching system stats: {str(e)}", exc_info=True)
        abort(500, description="Internal server error")


@auth_bp.route('/refresh', methods=['POST'])
async def refresh_token():
    logger.info("Processing POST /auth/refresh")
    try:
        data = await request.get_json()
        refresh_token = data.get('refreshToken')
        if not refresh_token:
            logger.error("No refresh token provided")
            return jsonify({'status': 'error', 'message': 'Refresh token required'}), 400

        # Exchange refresh token for new ID token using Firebase API
        api_key = os.getenv('FIREBASE_API_KEY')
        if not api_key:
            logger.error("FIREBASE_API_KEY not set")
            return jsonify({'status': 'error', 'message': 'Server configuration error'}), 500

        url = f'https://securetoken.googleapis.com/v1/token?key={api_key}'
        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
        response = requests.post(url, json=payload)
        response_data = response.json()

        if response.status_code != 200 or 'id_token' not in response_data:
            logger.error(f"Failed to refresh token: {response_data.get('error', 'Unknown error')}")
            return jsonify({'status': 'error', 'message': 'Failed to refresh token'}), 401

        new_id_token = response_data['id_token']
        new_refresh_token = response_data.get('refresh_token', refresh_token)
        user_id = response_data['user_id']

        logger.info(f"Token refreshed for user {user_id}")
        return jsonify({
            'status': 'success',
            'idToken': new_id_token,
            'refreshToken': new_refresh_token
        })
    except Exception as e:
        logger.error(f"Error refreshing token: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500



@app.route('/refresh/manager/investor', methods=['POST'])
async def refresh_token_manager_investor():
    logger.info("Processing POST /auth/refresh")
    try:
        data = await request.get_json()
        refresh_token = data.get('refreshToken')
        
        if not refresh_token:
            logger.error("No refresh token provided")
            return jsonify({
                'status': 'error', 
                'code': 'MISSING_REFRESH_TOKEN',
                'message': 'Refresh token required'
            }), 400

        # Exchange refresh token for new ID token using Firebase REST API
        api_key = os.getenv('FIREBASE_API_KEY')
        if not api_key:
            logger.error("FIREBASE_API_KEY not set")
            return jsonify({
                'status': 'error',
                'code': 'SERVER_CONFIG_ERROR',
                'message': 'Server configuration error'
            }), 500

        url = f'https://securetoken.googleapis.com/v1/token?key={api_key}'
        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
        
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            response_data = response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Firebase token exchange failed: {str(e)}")
            return jsonify({
                'status': 'error',
                'code': 'FIREBASE_ERROR',
                'message': 'Failed to communicate with authentication service'
            }), 503

        if 'id_token' not in response_data:
            logger.error(f"Invalid response from Firebase: {response_data}")
            return jsonify({
                'status': 'error',
                'code': 'INVALID_RESPONSE',
                'message': 'Invalid response from authentication service'
            }), 500

        new_id_token = response_data['id_token']
        new_refresh_token = response_data.get('refresh_token', refresh_token)
        user_id = response_data['user_id']

        logger.info(f"Token refreshed for user {user_id}")
        return jsonify({
            'status': 'success',
            'idToken': new_id_token,
            'refreshToken': new_refresh_token,
            'userId': user_id
        })
        
    except Exception as e:
        logger.error(f"Unexpected error refreshing token: {str(e)}")
        return jsonify({
            'status': 'error',
            'code': 'INTERNAL_ERROR',
            'message': 'An unexpected error occurred'
        }), 500
    


def log_api_call(func):
    """Decorator to log API calls with request/response details"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = datetime.now()
        request_id = f"{start_time.strftime('%Y%m%d_%H%M%S_%f')}"
        
        # Print request details
        print(f"[{request_id}] {func.__name__} - START")
        print(f"[{request_id}] Endpoint: {request.method} {request.path}")
        
        if hasattr(request, 'get_json'):
            try:
                request_data = await request.get_json() if request.method in ['POST', 'PUT', 'PATCH'] else None
                if request_data:
                    # Mask sensitive data
                    safe_data = {k: v if k not in ['password', 'token'] else '***MASKED***' for k, v in request_data.items()}
                    print(f"[{request_id}] Request Body: {json.dumps(safe_data, indent=2)}")
            except Exception as e:
                print(f"[{request_id}] Could not parse request JSON: {e}")
        
        try:
            # Execute the function
            result = await func(*args, **kwargs)
            
            # Print successful response
            duration = (datetime.now() - start_time).total_seconds() * 1000
            print(f"[{request_id}] {func.__name__} - SUCCESS ({duration:.2f}ms)")
            
            # Print response details
            if isinstance(result, tuple):
                response_data, status_code = result
                print(f"[{request_id}] Response Status: {status_code}")
                if hasattr(response_data, 'get_json'):
                    try:
                        response_json = await response_data.get_json()
                        print(f"[{request_id}] Response Data: {response_json}")
                    except Exception as e:
                        print(f"[{request_id}] Could not parse response JSON: {e}")
            else:
                print(f"[{request_id}] Response Type: {type(result)}")
            
            return result
            
        except Exception as e:
            # Print error
            duration = (datetime.now() - start_time).total_seconds() * 1000
            print(f"[{request_id}] {func.__name__} - ERROR ({duration:.2f}ms)")
            print(f"[{request_id}] Error: {str(e)}")
            print(f"[{request_id}] Traceback: {traceback.format_exc()}")
            raise
    
    return wrapper



async def ensure_master_account():
    """Ensure the master account is created and funded on the testnet."""
    try:
        STELLAR_SERVER.load_account(MASTER_PUBLIC_KEY)
        # print(f"Master account {MASTER_PUBLIC_KEY} exists and is ready")
        return True
    except NotFoundError:
        print(f"Master account {MASTER_PUBLIC_KEY} not found, attempting to create...")
        try:
            if "testnet" in STELLAR_SERVER.horizon_url:
                response = requests.get(f"https://friendbot.stellar.org?addr={MASTER_PUBLIC_KEY}")
                if response.status_code == 200:
                    print(f"Master account {MASTER_PUBLIC_KEY} created and funded via Friendbot")
                    return True
                else:
                    print(f"Friendbot failed: {response.text}")
                    return False
            else:
                print("Mainnet requires manual funding")
                return False
        except Exception as e:
            print(f"Error creating master account: {str(e)}")
            return False

@app.before_serving
async def startup():
    """Run startup tasks, including master account initialization."""
    # print("Initializing Stellar master account...")
    if not await ensure_master_account():
        print("⚠️ Master account initialization failed. Withdrawals may not work.")
    else:
        print("✅ Master account initialized successfully")

         # Start the system stats scheduler
    # print("Starting system stats scheduler...")
    asyncio.create_task(run_scheduler())

@app.route('/test-firebase', methods=['GET'])
async def test_firebase():
    try:
        # db = initialize_firebase()
        # print("✅ Firebase initialized")
        test_collection = db.collection("connection_tests")
        test_doc = test_collection.document()
        test_data = {
            "timestamp": firestore.SERVER_TIMESTAMP,
            "status": "success",
            "message": "Persistent test document"
        }
        test_doc.set(test_data)
        print(f"✅ Test document written: {test_doc.id}")
        doc = test_doc.get()
        if doc.exists:
            print(f"✅ Test document verified: {doc.to_dict()}")
            return jsonify({
                "status": "success",
                "data": doc.to_dict(),
                "document_id": test_doc.id
            })
        print("❌ Test document not found")
        return jsonify({"status": "error", "message": "Test document not found"}), 404
    except json.JSONDecodeError as e:
        return jsonify({"status": "error", "message": f"JSON parsing error: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({"status": "error", "message": f"Firebase credential error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": f"Unexpected error: {str(e)}"}), 500





@app.route('/create-first-admin', methods=['POST'])
async def create_first_admin():
    try:
        # This should be protected in production - only allow from specific IPs or with a master key
        data = await request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'status': 'error', 'message': 'Email required'}), 400
            
        # Find user by email
        users_ref = db.collection('users')
        query = users_ref.where('email', '==', email).limit(1)
        docs = query.stream()
        
        user = None
        for doc in docs:
            user = doc.to_dict()
            user['id'] = doc.id
            
        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404
            
        # Make admin
        user_ref = users_ref.document(user['id'])
        user_ref.update({
            'is_admin': True,
            'updated_at': firestore.SERVER_TIMESTAMP
        })
        
        return jsonify({
            'status': 'success',
            'message': f'User {email} promoted to admin'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


def validate_email(email: str) -> bool:
    """Validate email format using regex"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

async def get_or_create_user(user_id: str, **kwargs) -> Tuple[dict, bool]:
    try:
        logger.info(f"Attempting to get or create user document for {user_id} in collection 'users'")
        user_ref = db.collection('users').document(user_id)
        doc = user_ref.get()
        
        if doc.exists:
            logger.info(f"User document exists for {user_id}, updating lastLogin")
            user_ref.update({
                'lastLogin': firestore.SERVER_TIMESTAMP
            })
            user_data = doc.to_dict()
            for field in ['createdAt', 'updatedAt', 'lastLogin']:
                if field in user_data and isinstance(user_data[field], firestore.SERVER_TIMESTAMP.__class__):
                    user_data[field] = None
            return user_data, False
        
        # Check for existing user by email
        email = kwargs.get('email', '')
        if email:
            existing_users = db.collection('users').where('email', '==', email).limit(1).get()
            if existing_users:
                existing_user = existing_users[0]
                logger.warning(f"User with email {email} already exists with UID {existing_user.id}")
                return existing_user.to_dict(), False

        # Validate required fields
        if not email:
            logger.warning(f"No email provided for user {user_id}, using default")
            email = f"{user_id}@example.com"
        if not validate_email(email):
            logger.error(f"Invalid email format: {email}")
            raise ValueError(f"Invalid email format: {email}")

        # Create user document for Firestore
        user_data = {
            'uid': user_id,
            'email': email,
            'displayName': kwargs.get('displayName', email.split('@')[0]),
            'photoURL': kwargs.get('photoURL', ''),
            'balance': float(kwargs.get('balance', 0.0)),
            'holdings': float(kwargs.get('holdings', 0.0)),
            'profit': float(kwargs.get('profit', 0.0)),
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
            'lastLogin': firestore.SERVER_TIMESTAMP,
            'authProvider': 'google.com',
            'is_admin': False,
            'is_manager': False,
            'is_investor': False,
            'emailVerified': kwargs.get('emailVerified', False),
            'phoneNumber': kwargs.get('phoneNumber', ''),
            'tradingEnabled': False,
            'accountStatus': 'active'
        }

        user_data_serializable = user_data.copy()
        user_data_serializable['createdAt'] = None
        user_data_serializable['updatedAt'] = None
        user_data_serializable['lastLogin'] = None

        logger.info(f"Creating user document for {user_id} with data: {user_data}")
        user_ref.set(user_data, merge=False)
        logger.info(f"User document set for {user_id}")

        doc = user_ref.get()
        if not doc.exists:
            logger.error(f"Failed to verify document creation for {user_id}")
            raise ValueError("Document creation failed")
        
        logger.info(f"User document verified for {user_id} in collection 'users', database: {db._database}")
        return user_data_serializable, True
        
    except Exception as e:
        logger.error(f"Error in get_or_create_user for {user_id}: {str(e)}")
        raise




@app.route('/google-signin', methods=['POST'])
async def google_signin():
    try:
        logger.info("Received /google-signin request")
        data = await request.get_json()
        logger.info(f"Request data: {data}")
        if not data or 'idToken' not in data:
            logger.error("ID token missing in request")
            return jsonify({
                "status": "error", 
                "message": "ID token required"
            }), 400

        # Verify Google token with Firebase Admin
        try:
            decoded_token = auth.verify_id_token(data['idToken'])
            user_id = decoded_token['uid']
            logger.info(f"Token verified for user {user_id}")
            
            if decoded_token.get('firebase', {}).get('sign_in_provider') != 'google.com':
                logger.error("Invalid sign-in provider")
                return jsonify({
                    "status": "error",
                    "message": "Invalid provider - Google sign-in required"
                }), 401
                
            firebase_user = auth.get_user(user_id)
            logger.info(f"Firebase user details: email={firebase_user.email}, displayName={firebase_user.display_name}, photoURL={firebase_user.photo_url}")
        except ValueError as e:
            logger.error(f"Invalid token format: {str(e)}")
            return jsonify({
                "status": "error",
                "message": "Invalid token format"
            }), 401
        except auth.InvalidIdTokenError as e:
            logger.error(f"Invalid or expired token: {str(e)}")
            return jsonify({
                "status": "error",
                "message": "Invalid or expired token"
            }), 401
        except Exception as e:
            logger.error(f"Token verification failed: {str(e)}")
            return jsonify({
                "status": "error",
                "message": "Token verification failed"
            }), 401

        # Create/update user document
        try:
            user_data, is_new = await get_or_create_user(
                user_id=user_id,
                email=firebase_user.email,
                displayName=firebase_user.display_name or firebase_user.email.split('@')[0] if firebase_user.email else user_id,
                photoURL=firebase_user.photo_url,
                emailVerified=firebase_user.email_verified
            )
            logger.info(f"User data processed for {user_id}, is_new={is_new}")
        except Exception as e:
            logger.error(f"Failed to process user data for {user_id}: {str(e)}")
            return jsonify({
                "status": "error",
                "message": f"Failed to process user data: {str(e)}"
            }), 500

        # Return Firebase ID token and refresh token
        logger.info(f"Returning success response for {user_id}")
        return jsonify({
            "status": "success",
            "token": data['idToken'],
            "refresh_token": data.get('refreshToken'),
            "expires_in": decoded_token.get('exp', 3600),
            "user_id": user_id,
            "user": user_data,
            "is_new": is_new
        })
        
    except Exception as e:
        logger.error(f"Google signin error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Internal server error"
        }), 500


    
@app.route('/users/<user_id>', methods=['GET'])
async def get_user(user_id):
    try:
        if not user_id:
            return jsonify({"status": "error", "message": "User ID required"}), 400
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            return jsonify({"status": "error", "message": "User not found"}), 404
        user_data = user_doc.to_dict()
        return jsonify({
            "status": "success",
            "user": {
                "uid": user_data.get("uid"),
                "displayName": user_data.get("displayName"),
                "email": user_data.get("email"),
                "phoneNumber": user_data.get("phoneNumber"),
                "photoURL": user_data.get("photoURL"),
                "balance": user_data.get("balance", 0),
                "holdings": user_data.get("holdings", 0),
                "locked_holdings": float(user_data.get("locked_holdings", 0)),
                "profit": user_data.get("profit", 0),
                "target": user_data.get("target", 0),
                "is_admin": user_data.get("is_admin")
            }
        }), 200
    except Exception as e:
        print(f"Error fetching user {user_id}: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500










def generate_deposit_keypair(user_id):
    seed_salt = os.getenv('STELLAR_SEED_SALT', 'default_salt')
    raw_seed = hashlib.sha256(f"{user_id}_{seed_salt}".encode()).digest()[:32]
    print(f"Raw seed (bytes): {raw_seed}")
    print(f"Raw seed length: {len(raw_seed)} bytes")
    keypair = Keypair.from_raw_ed25519_seed(raw_seed)
    return keypair

def generate_memo_for_user(user_id, transaction_id):
    memo_input = f"{user_id}_{transaction_id}_{os.getenv('MEMO_SALT', 'memo_salt')}"
    memo_hash = hashlib.md5(memo_input.encode()).hexdigest()
    return memo_hash[:10]

async def setup_stellar_account(keypair):
    try:
        STELLAR_SERVER.load_account(keypair.public_key)
        # print(f"Account {keypair.public_key} exists")
        return True
    except NotFoundError:
        try:
            if "testnet" in STELLAR_SERVER.horizon_url:
                response = requests.get(f"https://friendbot.stellar.org?addr={keypair.public_key}")
                if response.status_code == 200:
                    print(f"Account {keypair.public_key} created via Friendbot")
                    return True
                print(f"Friendbot failed: {response.text}")
                return False
            print("Mainnet requires manual funding")
            return False
        except Exception as e:
            print(f"Error creating account: {str(e)}")
            return False


async def monitor_deposits(user_id, deposit_address, amount, memo, timeout_minutes, deposit_id):
    start_time = datetime.now(timezone.utc)
    print(f"[{start_time.isoformat()}] Starting deposit monitoring for user {user_id}, address {deposit_address}")
    end_time = start_time + timedelta(minutes=timeout_minutes)
    cursor = None  # Start with no cursor for the first query
    
    while datetime.now(timezone.utc) < end_time:
        try:
            transactions_query = (
                STELLAR_SERVER.transactions()
                .for_account(deposit_address)
                .order(desc=False)
                .limit(50)
            )
            if cursor:
                transactions_query = transactions_query.cursor(cursor)
            
            transactions = transactions_query.call()
            records = transactions['_embedded']['records']
            print(f"[{datetime.now(timezone.utc).isoformat()}] Scanned {len(records)} transactions for address {deposit_address}")
            
            for transaction in records:
                tx_time = datetime.fromisoformat(transaction['created_at'].replace('Z', '+00:00'))
                # Skip transactions older than 30 seconds before start_time to reduce processing
                if tx_time < start_time - timedelta(seconds=30):
                    continue
                print(f"[{datetime.now(timezone.utc).isoformat()}] Checking tx: hash={transaction['id']}, time={tx_time}, memo={transaction.get('memo', 'none')}")
                
                operations = STELLAR_SERVER.operations().for_transaction(transaction['id']).call()['_embedded']['records']
                for op in operations:
                    # Only process payment operations with an amount field
                    if op['type'] != 'payment' or 'amount' not in op:
                        continue
                    if (op['to'] == deposit_address and
                        float(op['amount']) == float(amount) and
                        transaction.get('memo') == memo):
                        print(f"[{datetime.now(timezone.utc).isoformat()}] Deposit detected for user {user_id}, tx {transaction['id']}, amount={op['amount']}, memo={memo}")
                        await process_confirmed_deposit(user_id, float(amount), transaction['id'], deposit_address, memo)
                        deposit_ref = db.collection("pending_deposits").document(deposit_id)
                        print(f"[{datetime.now(timezone.utc).isoformat()}] Firestore updated for depositId {deposit_ref.id}")
                        return True
                    elif transaction.get('memo') == memo and float(op['amount']) != float(amount):
                        print(f"[{datetime.now(timezone.utc).isoformat()}] Mismatched amount: received {op['amount']}, expected {amount}, memo={memo}")
                    elif transaction.get('memo') != memo and float(op['amount']) == float(amount):
                        print(f"[{datetime.now(timezone.utc).isoformat()}] Mismatched memo: received {transaction.get('memo', 'none')}, expected {memo}, amount={op['amount']}")
            
            # Update cursor to the paging token of the last transaction
            if records:
                cursor = records[-1]['paging_token']
                print(f"[{datetime.now(timezone.utc).isoformat()}] Updated cursor to {cursor}")
            
            await asyncio.sleep(5)
        except Exception as e:
            print(f"[{datetime.now(timezone.utc).isoformat()}] Error monitoring deposits for user {user_id}: {str(e)}")
            await asyncio.sleep(10)
    
    print(f"[{datetime.now(timezone.utc).isoformat()}] Deposit monitoring timed out for user {user_id}")
    deposit_ref = db.collection("pending_deposits").document(deposit_id)
    deposit_ref.update({
        "status": "timeout",
        "lastUpdated": firestore.SERVER_TIMESTAMP
    })
    print(f"[{datetime.now(timezone.utc).isoformat()}] Marked depositId {deposit_ref.id} as timed out")
    return False



async def process_confirmed_deposit(user_id, amount, tx_hash, deposit_address, memo):
    try:
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            print(f"[{datetime.now(timezone.utc).isoformat()}] User {user_id} not found")
            return False
        
        current_balance = user_doc.to_dict().get("balance", 0)
        new_balance = current_balance + amount
        
        # Find and update the pending deposit
        deposit_query = db.collection("pending_deposits").where(
            filter=FieldFilter("userId", "==", user_id)
        ).where(
            filter=FieldFilter("depositAddress", "==", deposit_address)
        ).where(
            filter=FieldFilter("memo", "==", memo)
        )
        deposit_docs = deposit_query.stream()
        for doc in deposit_docs:
            doc.reference.update({
                "status": "completed",
                "lastUpdated": firestore.SERVER_TIMESTAMP
            })
        
        # Record the transaction
        transaction_ref = user_ref.collection("transactions").document()
        transaction_data = {
            "type": "crypto_deposit",
            "amount": amount,
            "previousBalance": current_balance,
            "newBalance": new_balance,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "status": "completed",
            "cryptoTxHash": tx_hash,
            "depositAddress": deposit_address,
            "currency": "XLM",
            "network": "Stellar",
            "memo": memo
        }
        
        # Atomic update for balance and transaction
        @firestore.transactional
        def update_in_transaction(transaction, user_ref, transaction_ref, transaction_data, new_balance):
            transaction.update(user_ref, {
                "balance": new_balance,
                "lastUpdated": firestore.SERVER_TIMESTAMP
            })
            transaction.set(transaction_ref, transaction_data)
        
        transaction = db.transaction()
        update_in_transaction(transaction, user_ref, transaction_ref, transaction_data, new_balance)
        
        print(f"[{datetime.now(timezone.utc).isoformat()}] Deposit processed for user {user_id}, tx {tx_hash}")
        return True
    
    except Exception as e:
        print(f"[{datetime.now(timezone.utc).isoformat()}] Error processing deposit: {str(e)}")
        return False


async def monitor_withdrawal(user_id, withdraw_id, destination, expected_amount, memo, tx_hash, timeout_minutes=30):
    start_time = datetime.now(timezone.utc)
    timeout_duration = timedelta(minutes=timeout_minutes)
    end_time = start_time + timeout_duration
    cursor_time = start_time - timedelta(minutes=5)  # Check 5 minutes back
    withdraw_ref = db.collection("pending_withdrawals").document(withdraw_id)
    
    print(f"Starting withdrawal monitoring for user {user_id}, withdraw_id {withdraw_id}, tx_hash {tx_hash}")

    # Fallback: Check transaction directly by hash
    try:
        transaction = STELLAR_SERVER.transactions().transaction(tx_hash).call()
        tx_time = datetime.fromisoformat(transaction['created_at'].replace('Z', '+00:00'))
        print(f"Direct tx check: hash={tx_hash}, time={tx_time}, memo={transaction.get('memo', '')}")
        operations = STELLAR_SERVER.operations().for_transaction(tx_hash).call()
        for operation in operations['_embedded']['records']:
            if (operation['type'] == 'payment' and
                operation['to'] == destination and
                operation['asset_type'] == 'native'):
                received_amount = float(operation['amount'])
                tx_memo = transaction.get('memo', '')
                print(f"Direct op check: amount={received_amount}, memo={tx_memo}, expected_amount={expected_amount}, expected_memo={memo}")
                if tx_memo == memo and abs(received_amount - expected_amount) < 0.0001:
                    withdraw_ref.update({
                        "status": "completed",
                        "lastUpdated": firestore.SERVER_TIMESTAMP,
                        "cryptoTxHash": tx_hash
                    })
                    print(f"Withdrawal {withdraw_id} confirmed via direct check for user {user_id}")
                    return True
    except Exception as e:
        print(f"Direct tx check failed for {tx_hash}: {str(e)}")

    while datetime.now(timezone.utc) < end_time:
        try:
            # Fetch transactions with pagination
            cursor = str(int(cursor_time.timestamp() * 1000))
            transactions = (
                STELLAR_SERVER.transactions()
                .for_account(destination)
                .order(desc=False)
                .limit(100)  # Increased limit
                .cursor(cursor)
                .call()
            )
            
            records = transactions['_embedded']['records']
            if not records:
                print(f"No transactions found for {destination} since {cursor_time}")

            for transaction in records:
                tx_time = datetime.fromisoformat(transaction['created_at'].replace('Z', '+00:00'))
                print(f"Withdrawal tx check: hash={transaction['hash']}, time={tx_time}, memo={transaction.get('memo', '')}")
                
                operations = STELLAR_SERVER.operations().for_transaction(transaction['hash']).call()
                for operation in operations['_embedded']['records']:
                    if (operation['type'] == 'payment' and
                        operation['to'] == destination and
                        operation['asset_type'] == 'native'):
                        received_amount = float(operation['amount'])
                        tx_memo = transaction.get('memo', '')
                        print(f"Withdrawal op: amount={received_amount}, memo={tx_memo}, expected_amount={expected_amount}, expected_memo={memo}")
                        if tx_memo == memo and abs(received_amount - expected_amount) < 0.0001:
                            withdraw_ref.update({
                                "status": "completed",
                                "lastUpdated": firestore.SERVER_TIMESTAMP,
                                "cryptoTxHash": transaction['hash']
                            })
                            print(f"Withdrawal {withdraw_id} confirmed for user {user_id}")
                            return True
            
            # Update cursor_time to the latest transaction time
            if records:
                latest_tx_time = datetime.fromisoformat(records[-1]['created_at'].replace('Z', '+00:00'))
                cursor_time = max(cursor_time, latest_tx_time)
            
            await asyncio.sleep(5)  # Reduced sleep for faster checks
            
        except Exception as e:
            print(f"Error monitoring withdrawal for user {user_id}, withdraw_id {withdraw_id}: {str(e)}")
            await asyncio.sleep(10)
    
    withdraw_ref.update({
        "status": "timeout",
        "lastUpdated": firestore.SERVER_TIMESTAMP
    })
    print(f"Withdrawal monitoring timeout for user {user_id}, withdraw_id {withdraw_id}")
    return False


@app.route('/crypto-deposit', methods=['POST'])
async def crypto_deposit():
    try:
        data = await request.get_json()
        user_id = data.get('userId')
        amount = float(data.get('amount', 0))
        
        if not user_id or amount <= 0:
            return jsonify({"status": "error", "message": "Invalid user ID or amount"}), 400
        
        deposit_keypair = generate_deposit_keypair(user_id)
        deposit_address = deposit_keypair.public_key
        
        deposit_ref = db.collection("pending_deposits").document()
        deposit_id = deposit_ref.id
        memo = generate_memo_for_user(user_id, deposit_id)
        
        account_ready = await setup_stellar_account(deposit_keypair)
        if not account_ready:
            return jsonify({"status": "error", "message": "Failed to setup deposit account"}), 500
        
        deposit_data = {
            "userId": user_id,
            "amount": amount,
            "depositAddress": deposit_address,
            "memo": memo,
            "status": "pending",
            "createdAt": firestore.SERVER_TIMESTAMP,
            "expiresAt": firestore.SERVER_TIMESTAMP,
            "privateKey": deposit_keypair.secret
        }
        
        deposit_ref.set(deposit_data)
        
        timeout_minutes = 30
        # Pass deposit_id to monitor_deposits
        asyncio.create_task(monitor_deposits(user_id, deposit_address, amount, memo, timeout_minutes, deposit_id))
        
        return jsonify({
            "status": "success",
            "message": "Deposit address generated",
            "depositAddress": deposit_address,
            "memo": memo,
            "amount": amount,
            "currency": "XLM",
            "network": "Stellar",
            "instructions": {
                "step1": f"Send exactly {amount} XLM to the provided address",
                "step2": f"Include the memo: {memo}",
                "step3": "Wait for confirmation (usually 5-10 seconds)",
                "step4": "Funds will be credited automatically"
            },
            "timeoutMinutes": timeout_minutes,
            "depositId": deposit_id
        }), 200
    except Exception as e:
        print(f"Error generating deposit: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500



@app.route('/check-deposit-status/<deposit_id>', methods=['GET'])
async def check_deposit_status(deposit_id):
    try:
        deposit_ref = db.collection("pending_deposits").document(deposit_id)
        deposit_doc = deposit_ref.get()
        
        if not deposit_doc.exists:
            print(f"Deposit {deposit_id} not found")
            return jsonify({"status": "error", "message": "Deposit not found"}), 404
        
        deposit_data = deposit_doc.to_dict()
        
        user_id = deposit_data.get("userId")
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        balance = user_doc.to_dict().get("balance", 0) if user_doc.exists else 0
        
        print(f"Checked deposit {deposit_id}: status={deposit_data.get('status')}")
        return jsonify({
            "status": "success",
            "depositStatus": deposit_data.get("status", "pending"),
            "amount": deposit_data.get("amount"),
            "depositAddress": deposit_data.get("depositAddress"),
            "memo": deposit_data.get("memo"),
            "createdAt": deposit_data.get("createdAt").isoformat() if deposit_data.get("createdAt") else None,
            "newBalance": balance
        }), 200
    
    except Exception as e:
        print(f"Error checking deposit status {deposit_id}: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/withdraw-crypto', methods=['POST'])
async def withdraw_crypto():
    try:
        data = await request.get_json()
        user_id = data.get('userId')
        amount = float(data.get('amount', 0))
        destination = data.get('destination', '').strip()
        
        if not user_id or amount <= 0:
            return jsonify({"status": "error", "message": "Invalid user ID or amount"}), 400
        
        if not destination:
            return jsonify({"status": "error", "message": "Destination address required"}), 400
        
        if not (destination.startswith('G') and len(destination) == 56):
            return jsonify({"status": "error", "message": "Invalid Stellar address"}), 400
        
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        current_balance = user_doc.to_dict().get("balance", 0)
        
        if amount > current_balance:
            return jsonify({
                "status": "error",
                "message": "Insufficient funds",
                "currentBalance": current_balance
            }), 400
        
        # Check if master account is ready
        if not await ensure_master_account():
            return jsonify({
                "status": "error",
                "message": "System account not initialized. Please contact support."
            }), 500
        
        withdraw_ref = db.collection("pending_withdrawals").document()
        withdraw_id = withdraw_ref.id
        memo = generate_memo_for_user(user_id, withdraw_id)
        
        try:
            source_account = STELLAR_SERVER.load_account(MASTER_PUBLIC_KEY)
            transaction = (
                TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=STELLAR_NETWORK,
                    base_fee=100
                )
                .append_payment_op(
                    destination=destination,
                    amount=str(amount),
                    asset=XLM_ASSET
                )
                .add_memo(TextMemo(memo))
                .set_timeout(30)
                .build()
            )
            transaction.sign(MASTER_KEYPAIR)
            response = STELLAR_SERVER.submit_transaction(transaction)
            
            new_balance = current_balance - amount
            transaction_ref = user_ref.collection("transactions").document()
            
            withdraw_data = {
                "userId": user_id,
                "amount": amount,
                "destination": destination,
                "memo": memo,
                "status": "pending",
                "createdAt": firestore.SERVER_TIMESTAMP,
                "expiresAt": firestore.SERVER_TIMESTAMP,
                "cryptoTxHash": response['hash']
            }
            
            transaction_data = {
                "type": "withdrawal_crypto",
                "amount": amount,
                "previousBalance": current_balance,
                "newBalance": new_balance,
                "timestamp": firestore.SERVER_TIMESTAMP,
                "status": "pending",
                "withdrawalType": "crypto",
                "currency": "XLM",
                "network": "Stellar",
                "destination": destination,
                "cryptoTxHash": response['hash']
            }
            
            @firestore.transactional
            def update_in_transaction(transaction, user_ref, transaction_ref, withdraw_ref, transaction_data, withdraw_data, new_balance):
                transaction.update(user_ref, {
                    "balance": new_balance,
                    "lastUpdated": firestore.SERVER_TIMESTAMP
                })
                transaction.set(transaction_ref, transaction_data)
                transaction.set(withdraw_ref, withdraw_data)
            
            try:
                transaction = db.transaction()
                update_in_transaction(transaction, user_ref, transaction_ref, withdraw_ref, transaction_data, withdraw_data, new_balance)
            except Exception as e:
                print(f"Firestore transaction failed for withdrawId {withdraw_id}: {str(e)}")
                raise e
            
            timeout_minutes = 30
            print(f"Scheduling withdrawal monitoring for user {user_id}, withdraw_id {withdraw_id}, tx_hash {response['hash']}")
            task = asyncio.create_task(
                monitor_withdrawal(user_id, withdraw_id, destination, amount, memo, response['hash'], timeout_minutes)
            )
            task.add_done_callback(lambda t: print(f"Withdrawal monitoring task for {withdraw_id} completed: {t.result()}"))
            
            print(f"Crypto withdrawal initiated for user {user_id}, transaction ID: {response['hash']}, withdraw ID: {withdraw_id}")
            
            return jsonify({
                "status": "success",
                "message": "Crypto withdrawal initiated",
                "amount": amount,
                "destination": destination,
                "currency": "XLM",
                "network": "Stellar",
                "transactionId": response['hash'],
                "withdrawId": withdraw_id,
                "instructions": {
                    "step1": f"Sending {amount} XLM to {destination}",
                    "step2": "Transaction will be processed on the Stellar network",
                    "step3": "Wait for confirmation (usually 5-10 seconds)",
                    "step4": "Funds will be credited to your wallet automatically"
                },
                "timeoutMinutes": timeout_minutes
            }), 200
            
        except NotFoundError:
            print(f"Master account {MASTER_PUBLIC_KEY} not found during transaction")
            return jsonify({
                "status": "error",
                "message": "System account not found. Please contact support."
            }), 500
        except BadRequestError as e:
            print(f"Stellar transaction failed: {str(e)}")
            return jsonify({"status": "error", "message": f"Transaction failed: {str(e)}"}), 400
        except Exception as e:
            print(f"Error processing transaction: {str(e)}")
            return jsonify({"status": "error", "message": "Failed to submit transaction"}), 500
            
    except ValueError:
        return jsonify({"status": "error", "message": "Invalid amount format"}), 400
    except Exception as e:
        print(f"Error processing crypto withdrawal: {str(e)}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/check-withdraw-status/<withdraw_id>', methods=['GET'])
async def check_withdraw_status(withdraw_id):
    try:
        withdraw_ref = db.collection("pending_withdrawals").document(withdraw_id)
        withdraw_doc = withdraw_ref.get()
        
        if not withdraw_doc.exists:
            print(f"Withdrawal {withdraw_id} not found")
            return jsonify({"status": "error", "message": "Withdrawal not found"}), 404
        
        withdraw_data = withdraw_doc.to_dict()
        
        user_id = withdraw_data.get("userId")
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        balance = user_doc.to_dict().get("balance", 0) if user_doc.exists else 0
        
        print(f"Checked withdrawal {withdraw_id}: status={withdraw_data.get('status')}")
        return jsonify({
            "status": "success",
            "withdrawStatus": withdraw_data.get("status", "pending"),
            "amount": withdraw_data.get("amount"),
            "destination": withdraw_data.get("destination"),
            "memo": withdraw_data.get("memo"),
            "createdAt": withdraw_data.get("createdAt").isoformat() if withdraw_data.get("createdAt") else None,
            "newBalance": balance
        }), 200
    
    except Exception as e:
        print(f"Error checking withdrawal status {withdraw_id}: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/update-withdrawal-status/<withdraw_id>', methods=['POST'])
async def update_withdrawal_status(withdraw_id):
    try:
        withdraw_ref = db.collection("pending_withdrawals").document(withdraw_id)
        withdraw_doc = withdraw_ref.get()
        
        if not withdraw_doc.exists:
            print(f"Withdrawal {withdraw_id} not found")
            return jsonify({"status": "error", "message": "Withdrawal not found"}), 404
        
        withdraw_data = withdraw_doc.to_dict()
        tx_hash = withdraw_data.get("cryptoTxHash")
        destination = withdraw_data.get("destination")
        expected_amount = float(withdraw_data.get("amount"))
        memo = withdraw_data.get("memo")
        user_id = withdraw_data.get("userId")
        
        try:
            transaction = STELLAR_SERVER.transactions().transaction(tx_hash).call()
            tx_time = datetime.fromisoformat(transaction['created_at'].replace('Z', '+00:00'))
            print(f"Manual check for withdrawal {withdraw_id}: hash={tx_hash}, time={tx_time}, memo={transaction.get('memo', '')}")
            
            operations = STELLAR_SERVER.operations().for_transaction(tx_hash).call()
            for operation in operations['_embedded']['records']:
                if operation['type'] == 'payment' and operation['to'] == destination and operation['asset_type'] == 'native':
                    received_amount = float(operation['amount'])
                    tx_memo = transaction.get('memo', '')
                    print(f"Manual op check: amount={received_amount}, memo={tx_memo}, expected_amount={expected_amount}, expected_memo={memo}")
                    if tx_memo == memo and abs(received_amount - expected_amount) < 0.0001:
                        withdraw_ref.update({
                            "status": "completed",
                            "lastUpdated": firestore.SERVER_TIMESTAMP
                        })
                        # Update transaction status in user's transactions collection
                        transaction_query = db.collection("users").document(user_id).collection("transactions").where(
                            filter=FieldFilter("cryptoTxHash", "==", tx_hash)
                        )
                        transaction_docs = transaction_query.stream()
                        for doc in transaction_docs:
                            doc.reference.update({"status": "completed", "lastUpdated": firestore.SERVER_TIMESTAMP})
                        print(f"Manually updated withdrawal {withdraw_id} to completed for user {user_id}")
                        return jsonify({
                            "status": "success",
                            "message": f"Withdrawal {withdraw_id} updated to completed"
                        }), 200
            
            print(f"No matching operation found for withdrawal {withdraw_id}")
            return jsonify({
                "status": "error",
                "message": "No matching transaction found"
            }), 404
            
        except Exception as e:
            print(f"Error checking transaction for withdrawal {withdraw_id}: {str(e)}")
            return jsonify({"status": "error", "message": str(e)}), 500
    
    except Exception as e:
        print(f"Error updating withdrawal status {withdraw_id}: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500



@app.route('/transactions/<user_id>', methods=['GET'])
async def get_transactions(user_id):
    try:
        if not user_id:
            return jsonify({"status": "error", "message": "User ID required"}), 400

        # Fetch transactions subcollection
        transactions_query = db.collection("users").document(user_id).collection("transactions") \
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
        transactions = []
        for doc in transactions_query.stream():
            transaction = doc.to_dict()
            transaction["id"] = doc.id
            if "timestamp" in transaction:
                transaction["timestamp"] = transaction["timestamp"].isoformat()
            transactions.append(transaction)
        print(f"Fetched {len(transactions)} transactions for user {user_id}")

        # Fetch trades subcollection
        trades_query = db.collection("users").document(user_id).collection("trades") \
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
        trades = []
        for doc in trades_query.stream():
            trade = doc.to_dict()
            trade["id"] = doc.id
            if "timestamp" in trade:
                trade["timestamp"] = trade["timestamp"].isoformat()
            trades.append(trade)
        print(f"Fetched {len(trades)} trades for user {user_id}")

        # Separate deposits and withdrawals
        deposits = [tx for tx in transactions if tx.get("type") == "crypto_deposit"]
        withdrawals = [tx for tx in transactions if tx.get("type") == "withdrawal_crypto"]

        return jsonify({
            "status": "success",
            "trades": trades,
            "deposits": deposits,
            "withdrawals": withdrawals
        }), 200
    except Exception as e:
        print(f"Error fetching transactions for user {user_id}: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500





# @app.route('/transactions/<user_id>', methods=['GET'])
# async def get_transactions(user_id):
#     try:
#         if not user_id:
#             return jsonify({"status": "error", "message": "User ID required"}), 400

#         # Fetch transactions subcollection
#         transactions_query = db.collection("users").document(user_id).collection("transactions") \
#             .order_by("timestamp", direction=firestore.Query.DESCENDING)
#         transactions = []
#         for doc in transactions_query.stream():
#             transaction = doc.to_dict()
#             transaction["id"] = doc.id
#             if "timestamp" in transaction:
#                 if isinstance(transaction["timestamp"], datetime):
#                     transaction["timestamp"] = transaction["timestamp"].isoformat()
#                 elif isinstance(transaction["timestamp"], str):
#                     try:
#                         datetime.fromisoformat(transaction["timestamp"].replace("Z", "+00:00"))
#                     except ValueError:
#                         print(f"Invalid timestamp format for transaction {doc.id}: {transaction['timestamp']}")
#                 else:
#                     print(f"Unexpected timestamp type for transaction {doc.id}: {type(transaction['timestamp'])}")
#             transactions.append(transaction)
#         print(f"Fetched {len(transactions)} transactions for user {user_id}")

#         # Fetch trades subcollection
#         trades_query = db.collection("users").document(user_id).collection("trades") \
#             .order_by("timestamp", direction=firestore.Query.DESCENDING)
#         trades = []
#         for doc in trades_query.stream():
#             trade = doc.to_dict()
#             trade["id"] = doc.id
#             if "timestamp" in trade:
#                 if isinstance(trade["timestamp"], datetime):
#                     trade["timestamp"] = trade["timestamp"].isoformat()
#                 elif isinstance(trade["timestamp"], str):
#                     try:
#                         datetime.fromisoformat(trade["timestamp"].replace("Z", "+00:00"))
#                     except ValueError:
#                         print(f"Invalid timestamp format for trade {doc.id}: {trade['timestamp']}")
#                 else:
#                     print(f"Unexpected timestamp type for trade {doc.id}: {type(trade['timestamp'])}")
#             trades.append(trade)
#         print(f"Fetched {len(trades)} trades for user {user_id}")

#         # Separate deposits and withdrawals
#         deposits = [tx for tx in transactions if tx.get("type") == "crypto_deposit"]
#         withdrawals = [tx for tx in transactions if tx.get("type") == "withdrawal_crypto"]

#         return jsonify({
#             "status": "success",
#             "trades": trades,
#             "deposits": deposits,
#             "withdrawals": withdrawals
#         }), 200
#     except Exception as e:
#         print(f"Error fetching transactions for user {user_id}: {str(e)}")
#         return jsonify({"status": "error", "message": str(e)}), 500


async def validate_token_simple():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, jsonify({'status': 'error', 'message': 'Token required'}), 401
    id_token = auth_header.replace('Bearer ', '')
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token['uid'], None
    except Exception as e:
        return None, jsonify({'status': 'error', 'message': f'Invalid token: {str(e)}'}), 401



async def release_pending_profits():
    """Background worker to process pending profits whose release time has passed"""
    logger.info("Background worker started for pending profits")
    while True:
        try:
            current_time = datetime.now(timezone.utc)
            logger.debug(f"Checking pending profits at {current_time}")

            pending_profits_ref = db.collection_group("pending_profits").where(filter=FieldFilter("release_at", "<=", current_time))
            pending_profits = pending_profits_ref.stream()

            found_profits = False
            for pending_profit_doc in pending_profits:
                found_profits = True
                try:
                    pending_data = pending_profit_doc.to_dict()
                    user_id = pending_profit_doc.reference.parent.parent.id
                    trade_id = pending_data.get("trade_id")
                    # Convert Firestore float to Decimal
                    profit = Decimal(str(pending_data.get("profit", 0)))
                    locked_amount = Decimal(str(pending_data.get("locked_amount", 0)))
                    release_at = pending_data.get("release_at")
                    logger.debug(f"Found pending profit: user={user_id}, trade={trade_id}, profit={profit}, locked_amount={locked_amount}, release_at={release_at}")

                    user_ref = db.collection("users").document(user_id)
                    trade_ref = user_ref.collection("trades").document(trade_id)
                    pending_profit_ref = pending_profit_doc.reference

                    @firestore.transactional
                    def update_profit_transaction(transaction, user_ref, trade_ref, pending_profit_ref):
                        user_snapshot = user_ref.get(transaction=transaction)
                        if not user_snapshot.exists:
                            raise Exception("User not found")

                        trade_snapshot = trade_ref.get(transaction=transaction)
                        if not trade_snapshot.exists:
                            raise Exception(f"Trade {trade_id} not found")

                        user_data = user_snapshot.to_dict()
                        # Convert Firestore float to Decimal
                        current_pending = Decimal(str(user_data.get("pending_profit", 0)))
                        current_profit = Decimal(str(user_data.get("profit", 0)))
                        current_locked_holdings = Decimal(str(user_data.get("locked_holdings", 0)))
                        current_balance = Decimal(str(user_data.get("balance", 0)))

                        # Use Decimal for arithmetic
                        transaction.update(user_ref, {
                            "balance": float(current_balance + locked_amount),  # Convert to float for Firestore
                            "pending_profit": float(current_pending - profit),
                            "profit": float(current_profit + profit),
                            "locked_holdings": float(current_locked_holdings - locked_amount),
                            "lastUpdated": firestore.SERVER_TIMESTAMP
                        })
                        transaction.update(trade_ref, {
                            "status": "profit_released",
                            "profit_released_timestamp": firestore.SERVER_TIMESTAMP
                        })
                        transaction.delete(pending_profit_ref)
                        logger.debug(f"Transaction prepared for user={user_id}, trade={trade_id}")

                    transaction = db.transaction()
                    update_profit_transaction(transaction, user_ref, trade_ref, pending_profit_ref)
                    logger.info(f"Released pending profit {profit} and locked amount {locked_amount} to balance for user {user_id}, trade {trade_id}")

                except Exception as e:
                    logger.error(f"Failed to release pending profit for user {user_id}, trade {trade_id}: {str(e)}")

            if not found_profits:
                logger.debug("No pending profits found to release")

            await asyncio.sleep(120)

        except Exception as e:
            logger.error(f"Error in release_pending_profits worker: {str(e)}")
            await asyncio.sleep(120)

def start_background_worker():
    """Start the background worker in a separate thread with its own event loop"""
    def run_worker():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(release_pending_profits())
        loop.close()

    worker_thread = threading.Thread(target=run_worker, daemon=True)
    worker_thread.start()
    logger.info("Started background worker thread for pending profits")

@app.route('/trade', methods=['POST'])
async def create_trade():
    user_id = None
    try:
        user_id_from_token, error_response = await validate_token_simple()
        if error_response:
            return error_response

        data = await request.get_json()
        user_id = data.get('userId')
        action = data.get('action')
        # Convert input amount to Decimal
        amount = Decimal(str(data.get('amount', 0))).quantize(Decimal('0.01'), rounding=ROUND_DOWN)

        if user_id != user_id_from_token:
            return jsonify({"status": "error", "message": "Unauthorized user"}), 403

        if not (action in ['buy', 'sell'] and amount >= MIN_TRADE_AMOUNT):
            return jsonify({"status": "error", "message": f"Invalid action or amount (minimum {MIN_TRADE_AMOUNT})"}), 400

        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            return jsonify({"status": "error", "message": "User not found"}), 404

        user_data = user_doc.to_dict()
        # Convert Firestore float to Decimal
        current_balance = Decimal(str(user_data.get("balance", 0)))
        current_holdings = Decimal(str(user_data.get("holdings", 0)))
        current_pending_profit = Decimal(str(user_data.get("pending_profit", 0)))
        current_locked_holdings = Decimal(str(user_data.get("locked_holdings", 0)))

        available_holdings = current_holdings - current_locked_holdings

        if action == "buy" and amount > current_balance:
            return jsonify({"status": "error", "message": "Insufficient balance"}), 400
        if action == "sell" and amount > available_holdings:
            return jsonify({"status": "error", "message": "Insufficient available holdings"}), 400

        # Use Decimal for arithmetic
        new_balance = current_balance - amount if action == "buy" else current_balance
        new_holdings = current_holdings + amount if action == "buy" else current_holdings - amount
        trade_profit = (amount * PROFIT_RATE).quantize(Decimal('0.01'), rounding=ROUND_DOWN) if action == "sell" else Decimal('0')
        new_pending_profit = current_pending_profit + trade_profit if action == "sell" else current_pending_profit
        new_locked_holdings = current_locked_holdings + amount if action == "sell" else current_locked_holdings

        trade_ref = user_ref.collection("trades").document()
        trade_data = {
            "action": action,
            "amount": float(amount),  # Convert to float for Firestore
            "balance": float(new_balance),
            "holdings": float(new_holdings),
            "profit": float(trade_profit),
            "timestamp": firestore.SERVER_TIMESTAMP,
            "status": "pending" if action == "sell" else "completed"
        }

        pending_profit_data = None
        if action == "sell":
            pending_profit_data = {
                "trade_id": trade_ref.id,
                "profit": float(trade_profit),
                "locked_amount": float(amount),
                "release_at": datetime.now(timezone.utc) + timedelta(seconds=60)
            }
            logger.debug(f"Creating pending profit for trade {trade_ref.id}: profit={trade_profit}, locked_amount={amount}, release_at={datetime.now(timezone.utc) + timedelta(seconds=60)}")

        @firestore.transactional
        def update_in_transaction(transaction, user_ref, trade_ref, trade_data, new_balance, new_holdings, new_pending_profit, new_locked_holdings, pending_profit_data):
            transaction.update(user_ref, {
                "balance": float(new_balance),  # Convert to float for Firestore
                "holdings": float(new_holdings),
                "pending_profit": float(new_pending_profit),
                "locked_holdings": float(new_locked_holdings),
                "lastUpdated": firestore.SERVER_TIMESTAMP
            })
            transaction.set(trade_ref, trade_data)
            if pending_profit_data:
                pending_profit_ref = user_ref.collection("pending_profits").document()
                transaction.set(pending_profit_ref, pending_profit_data)
                logger.debug(f"Pending profit document created: {pending_profit_ref.id}")
            logger.info(f"Transaction prepared for trade ID {trade_ref.id}")

        transaction = db.transaction()
        update_in_transaction(transaction, user_ref, trade_ref, trade_data, new_balance, new_holdings, new_pending_profit, new_locked_holdings, pending_profit_data)
        logger.info(f"Trade saved for user {user_id}, trade ID: {trade_ref.id}")

        return jsonify({
            "status": "success",
            "message": f"{action.capitalize()} trade successful",
            "newBalance": float(new_balance),  # Convert to float for JSON response
            "newHoldings": float(new_holdings),
            "newPendingProfit": float(new_pending_profit),
            # "newLockedHoldings": float(new_locked_holdings),
            "newLockedHoldings": float(new_locked_holdings),  # Included in response
            "tradeId": trade_ref.id
        }), 200

    except Exception as e:
        logger.error(f"Trade processing failed. User: {user_id or 'Unknown'}, Error: {str(e)}")
        if "index" in str(e).lower():
            return jsonify({"status": "error", "message": "Firestore index required"}), 400
        return jsonify({"status": "error", "message": f"Failed to process trade: {str(e)}"}), 500




async def validate_token_simple():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, jsonify({'status': 'error', 'message': 'Token required'}), 401
    id_token = auth_header.replace('Bearer ', '')
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token['uid'], None
    except Exception as e:
        return None, jsonify({'status': 'error', 'message': f'Invalid token: {str(e)}'}), 401

@app.route('/user/profit', methods=['GET', 'OPTIONS'])
async def get_user_profit():
    if request.method == 'OPTIONS':
        return '', 200  # Respond to preflight request

    user_id = None
    try:
        user_id_from_token, error_response = await validate_token_simple()
        if error_response:
            return error_response

        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({"status": "error", "message": "userId is required"}), 400

        if user_id != user_id_from_token:
            return jsonify({"status": "error", "message": "Unauthorized user"}), 403

        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            return jsonify({"status": "error", "message": "User not found"}), 404

        user_data = user_doc.to_dict()
        profit = user_data.get("profit", 0)

        print(f"[INFO] Fetched profit {profit} for user {user_id}")
        return jsonify({
            "status": "success",
            "profit": profit
        }), 200

    except Exception as e:
        print(f"[ERROR] Failed to fetch profit for user {user_id or 'Unknown'}: {str(e)}")
        return jsonify({"status": "error", "message": f"Failed to fetch profit: {str(e)}"}), 500










@app.route('/target/<user_id>', methods=['POST'])
async def set_target(user_id):
    try:
        user_id_from_token, error_response = await validate_token_simple()
        if error_response:
            return error_response

        if user_id != user_id_from_token:
            return jsonify({"status": "error", "message": "Unauthorized user"}), 403

        data = await request.get_json()
        target = float(data.get('target', 0))
        if target < 0:
            return jsonify({"status": "error", "message": "Target cannot be negative"}), 400

        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            return jsonify({"status": "error", "message": "User not found"}), 404

        user_ref.update({
            "target": target,
            "lastUpdated": firestore.SERVER_TIMESTAMP
        })

        print(f"Profit target set to {target} for user {user_id}")
        return jsonify({
            "status": "success",
            "message": "Target set",
            "target": target
        }), 200
    except Exception as e:
        print(f"Error setting target for user {user_id}: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

        


@app.route('/withdraw/profit', methods=['POST'])
async def withdraw_profit():
    try:
        data = await request.get_json()
        user_id = data.get('userId')
        amount = float(data.get('amount'))
        
        if not user_id or amount <= 0:
            return jsonify({"error": "Invalid request"}), 400
            
        # Get user reference
        user_ref = db.collection('users').document(user_id)
        
        # Transaction to ensure atomic update
        @firestore.transactional
        def update_balance(transaction, user_ref, amount):
            snapshot = user_ref.get(transaction=transaction)
            if not snapshot.exists:
                return {"error": "User not found"}
                
            user_data = snapshot.to_dict()
            current_profit = user_data.get('profit', 0)
            current_balance = user_data.get('balance', 0)
            
            if amount > current_profit:
                return {"error": "Withdrawal amount exceeds available profit"}
            
            # Update balances
            new_profit = current_profit - amount
            new_balance = current_balance + amount
            
            # Update user document
            transaction.update(user_ref, {
                'profit': new_profit,
                'balance': new_balance,
                'last_withdrawal': firestore.SERVER_TIMESTAMP
            })
            
            # Record withdrawal transaction
            withdrawal_ref = user_ref.collection('withdrawals_profit').document()
            transaction.set(withdrawal_ref, {
                'amount': amount,
                'timestamp': firestore.SERVER_TIMESTAMP,
                'status': 'completed'
            })
            
            return {
                "new_profit": new_profit,
                "new_balance": new_balance
            }
        
        transaction = db.transaction()
        result = update_balance(transaction, user_ref, amount)
        
        if 'error' in result:
            return jsonify({"status": "error", "message": result['error']}), 400
            
        return jsonify({
            "status": "success",
            "new_profit": result['new_profit'],
            "new_balance": result['new_balance']
        }), 200
        
    except Exception as e:
        logger.error(f"Withdrawal failed: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500




# print(f"BYBIT_API_KEY loaded: {bool(BYBIT_API_KEY)}")
# print(f"BYBIT_SECRET loaded: {bool(BYBIT_SECRET)}")

# Cache for market caps with TTL
market_cap_cache = defaultdict(lambda: {"value": None, "timestamp": 0})
cache_lock = Lock()  # Thread-safe access to cache
CACHE_TTL_SECONDS = 60  # Cache market caps for 60 seconds

def generate_signature(secret, message):
    """Generate HMAC SHA256 signature for Bybit API."""
    return hmac.new(
        secret.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

def get_bybit_tickers():
    """Get ticker data directly with proper formatting."""
    try:
        print("Fetching market data directly...")
        timestamp = int(time.time() * 1000)
        recv_window = "5000"
        params = "category=spot"
        
        # Create the signature
        message = f"{timestamp}{BYBIT_API_KEY}{recv_window}{params}"
        signature = generate_signature(BYBIT_SECRET, message)
        
        headers = {
            "X-BAPI-API-KEY": BYBIT_API_KEY,
            "X-BAPI-TIMESTAMP": str(timestamp),
            "X-BAPI-RECV-WINDOW": recv_window,
            "X-BAPI-SIGN": signature,
        }
        
        url = f"https://api.bybit.com/v5/market/tickers?{params}"
        print(f"Requesting all tickers: {url}")
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("retCode") != 0:
            error_msg = data.get("retMsg", "Unknown Bybit error")
            print(f"Bybit API error: {error_msg}")
            return None
            
        # Log the raw ticker data for debugging
        print(f"Raw ticker data sample: {data['result']['list'][:2]}")
        return data["result"]["list"]
        
    except Exception as e:
        print(f"Error fetching tickers: {e}")
        return None

def get_market_caps(symbols):
    """Fetch market caps for multiple symbols in a single request from CoinGecko with caching."""
    cache_key = tuple(sorted(symbols))  # Use sorted tuple of symbols as cache key
    current_time = time.time()

    with cache_lock:
        cached = market_cap_cache[cache_key]
        if cached["value"] and (current_time - cached["timestamp"]) < CACHE_TTL_SECONDS:
            print(f"Returning cached market caps for {len(symbols)} symbols")
            return cached["value"]

    try:
        # Map Bybit symbols to CoinGecko coin IDs
        coin_id_mapping = {
            "BTCUSDT": "bitcoin",
            "ETHUSDT": "ethereum",
            "BNBUSDT": "binancecoin",
            "ADAUSDT": "cardano",
            "SOLUSDT": "solana",
            "XRPUSDT": "ripple",
            "DOTUSDT": "polkadot",
            "DOGEUSDT": "dogecoin",
            "AVAXUSDT": "avalanche-2",
            "MATICUSDT": "polygon",
            "LINKUSDT": "chainlink",
            "LTCUSDT": "litecoin",
            "UNIUSDT": "uniswap",
            "ATOMUSDT": "cosmos",
            "FILUSDT": "filecoin",
            "TRXUSDT": "tron",
            "ETCUSDT": "ethereum-classic",
            "XLMUSDT": "stellar",
            "VETUSDT": "vechain",
            "ICPUSDT": "internet-computer",
            "FTMUSDT": "fantom",
            "HBARUSDT": "hedera",
            "NEARUSDT": "near",
            "AAVEUSDT": "aave",
            "ALGOUSDT": "algorand",
            "SANDUSDT": "the-sandbox",
            "MANAUSDT": "decentraland"
        }
        
        coin_ids = [coin_id_mapping.get(symbol, symbol.replace("USDT", "").lower()) for symbol in symbols]
        url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={','.join(coin_ids)}"
        print(f"Requesting market caps from CoinGecko: {url}")
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        market_caps = {f"{d['symbol'].upper()}USDT": str(d['market_cap']) for d in data if 'market_cap' in d}
        
        # Store in cache
        with cache_lock:
            market_cap_cache[cache_key] = {"value": market_caps, "timestamp": current_time}
            # Clean up expired cache entries
            expired_keys = [k for k, v in market_cap_cache.items() if (current_time - v["timestamp"]) >= CACHE_TTL_SECONDS]
            for k in expired_keys:
                del market_cap_cache[k]
        
        return market_caps
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:  # Rate limit exceeded
            print("CoinGecko rate limit exceeded, sleeping for 60 seconds")
            time.sleep(60)
            return get_market_caps(symbols)  # Retry after sleep
        print(f"Error fetching market caps: {e}")
        return {symbol: "N/A" for symbol in symbols}
    except requests.exceptions.RequestException as e:
        print(f"Error fetching market caps: {e}")
        return {symbol: "N/A" for symbol in symbols}
    

@app.route('/api/market-data')
def market_data():
    try:
        print("\n=== Starting market data request ===")
        
        # Get all ticker data
        all_tickers = get_bybit_tickers()
        if all_tickers is None:
            return jsonify({
                "error": "Service temporarily unavailable",
                "code": "SERVICE_UNAVAILABLE"
            }), 503
            
        print(f"Received {len(all_tickers)} tickers")
        
        desired_symbols = [
            "BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "SOLUSDT", "XRPUSDT",
            "DOTUSDT", "DOGEUSDT", "AVAXUSDT", "MATICUSDT", "LINKUSDT", "LTCUSDT",
            "UNIUSDT", "ATOMUSDT", "FILUSDT", "TRXUSDT", "ETCUSDT", "XLMUSDT",
            "VETUSDT", "ICPUSDT", "FTMUSDT", "HBARUSDT", "NEARUSDT", "AAVEUSDT",
            "ALGOUSDT", "SANDUSDT", "MANAUSDT"
        ]
        
        # Fetch market caps in batch
        market_caps = get_market_caps(desired_symbols)
        
        result = []
        for ticker in all_tickers:
            if ticker["symbol"] in desired_symbols:
                # Calculate open price from 24h change if not directly available
                last_price = float(ticker["lastPrice"])
                price_change_percent = float(ticker["price24hPcnt"]) * 100
                open_price = last_price / (1 + price_change_percent / 100) if price_change_percent != 0 else last_price
                
                # Map turnover24h to volume24h (Bybit's field for 24h volume in quote currency)
                volume = ticker.get("turnover24h", "N/A")
                
                result.append({
                    "symbol": ticker["symbol"],
                    "lastPrice": ticker["lastPrice"],
                    "price24hPcnt": ticker["price24hPcnt"],
                    "volume24h": volume,
                    "highPrice24h": ticker.get("highPrice24h", "N/A"),
                    "lowPrice24h": ticker.get("lowPrice24h", "N/A"),
                    "marketCap": market_caps.get(ticker["symbol"], "N/A"),
                    "openPrice": str(open_price)
                })
        
        print(f"Filtered to {len(result)} market data entries")
        return jsonify(result)
        
    except requests.exceptions.Timeout:
        print("Request timeout occurred")
        return jsonify({
            "error": "Request timeout",
            "code": "TIMEOUT"
        }), 504
        
    except requests.exceptions.ConnectionError:
        print("Connection error occurred")
        return jsonify({
            "error": "Connection failed",
            "code": "CONNECTION_ERROR"
        }), 503
        
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({
            "error": "Service temporarily unavailable",
            "code": "INTERNAL_ERROR"
        }), 500

@app.route('/api/chart-data')
def chart_data():
    try:
        symbol = request.args.get('symbol')
        if not symbol:
            return jsonify({"error": "Symbol parameter is required"}), 400
        
        print(f"\n=== Fetching chart data for {symbol} ===")
        
        # Get kline/candlestick data for the last 24 hours
        timestamp = int(time.time() * 1000)
        recv_window = "5000"
        params = f"category=spot&symbol={symbol}&interval=60&limit=24"
        
        # Create the signature
        message = f"{timestamp}{BYBIT_API_KEY}{recv_window}{params}"
        signature = generate_signature(BYBIT_SECRET, message)
        
        headers = {
            "X-BAPI-API-KEY": BYBIT_API_KEY,
            "X-BAPI-TIMESTAMP": str(timestamp),
            "X-BAPI-RECV-WINDOW": recv_window,
            "X-BAPI-SIGN": signature,
        }
        
        url = f"https://api.bybit.com/v5/market/kline?{params}"
        print(f"Requesting chart data: {url}")
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("retCode") != 0:
            error_msg = data.get("retMsg", "Unknown Bybit error")
            print(f"Bybit API error for {symbol}: {error_msg}")
            print(f"Full Bybit response: {data}")
            return jsonify({
                "error": f"Chart data temporarily unavailable: {error_msg}",
                "code": "SERVICE_UNAVAILABLE"
            }), 503
        
        # Process kline data into chart format
        klines = data["result"]["list"]
        print(f"Raw kline data sample for {symbol}: {klines[:2]}")
        chart_data = []
        
        for kline in reversed(klines):  # Reverse to get chronological order
            chart_data.append({
                "timestamp": int(kline[0]),
                "price": float(kline[4]),  # Close price
                "open": float(kline[1]),
                "high": float(kline[2]),
                "low": float(kline[3]),
                "volume": float(kline[5])
            })
        
        print(f"Processed {len(chart_data)} chart data points for {symbol}")
        return jsonify(chart_data)
        
    except requests.exceptions.Timeout:
        print(f"Chart data request timeout for {symbol}")
        return jsonify({
            "error": "Request timeout",
            "code": "TIMEOUT"
        }), 504
        
    except requests.exceptions.ConnectionError:
        print(f"Chart data connection error for {symbol}")
        return jsonify({
            "error": "Connection failed",
            "code": "CONNECTION_ERROR"
        }), 503
        
    except Exception as e:
        print(f"Chart data error for {symbol}: {str(e)}")
        return jsonify({
            "error": "Chart data temporarily unavailable",
            "code": "INTERNAL_ERROR"
        }), 500



@app.route('/activate-subscription', methods=['POST'])
async def activate_subscription():
    try:
        data = await request.get_json()
        user_id = data.get('userId')
        
        if not user_id:
            logger.warning("Missing userId in /activate-subscription request")
            return jsonify({"status": "error", "message": "User ID required"}), 400
        
        # Generate verification code
        def generate_verification_code(session_id, user_id):
            combined = session_id + (user_id or '')
            hash_int = int(hashlib.sha256(combined.encode()).hexdigest(), 16)
            return str(hash_int)[:6]
        
        verification_code = generate_verification_code("7klR1Pi0PcSt0OdbgfE7fxBsCFj2", user_id)
        logger.debug(f"Generated verification code {verification_code} for user {user_id}")
        
        # Check if user document exists - using synchronous get()
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()  # Remove await - this is synchronous
        
        if not user_doc.exists:
            logger.error(f"User document not found for user_id: {user_id}")
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        # Update user document - using synchronous update()
        user_ref.update({
            "is_premium": True,
            "premium_since": datetime.now(timezone.utc).isoformat(),
            "verification_code": verification_code
        })
        logger.info(f"Successfully updated Firestore for user {user_id}")
        
        return jsonify({
            "status": "success",
            "message": "Subscription activated successfully",
            "verification_code": verification_code
        }), 200
        
    except Exception as e:
        logger.error(f"Error in /activate-subscription for user {user_id}: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500

# @app.route('/activate-subscription', methods=['POST'])
# async def activate_subscription():
#     try:
#         data = await request.get_json()
#         user_id = data.get('userId')
        
#         if not user_id:
#             logger.warning("Missing userId in /activate-subscription request")
#             return jsonify({"status": "error", "message": "User ID required"}), 400
        
#         # Generate verification code
#         def generate_verification_code(session_id, user_id):
#             combined = session_id + (user_id or '')
#             hash_int = int(hashlib.sha256(combined.encode()).hexdigest(), 16)
#             return str(hash_int)[:6]
        
#         verification_code = generate_verification_code("7klR1Pi0PcSt0OdbgfE7fxBsCFj2", user_id)
#         logger.debug(f"Generated verification code {verification_code} for user {user_id}")
        
#         # Check if user document exists
#         user_ref = db.collection("users").document(user_id)
#         user_doc = user_ref.get()
        
#         if not user_doc.exists:
#             logger.error(f"User document not found for user_id: {user_id}")
#             return jsonify({"status": "error", "message": "User not found"}), 404
        
#         # Update user document
#         update_data = {
#             "is_premium": True,
#             "premium_since": datetime.now(timezone.utc).isoformat(),
#             "verification_code": verification_code,
#             "last_updated": datetime.now(timezone.utc).isoformat()
#         }
        
#         user_ref.update(update_data)
#         logger.info(f"Successfully updated Firestore for user {user_id}")
        
#         return jsonify({
#             "status": "success",
#             "message": "Subscription activated successfully",
#             "verification_code": verification_code,
#             "user_id": user_id
#         }), 200
        
#     except Exception as e:
#         logger.error(f"Error in /activate-subscription for user {user_id}: {str(e)}", exc_info=True)
#         return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/verify-code', methods=['POST'])
async def verify_code():
    try:
        data = await request.get_json()
        user_id = data.get('userId')
        code = data.get('code')
        
        if not user_id or not code:
            logger.warning("Missing userId or code in /verify-code request")
            return jsonify({"status": "error", "message": "User ID and code required"}), 400
        
        # Get user document - synchronous operation
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()  # No await needed
        
        if not user_doc.exists:
            logger.error(f"User document not found for user_id: {user_id}")
            return jsonify({"status": "error", "message": "User not found"}), 404
            
        user_data = user_doc.to_dict()
        
        # Check subscription status
        if not user_data.get("is_premium", False):
            logger.info(f"User {user_id} does not have an active subscription")
            return jsonify({
                "status": "error",
                "message": "Subscription required",
                "verified": False
            }), 403
            
        # Verify code
        if user_data.get("verification_code") == code:
            logger.info(f"Verification code validated for user {user_id}")
            return jsonify({
                "status": "success",
                "verified": True
            }), 200
        else:
            logger.info(f"Invalid verification code for user {user_id}")
            return jsonify({
                "status": "success",
                "verified": False
            }), 200
            
    except Exception as e:
        logger.error(f"Error in /verify-code for user {user_id}: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500
    

@app.route('/check-subscription', methods=['POST'])
async def check_subscription():
    try:
        data = await request.get_json()
        user_id = data.get('userId')
        
        if not user_id:
            logger.warning("Missing userId in /check-subscription request")
            return jsonify({
                'status': 'error',
                'message': 'User ID is required'
            }), 400
        
        # Check primary user database
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            logger.error(f"User document not found for user_id: {user_id}")
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        user_data = user_doc.to_dict()
        is_premium = user_data.get('is_premium', False)
        verification_code = user_data.get('verification_code', '')
        
        # Return both subscription status and verification code
        return jsonify({
            'status': 'success',
            'hasSubscription': is_premium,
            'verification_code': verification_code if is_premium else None,
            'message': 'Subscription status retrieved successfully'
        })
        
    except Exception as e:
        logger.error(f"Error in /check-subscription for user {user_id}: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }), 500

@app.route('/debit-for-search', methods=['POST'])
async def debit_for_search():
    try:
        data = await request.get_json()
        user_id = data.get('userId')
        amount = float(data.get('amount', 20.0))  # Default to 10 XLM

        if not user_id:
            logger.error("Debit failed: User ID not provided")
            return jsonify({
                "status": "error",
                "message": "User ID required",
                "code": "MISSING_USER_ID"
            }), 400

        logger.info(f"Processing debit request for user {user_id}, amount {amount} XLM")

        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            logger.error(f"User not found: {user_id}")
            return jsonify({
                "status": "error",
                "message": "User not found",
                "code": "USER_NOT_FOUND"
            }), 404

        user_data = user_doc.to_dict()
        current_balance = float(user_data.get("balance", 0))
        
        if current_balance < amount:
            logger.warning(f"Insufficient balance for user {user_id}: {current_balance} < {amount}")
            return jsonify({
                "status": "error",
                "message": "Insufficient XLM balance",
                "currentBalance": current_balance,
                "requiredAmount": amount,
                "code": "INSUFFICIENT_BALANCE"
            }), 402

        @firestore.transactional
        def update_balance(transaction):
            snapshot = user_ref.get(transaction=transaction)
            balance = float(snapshot.get("balance"))
            
            if balance < amount:
                return False, balance, None
            
            new_balance = balance - amount
            transaction.update(user_ref, {
                "balance": new_balance,
                "lastUpdated": firestore.SERVER_TIMESTAMP
            })
            
            tx_ref = user_ref.collection("transactions").document()
            tx_data = {
                "type": "search_fee",
                "amount": -amount,
                "previousBalance": balance,
                "newBalance": new_balance,
                "timestamp": firestore.SERVER_TIMESTAMP,
                "status": "completed",
                "description": "Search operation debit"
            }
            transaction.set(tx_ref, tx_data)
            return True, new_balance, tx_ref.id

        transaction = db.transaction()
        success, new_balance, tx_id = update_balance(transaction)
        
        if not success:
            logger.warning(f"Balance changed during transaction for user {user_id}")
            return jsonify({
                "status": "error",
                "message": "Balance changed during transaction",
                "currentBalance": new_balance,
                "code": "CONCURRENT_MODIFICATION"
            }), 409

        logger.info(f"Successfully debited {amount} XLM from user {user_id}. New balance: {new_balance}")
        return jsonify({
            "status": "success",
            "message": "Payment processed",
            "amountDebited": amount,
            "newBalance": new_balance,
            "transactionId": tx_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Invalid amount format",
            "code": "INVALID_AMOUNT"
        }), 400
    except Exception as e:
        logger.error(f"Server error during debit: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": "Internal server error",
            "code": "INTERNAL_ERROR"
        }), 500















@dataclass
class Investor:
    user_id: str
    allocation_pct: float
    high_water_mark: float = 0.0
    balance: float = 0.0
    initial_balance: float = 0.0
    drawdown_limit: float = 0.2  # Default 20% drawdown limit

@dataclass
class Manager:
    user_id: str
    capital: float = 0.0
    fee_earnings: float = 0.0
    min_capital_ratio: float = 0.2  # Manager must contribute at least 20% of investor capital

class PAMMEngine:
    def __init__(self):
        self.db = firestore.client()
        self.investors: Dict[str, Investor] = {}
        self.manager: Optional[Manager] = None
        self.performance_fee = 0.20  # 20% fee
        self.lock = Lock()
    
    async def initialize_manager(self, user_id: str, initial_capital: float = 0.0):
        """Register the manager with initial capital"""
        with self.lock:
            if self.manager is not None:
                raise ValueError("Manager already registered")
            
            # Validate minimum capital
            if initial_capital <= 0:
                raise ValueError("Manager must contribute positive capital")
            
            # Create manager document
            manager_ref = self.db.collection("pamm_managers").document(user_id)
            manager_ref.set({
                "user_id": user_id,
                "capital": initial_capital,
                "fee_earnings": 0.0,
                "min_capital_ratio": 0.2,  # Store minimum ratio
                "updated_at": firestore.SERVER_TIMESTAMP
            })
            
            self.manager = Manager(
                user_id=user_id,
                capital=initial_capital,
                min_capital_ratio=0.2
            )
            
            return {
                "user_id": user_id,
                "capital": initial_capital,
                "fee_earnings": 0.0
            }

    async def add_investor(self, user_id: str, allocation_pct: float, drawdown_limit: float = 0.2):
        """Register an investor with allocation percentage and drawdown limit"""
        with self.lock:
            if user_id in self.investors:
                raise ValueError("Investor already exists")

        
            total_allocation = sum(inv.allocation_pct for inv in self.investors.values())
            if total_allocation + allocation_pct > 1.0:
                raise ValueError(f"Total allocation would exceed 100%: current={total_allocation}, requested={allocation_pct}")
        
        # Rest of the code...
            
            # Validate allocation
            if not (0 < allocation_pct <= 1):
                raise ValueError("Allocation must be between 0 and 1")
            
            # Validate drawdown limit
            if not (0 < drawdown_limit <= 1):
                raise ValueError("Drawdown limit must be between 0 and 1")
            
            # Get user balance
            user_ref = self.db.collection("users").document(user_id)
            user_doc = user_ref.get()
            if not user_doc.exists:
                raise ValueError("User does not exist")
            
            user_balance = user_doc.to_dict().get("balance", 0.0)
            
            # Check manager has sufficient capital
            if self.manager:
                required_manager_capital = user_balance * self.manager.min_capital_ratio
                if self.manager.capital < required_manager_capital:
                    raise ValueError(
                        f"Manager needs at least ${required_manager_capital:.2f} "
                        f"capital to accept this investment (min {self.manager.min_capital_ratio*100}%)"
                    )
            
            # Create investor document
            investor_ref = self.db.collection("pamm_investors").document(user_id)
            investor_ref.set({
                "user_id": user_id,
                "allocation_pct": allocation_pct,
                "balance": user_balance,
                "initial_balance": user_balance,
                "high_water_mark": user_balance,
                "drawdown_limit": drawdown_limit,
                "updated_at": firestore.SERVER_TIMESTAMP
            })
            
            self.investors[user_id] = Investor(
                user_id=user_id,
                allocation_pct=allocation_pct,
                high_water_mark=user_balance,
                balance=user_balance,
                initial_balance=user_balance,
                drawdown_limit=drawdown_limit
            )
            
            return {
                "user_id": user_id,
                "allocation_pct": allocation_pct,
                "balance": user_balance,
                "high_water_mark": user_balance,
                "drawdown_limit": drawdown_limit
            }

    async def check_drawdown_limits(self):
        """Check all investors' drawdown limits and liquidate if breached"""
        with self.lock:
            investors_ref = self.db.collection("pamm_investors")
            investors_snapshot = investors_ref.get()
            
            liquidated_investors = []
            
            for doc in investors_snapshot:
                investor_data = doc.to_dict()
                user_id = investor_data["user_id"]
                
                initial = investor_data["initial_balance"]
                current = investor_data["balance"]
                drawdown = (initial - current) / initial if initial > 0 else 0
                
                if drawdown >= investor_data.get("drawdown_limit", 0.2):
                    # Liquidate this investor
                    investor_ref = investors_ref.document(user_id)
                    
                    # Return remaining funds to user
                    user_ref = self.db.collection("users").document(user_id)
                    await user_ref.update({
                        "balance": firestore.Increment(current),
                        "updated_at": firestore.SERVER_TIMESTAMP
                    })
                    
                    # Remove from PAMM
                    await investor_ref.delete()
                    if user_id in self.investors:
                        del self.investors[user_id]
                    
                    liquidated_investors.append({
                        "user_id": user_id,
                        "initial_balance": initial,
                        "final_balance": current,
                        "drawdown": drawdown
                    })
            
            return liquidated_investors


async def distribute_profits(self, total_profit: float) -> Dict[str, Any]:
    with self.lock:
        liquidated = await self.check_drawdown_limits()
        if liquidated:
            logging.warning(f"Liquidated {len(liquidated)} investors due to drawdown limits")
        
        if not self.manager:
            raise ValueError("Manager not initialized")
        
        distribution_details = []
        total_fees = 0.0
        performance_fee = 0.20  # Explicitly set 20% fee
        
        investors_ref = self.db.collection("pamm_investors")
        investors_snapshot = investors_ref.get()
        
        total_allocation = sum(inv.get("allocation_pct", 0) for inv in investors_snapshot)
        allocation_factor = 1.0 if total_allocation == 0 else min(1.0, total_allocation)
        adjusted_profit = total_profit * allocation_factor
        
        logging.info(f"Distributing profit: {total_profit}, total_allocation: {total_allocation}, adjusted_profit: {adjusted_profit}")
        
        for doc in investors_snapshot:
            investor_data = doc.to_dict()
            user_id = investor_data["user_id"]
            
            profit_share = adjusted_profit * investor_data["allocation_pct"] / allocation_factor if allocation_factor > 0 else 0
            new_balance = investor_data["balance"] + profit_share
            fee = max(0, (new_balance - investor_data["high_water_mark"]) * performance_fee)
            net_amount = profit_share - fee
            total_fees += fee
            
            logging.info(f"Investor {user_id}: profit_share={profit_share}, fee={fee}, new_balance={new_balance}, "
                        f"high_water_mark={investor_data['high_water_mark']}")
            
            investor_ref = investors_ref.document(user_id)
            investor_ref.update({
                "balance": firestore.Increment(net_amount),
                "high_water_mark": firestore.Increment(net_amount),
                "updated_at": firestore.SERVER_TIMESTAMP
            })
            
            user_ref = self.db.collection("users").document(user_id)
            user_ref.update({
                "balance": firestore.Increment(net_amount),
                "updated_at": firestore.SERVER_TIMESTAMP
            })
            
            distribution_details.append({
                "user_id": user_id,
                "profit_share": profit_share,
                "fee": fee,
                "new_balance": new_balance
            })
        
        if total_fees > 0:
            manager_ref = self.db.collection("pamm_managers").document(self.manager.user_id)
            manager_ref.update({
                "fee_earnings": firestore.Increment(total_fees),
                "updated_at": firestore.SERVER_TIMESTAMP
            })
            
            user_ref = self.db.collection("users").document(self.manager.user_id)
            user_ref.update({
                "balance": firestore.Increment(total_fees),
                "updated_at": firestore.SERVER_TIMESTAMP
            })
            
            self.manager.fee_earnings += total_fees
        
        distribution_ref = self.db.collection("pamm_distributions").document()
        distribution_ref.set({
            "amount": total_profit,
            "fees": total_fees,
            "investor_count": len(investors_snapshot),
            "liquidated_count": len(liquidated),
            "timestamp": firestore.SERVER_TIMESTAMP,
            "details": distribution_details,
            "liquidated_investors": liquidated
        })
        
        return {
            "total_profit": total_profit,
            "total_fees": total_fees,
            "investor_count": len(investors_snapshot),
            "liquidated_count": len(liquidated),
            "distribution_id": distribution_ref.id
        }

# Initialize the PAMM engine
pamm_engine = PAMMEngine()







# Simplified firebase_auth_required decorator without role checks
def firebase_auth_required(f):
    @wraps(f)
    async def decorated_function(*args, **kwargs):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                logger.error("No Bearer token provided")
                return jsonify({'status': 'error', 'message': 'Authorization token required'}), 401

            token = auth_header.split('Bearer ')[1]
            decoded_token = auth.verify_id_token(token)
            user_id = decoded_token['uid']

            db = firestore.client()
            user_ref = db.collection('users').document(user_id)
            user_doc = user_ref.get()

            if not user_doc.exists:
                logger.error(f"User {user_id} not found in Firestore")
                return jsonify({'status': 'error', 'message': 'User not found'}), 404

            user_data = user_doc.to_dict()

            request.user_id = user_id
            request.user_data = user_data
            return await f(*args, **kwargs)

        except auth.InvalidIdTokenError:
            logger.error("Invalid ID token")
            return jsonify({'status': 'error', 'message': 'Invalid token'}), 401
        except auth.ExpiredIdTokenError:
            logger.error("Expired ID token")
            return jsonify({'status': 'error', 'message': 'Token expired'}), 401
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return jsonify({'status': 'error', 'message': str(e)}), 500

    return decorated_function



@app.route('/pamm/join', methods=['POST'])
@firebase_auth_required
async def join_pamm():
    try:
        data = await request.get_json()
        user_id = request.user_id
        allocation = data.get('allocation')
        drawdown_limit = data.get('drawdown_limit', 0.2)  # Default 20%
        
        if not allocation or not isinstance(allocation, (int, float)) or allocation <= 0 or allocation > 1:
            return jsonify({
                "status": "error",
                "message": "Allocation must be a number between 0 and 1"
            }), 400
            
        if not isinstance(drawdown_limit, (int, float)) or drawdown_limit <= 0 or drawdown_limit > 1:
            return jsonify({
                "status": "error",
                "message": "Drawdown limit must be between 0 and 1"
            }), 400
        
        # Add investor with drawdown limit
        investor_data = await pamm_engine.add_investor(
            user_id, 
            float(allocation),
            float(drawdown_limit)
        )
        
        return jsonify({
            "status": "success",
            "message": "Successfully joined PAMM system",
            "investor": investor_data
        })
    
    except ValueError as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    except Exception as e:
        logging.error(f"Error joining PAMM: {str(e)}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500
    

# @app.route('/pamm/init-manager', methods=['POST'])
# @firebase_auth_required
# async def init_manager():
#     try:
#         data = await request.get_json()
#         user_id = request.user_id
#         initial_capital = float(data.get('initial_capital', 0))
        
#         if initial_capital <= 0:
#             return jsonify({
#                 "status": "error",
#                 "message": "Initial capital must be positive"
#             }), 400
        
#         # Check if manager already exists (synchronous)
#         manager_ref = db.collection("pamm_managers").document(user_id)
#         manager_doc = manager_ref.get()
#         if manager_doc.exists:
#             return jsonify({
#                 "status": "error",
#                 "message": "Manager already initialized"
#             }), 400
        
#         # Initialize manager (synchronous)
#         manager_ref.set({
#             "user_id": user_id,
#             "is_manager": True,
#             "capital": initial_capital,
#             "fee_earnings": 0.0,
#             "updated_at": firestore.SERVER_TIMESTAMP
#         })
        
#         return jsonify({
#             "status": "success",
#             "message": "Manager initialized successfully",
#             "manager": {
#                 "user_id": user_id,
#                 "capital": initial_capital,
#                 "fee_earnings": 0.0
#             }
#         })
    
#     except ValueError as e:
#         return jsonify({"status": "error", "message": str(e)}), 400
#     except Exception as e:
#         logging.error(f"Error initializing manager: {str(e)}")
#         return jsonify({"status": "error", "message": "Internal server error"}), 500



@app.route('/pamm/init-manager', methods=['POST'])
@firebase_auth_required
async def init_manager():
    try:
        data = await request.get_json()
        user_id = request.user_id
        initial_capital = float(data.get('initial_capital', 0))
        
        if initial_capital <= 0:
            return jsonify({
                "status": "error",
                "message": "Initial capital must be positive"
            }), 400
        
        # References to Firestore documents
        user_ref = db.collection("users").document(user_id)
        manager_ref = db.collection("pamm_managers").document(user_id)
        
        # Run a transaction to ensure atomic updates
        @firestore.transactional
        def update_in_transaction(transaction):
            # Get user document
            user_doc = user_ref.get(transaction=transaction)
            if not user_doc.exists:
                raise ValueError("User not found")
            
            user_data = user_doc.to_dict()
            current_balance = user_data.get('balance', 0.0)
            
            # Check if balance is sufficient
            if current_balance < initial_capital:
                raise ValueError("Insufficient funds in main balance")
            
            # Check if manager already exists
            manager_doc = manager_ref.get(transaction=transaction)
            if manager_doc.exists:
                raise ValueError("Manager already initialized")
            
            # Update user's balance
            transaction.update(user_ref, {
                "balance": firestore.Increment(-initial_capital),
                "updated_at": firestore.SERVER_TIMESTAMP
            })
            
            # Initialize manager
            transaction.set(manager_ref, {
                "user_id": user_id,
                "is_manager": True,
                "capital": initial_capital,
                "fee_earnings": 0.0,
                "updated_at": firestore.SERVER_TIMESTAMP
            })
        
        # Execute the transaction
        transaction = db.transaction()
        update_in_transaction(transaction)
        
        return jsonify({
            "status": "success",
            "message": "Manager initialized successfully",
            "manager": {
                "user_id": user_id,
                "capital": initial_capital,
                "fee_earnings": 0.0
            }
        })
    
    except ValueError as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    except Exception as e:
        logging.error(f"Error initializing manager: {str(e)}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500


@app.route('/pamm/manager-status', methods=['GET'])
@firebase_auth_required
async def manager_status():
    try:
        manager_ref = db.collection("pamm_managers").document(request.user_id)
        manager_doc = manager_ref.get()
        
        return jsonify({
            "status": "success",
            "is_manager": manager_doc.exists,
            "manager": manager_doc.to_dict() if manager_doc.exists else None
        })
    except Exception as e:
        logging.error(f"Error checking manager status: {str(e)}\n{traceback.format_exc()}")
        return jsonify({
            "status": "error",
            "message": "Failed to check manager status"
        }), 500

# @app.route('/pamm/add-capital', methods=['POST'])
# @firebase_auth_required
# async def add_capital():
#     try:
#         data = await request.get_json()
#         amount = float(data.get('amount', 0))
        
#         if amount <= 0:
#             return jsonify({"status": "error", "message": "Amount must be positive"}), 400
        
#         # Update manager capital
#         manager_ref = db.collection("pamm_managers").document(request.user_id)
#         manager_ref.update({
#             "capital": firestore.Increment(amount),
#             "updated_at": firestore.SERVER_TIMESTAMP
#         })
        
#         # Update manager's user balance (deduct)
#         user_ref = db.collection("users").document(request.user_id)
        # user_ref.update({
        #     "balance": firestore.Increment(-amount),
        #     "updated_at": firestore.SERVER_TIMESTAMP
        # })
        
#         return jsonify({
#             "status": "success",
#             "message": f"Added ${amount} to manager capital"
#         })
        
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/pamm/add-capital', methods=['POST'])
@firebase_auth_required
async def add_capital():
    try:
        data = await request.get_json()
        amount = float(data.get('amount', 0))
        
        if not amount or amount <= 0:
            return jsonify({"status": "error", "message": "Amount must be positive and non-zero"}), 400
        
        # Get user's current balance
        user_ref = db.collection("users").document(request.user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        user_balance = user_doc.to_dict().get('balance', 0)
        if user_balance < amount:
            return jsonify({"status": "error", "message": "Insufficient balance"}), 400

        # Update manager capital
        manager_ref = db.collection("pamm_managers").document(request.user_id)
        manager_ref.update({
            "capital": firestore.Increment(amount),
            "updated_at": firestore.SERVER_TIMESTAMP
        })
        
        # Deduct from user's balance
        user_ref.update({
            "balance": firestore.Increment(-amount),
            "updated_at": firestore.SERVER_TIMESTAMP
        })
        
        return jsonify({
            "status": "success",
            "message": f"Added ${amount:.2f} to manager capital"
        }), 200
        
    except ValueError as e:
        return jsonify({"status": "error", "message": "Invalid amount format"}), 400
    except Exception as e:
        print(f"Error in add_capital: {str(e)}")  # Log for debugging
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500



@app.route('/pamm/distributions', methods=['GET'])
@firebase_auth_required
async def get_pamm_distributions():
    try:
        distributions_ref = db.collection("pamm_distributions")
        distributions_query = distributions_ref.order_by("timestamp", direction=firestore.Query.DESCENDING)
        
        distributions = []
        docs = distributions_query.stream()
        for doc in docs:
            dist = doc.to_dict()
            dist["id"] = doc.id
            if "timestamp" in dist:
                dist["timestamp"] = dist["timestamp"].isoformat()
            distributions.append(dist)
        
        return jsonify({
            "status": "success",
            "data": distributions,
            "count": len(distributions)
        })
        
    except Exception as e:
        logging.error(f"Error fetching distributions: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch distributions",
            "error": str(e)
        }), 500

@app.route('/pamm/distribute', methods=['POST'])
@firebase_auth_required
async def distribute_profits():
    try:
        data = await request.get_json()
        profit = float(data.get('profit', 0))
        
        if profit <= 0:
            return jsonify({
                "status": "error",
                "message": "Profit amount must be positive"
            }), 400

        # Get manager reference
        manager_ref = db.collection("pamm_managers").document(request.user_id)
        manager_doc = manager_ref.get()
        if not manager_doc.exists:
            return jsonify({"status": "error", "message": "Manager not found"}), 400

        # Get all investors
        investors_ref = db.collection("pamm_investors")
        investors_snapshot = investors_ref.get()
        
        if not investors_snapshot:
            return jsonify({"status": "error", "message": "No investors found"}), 400

        # Calculate total allocation
        total_allocation = sum(investor_data.to_dict().get("allocation_pct", 0) for investor_data in investors_snapshot)
        performance_fee = 0.20  # Explicitly set 20% fee

        logging.info(f"Distributing profit: {profit}, investor_count: {len(investors_snapshot)}, total_allocation: {total_allocation}")

        # Normalize profit distribution if total_allocation < 1.0
        allocation_factor = 1.0 if total_allocation == 0 else min(1.0, total_allocation)
        adjusted_profit = profit * allocation_factor

        # Prepare distribution data
        distribution_details = []
        total_fees = 0.0
        batch = db.batch()

        for doc in investors_snapshot:
            investor_data = doc.to_dict()
            user_id = investor_data["user_id"]
            allocation_pct = investor_data["allocation_pct"]
            
            # Calculate amounts
            profit_share = adjusted_profit * (allocation_pct / allocation_factor if allocation_factor > 0 else 0)
            new_balance = investor_data["balance"] + profit_share
            fee = max(0, (new_balance - investor_data["high_water_mark"]) * performance_fee)
            net_amount = profit_share - fee
            total_fees += fee

            logging.info(f"Investor {user_id}: allocation_pct={allocation_pct}, profit_share={profit_share}, "
                        f"fee={fee}, new_balance={new_balance}, high_water_mark={investor_data['high_water_mark']}")

            # Update investor
            investor_ref = investors_ref.document(user_id)
            batch.update(investor_ref, {
                "balance": firestore.Increment(net_amount),
                "high_water_mark": firestore.Increment(net_amount),
                "updated_at": firestore.SERVER_TIMESTAMP
            })

            # Update user balance
            user_ref = db.collection("users").document(user_id)
            batch.update(user_ref, {
                "balance": firestore.Increment(net_amount),
                "updated_at": firestore.SERVER_TIMESTAMP
            })

            distribution_details.append({
                "user_id": user_id,
                "allocation_pct": allocation_pct,
                "profit_share": profit_share,
                "fee": fee,
                "net_amount": net_amount
            })

        # Validate total_fees
        expected_fees = sum(detail["fee"] for detail in distribution_details)
        if abs(total_fees - expected_fees) > 0.01:
            logging.error(f"Fee mismatch: calculated={total_fees}, expected={expected_fees}")
            raise ValueError("Fee calculation mismatch")

        # Update manager fees
        batch.update(manager_ref, {
            "fee_earnings": firestore.Increment(total_fees),
            "updated_at": firestore.SERVER_TIMESTAMP
        })

        # Create distribution record
        dist_ref = db.collection("pamm_distributions").document()
        batch.set(dist_ref, {
            "amount": profit,
            "fees": total_fees,
            "investor_count": len(investors_snapshot),
            "timestamp": firestore.SERVER_TIMESTAMP,
            "details": distribution_details,
            "manager_id": request.user_id
        })

        # Commit all changes
        batch.commit()

        logging.info(f"Distribution complete: amount={profit}, total_fees={total_fees}, "
                    f"investor_count={len(investors_snapshot)}, distribution_id={dist_ref.id}")

        return jsonify({
            "status": "success",
            "message": f"Distributed ${profit:.2f} to {len(investors_snapshot)} investors",
            "distribution_id": dist_ref.id,
            "total_fees": total_fees,
            "investor_count": len(investors_snapshot)
        })

    except Exception as e:
        logging.error(f"Distribution failed: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/pamm/status', methods=['GET'])
@firebase_auth_required
async def pamm_status():
    try:
        user_id = request.user_id
        
        # Get manager data if exists
        manager_data = None
        manager_ref = db.collection("pamm_managers").document(user_id)
        manager_doc = manager_ref.get()
        
        if manager_doc.exists:
            manager_data = manager_doc.to_dict()
        
        # Get investor data if exists
        investor_data = None
        investor_ref = db.collection("pamm_investors").document(user_id)
        investor_doc = investor_ref.get()
        
        if investor_doc.exists:
            investor_data = investor_doc.to_dict()
        
        # Get all investors if user is manager
        investors = []
        if manager_doc.exists:
            investors_snapshot = db.collection("pamm_investors").get()
            investors = [doc.to_dict() for doc in investors_snapshot]
        
        # Calculate total funds
        total_funds = 0.0
        if manager_data:
            total_funds += manager_data.get("capital", 0.0)
        
        for inv in investors:
            total_funds += inv.get("balance", 0.0)
        
        return jsonify({
            "status": "success",
            "manager": manager_data,
            "investor": investor_data,
            "investors": investors,
            "total_funds": total_funds
        })
    
    except Exception as e:
        logging.error(f"Error getting PAMM status: {str(e)}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/pamm/performance', methods=['GET'])
@firebase_auth_required
async def get_pamm_performance():
    try:
        user_id = request.user_id
        
        # Initialize metrics
        metrics = {
            'total_fees': 0.0,
            'initial_balance': 0.0,
            'current_balance': 0.0,
            'investor_count': 0
        }
        
        # Check if user is a manager
        manager_doc = db.collection("pamm_managers").document(user_id).get()
        if manager_doc.exists:
            manager_data = manager_doc.to_dict()
            metrics['total_fees'] = manager_data.get("fee_earnings", 0.0)
            
            # Get all investors
            investors_snapshot = db.collection("pamm_investors").get()
            metrics['investor_count'] = len(investors_snapshot)
            
            for doc in investors_snapshot:
                investor_data = doc.to_dict()
                metrics['initial_balance'] += investor_data.get("initial_balance", 0.0)
                metrics['current_balance'] += investor_data.get("balance", 0.0)
        
        # Check if user is an investor
        investor_doc = db.collection("pamm_investors").document(user_id).get()
        if investor_doc.exists:
            investor_data = investor_doc.to_dict()
            metrics['initial_balance'] = investor_data.get("initial_balance", 0.0)
            metrics['current_balance'] = investor_data.get("balance", 0.0)
            metrics['investor_count'] = 1  # Just this investor
        
        # Calculate performance
        ytd_return = 0.0
        if metrics['initial_balance'] > 0:
            ytd_return = ((metrics['current_balance'] - metrics['initial_balance']) / 
                         metrics['initial_balance']) * 100
        
        return jsonify({
            "status": "success",
            "ytdReturn": round(ytd_return, 2),
            "totalFees": round(metrics['total_fees'], 2),
            "initialBalance": round(metrics['initial_balance'], 2),
            "currentBalance": round(metrics['current_balance'], 2),
            "investorCount": metrics['investor_count'],
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
    
    except Exception as e:
        logging.error(f"Error getting performance data: {str(e)}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/pamm/fix-distributions', methods=['POST'])
@firebase_auth_required
async def fix_distributions():
    try:
        user_id = request.user_id
        logging.info(f"User ID from request: {user_id}")
        
        # Get user document (not manager document)
        user_doc = db.collection('users').document(user_id).get()
        
        # Enhanced authorization check that handles both string and boolean is_admin
        if not user_doc.exists:
            logging.error(f"User document not found for user_id: {user_id}")
            return jsonify({'status': 'error', 'message': 'User not found'}), 404
            
        user_data = user_doc.to_dict()
        is_admin = str(user_data.get('is_admin', '')).lower() == 'true' if isinstance(user_data.get('is_admin'), str) else bool(user_data.get('is_admin'))
        
        if not is_admin:
            logging.error(f"User {user_id} is not admin. is_admin value: {user_data.get('is_admin')}")
            return jsonify({
                'status': 'error',
                'message': 'Admin privileges required',
                'hint': 'Your is_admin field might be stored as a string instead of boolean'
            }), 403
        
        # Distribution fixing logic
        distributions_ref = db.collection('pamm_distributions')
        batch = db.batch()
        fixed_count = 0
        start_time = time.time()
        
        for doc in distributions_ref.stream():
            data = doc.to_dict()
            amount = data.get('amount', 0)
            fees = data.get('fees', 0)
            
            # Check if fee is approximately 10% (with tolerance for floating point)
            if amount > 0 and abs(fees/amount - 0.10) < 0.001:
                correct_fee = round(amount * 0.20, 6)
                batch.update(doc.reference, {
                    'fees': correct_fee,
                    'updated_at': firestore.SERVER_TIMESTAMP,
                    'fixed_by': user_id,
                    'fix_timestamp': firestore.SERVER_TIMESTAMP
                })
                fixed_count += 1
                
                # Commit every 400 operations (Firestore batch limit is 500)
                if fixed_count % 400 == 0:
                    batch.commit()
                    batch = db.batch()
                    logging.info(f"Committed batch of 400 updates (Total fixed: {fixed_count})")
        
        # Commit any remaining operations
        if fixed_count % 400 != 0:
            batch.commit()
            logging.info(f"Committed final batch of {fixed_count % 400} updates")
        
        # Calculate processing time
        processing_time = round(time.time() - start_time, 2)
        
        logging.info(f"Successfully fixed {fixed_count} distributions in {processing_time} seconds")
        return jsonify({
            'status': 'success',
            'message': 'Distributions fixed successfully',
            'count': fixed_count,
            'processing_time_seconds': processing_time,
            'fixed_by': user_id
        })
        
    except Exception as e:
        logging.error(f"Fix distributions failed: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'Failed to fix distributions',
            'error': str(e),
            'solution': 'Check if is_admin field is properly set in your user document'
        }), 500
    










def generate_signature(secret: str, param_str: str) -> str:
    return hmac.new(
        secret.encode('utf-8'),
        param_str.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

async def get_bybit_server_time() -> str:
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(f"{BYBIT_MAINNET_URL}/v5/market/time")
            response.raise_for_status()
            data = response.json()
            if data.get('retCode') != 0:
                logger.error(f"Bybit server time error: {data.get('retMsg', 'Unknown error')}")
                raise ValueError(f"Bybit server time error: {data.get('retMsg', 'Unknown error')}")
            return str(int(data['result']['timeSecond']) * 1000)
    except httpx.HTTPError as e:
        logger.error(f"Error fetching Bybit server time: {str(e)}")
        raise ValueError(f"Failed to fetch server time: {str(e)}")

async def get_current_price(symbol: str) -> Dict[str, Optional[float]]:
    cached_price = price_cache.get(symbol)
    if cached_price:
        logger.debug(f"Returning cached price for {symbol}: {cached_price}")
        return cached_price
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            timestamp = await get_bybit_server_time()
            recv_window = "5000"
            query_string = f"category=linear&symbol={symbol}"
            param_str = f"{timestamp}{BYBIT_API_KEY}{recv_window}{query_string}"
            signature = generate_signature(BYBIT_SECRET, param_str)
            headers = {
                "X-BAPI-API-KEY": BYBIT_API_KEY,
                "X-BAPI-SIGN": signature,
                "X-BAPI-TIMESTAMP": timestamp,
                "X-BAPI-RECV-WINDOW": recv_window
            }
            response = await client.get(f"{BYBIT_MAINNET_URL}/v5/market/tickers?{query_string}", headers=headers)
            response.raise_for_status()
            data = response.json()
            if data.get("retCode") != 0:
                raise ValueError(f"Bybit error: {data.get('retMsg', 'Unknown error')}")
            ticker = next((t for t in data["result"]["list"] if t["symbol"] == symbol), None)
            if not ticker:
                raise ValueError(f"Symbol {symbol} not found in Bybit response")
            price_data = {
                "bid": float(ticker["bid1Price"]) if ticker.get("bid1Price") else None,
                "ask": float(ticker["ask1Price"]) if ticker.get("ask1Price") else None,
                "last": float(ticker["lastPrice"]) if ticker.get("lastPrice") else None
            }
            if not any(price_data.values()):
                raise ValueError(f"No valid price data for {symbol}: {ticker}")
            price_cache[symbol] = price_data
            logger.debug(f"Fetched price for {symbol}: {price_data}")
            return price_data
    except httpx.HTTPError as e:
        logger.error(f"Error fetching price for {symbol}: {str(e)}")
        raise ValueError(f"Failed to fetch {symbol} price")

async def get_top_50_symbols(limit: int = 50) -> List[str]:
    async with semaphore:
        cached_symbols = symbols_cache.get('symbols')
        if cached_symbols:
            logger.debug("Returning cached symbols")
            return cached_symbols[:min(limit, len(cached_symbols))]
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                timestamp = await get_bybit_server_time()
                recv_window = "15000"
                query_string = f"category=linear&limit={limit}"
                param_str = f"{timestamp}{BYBIT_API_KEY}{recv_window}{query_string}"
                signature = generate_signature(BYBIT_SECRET, param_str)
                headers = {
                    "X-BAPI-API-KEY": BYBIT_API_KEY,
                    "X-BAPI-SIGN": signature,
                    "X-BAPI-TIMESTAMP": timestamp,
                    "X-BAPI-RECV-WINDOW": recv_window
                }
                for attempt in range(5):
                    try:
                        response = await client.get(f"{BYBIT_MAINNET_URL}/v5/market/tickers?{query_string}", headers=headers)
                        response.raise_for_status()
                        data = response.json()
                        if data.get("retCode") != 0:
                            logger.error(f"Bybit symbols fetch error: {data.get('retMsg', 'Unknown error')}")
                            raise ValueError(f"Bybit error: {data.get('retMsg', 'Unknown error')}")
                        symbols_data = sorted(
                            [ticker for ticker in data["result"]["list"] if ticker["symbol"].endswith("USDT")],
                            key=lambda x: float(x.get("turnover24h", 0)),
                            reverse=True
                        )[:limit]
                        symbols = [ticker["symbol"] for ticker in symbols_data]
                        symbols_cache['symbols'] = symbols
                        try:
                            db.collection('market').document('top_symbols').set({
                                'symbols': symbols,
                                'lastUpdated': firestore.SERVER_TIMESTAMP
                            })
                            logger.debug("Cached top symbols in Firestore")
                        except Exception as e:
                            logger.warning(f"Failed to cache symbols in Firestore: {str(e)}")
                        logger.info(f"Fetched {len(symbols)} top symbols: {symbols[:5]}...")
                        return symbols
                    except httpx.HTTPStatusError as e:
                        if e.response.status_code == 429:
                            wait = (2 ** attempt) * 1.0
                            logger.warning(f"Bybit rate limit hit for symbols, retrying after {wait}s")
                            await asyncio.sleep(wait)
                        else:
                            raise
                    except httpx.HTTPError as e:
                        if attempt == 4:
                            logger.error(f"Failed to fetch symbols after retries: {str(e)}")
                            raise
                        wait = (2 ** attempt) * 1.0
                        logger.warning(f"Bybit request failed for symbols, retrying after {wait}s")
                        await asyncio.sleep(wait)
        except Exception as e:
            logger.error(f"Error fetching symbols from Bybit: {str(e)}")
            try:
                doc = await asyncio.get_event_loop().run_in_executor(
                    None, lambda: db.collection('market').document('top_symbols').get()
                )
                if doc.exists and doc.to_dict().get('symbols'):
                    symbols = doc.to_dict()['symbols']
                    symbols_cache['symbols'] = symbols
                    logger.info("Returning symbols from Firestore cache")
                    return symbols[:min(limit, len(symbols))]
                return []
            except Exception as e2:
                logger.error(f"Firestore fallback failed: {str(e2)}")
                return []

async def place_bybit_order(symbol: str, side: str, quantity: float, leverage: int) -> tuple[Dict[str, Any], float]:
    async with semaphore:
        try:
            timestamp = await get_bybit_server_time()
            recv_window = "15000"
            query_string = "accountType=UNIFIED&coin=USDT"
            param_str = f"{timestamp}{BYBIT_API_KEY}{recv_window}{query_string}"
            headers = {
                "X-BAPI-API-KEY": BYBIT_API_KEY,
                "X-BAPI-SIGN": generate_signature(BYBIT_SECRET, param_str),
                "X-BAPI-TIMESTAMP": timestamp,
                "X-BAPI-RECV-WINDOW": recv_window
            }
            async with httpx.AsyncClient(timeout=15) as client:
                # Check futures account balance
                response = await client.get(f"{BYBIT_MAINNET_URL}/v5/account/wallet-balance?{query_string}", headers=headers)
                response.raise_for_status()
                balance_data = response.json()
                if balance_data.get('retCode') != 0:
                    logger.error(f"Balance check failed: {balance_data.get('retMsg', 'Unknown error')}")
                    raise ValueError(f"Balance check error: {balance_data.get('retMsg', 'Unknown error')}")
                usdt_balance = float(balance_data['result']['list'][0]['coin'][0].get('walletBalance', '0') or '0')
                if usdt_balance < quantity * 100:
                    logger.error(f"Insufficient USDT balance: available={usdt_balance}, required={quantity * 100}")
                    raise ValueError(f"Insufficient USDT balance in Bybit futures account")
                # Set leverage for futures
                leverage_response = await client.post(
                    f"{BYBIT_MAINNET_URL}/v5/position/set-leverage",
                    headers=headers,
                    json={
                        "category": "linear",
                        "symbol": symbol,
                        "buyLeverage": str(leverage),
                        "sellLeverage": str(leverage)
                    }
                )
                leverage_response.raise_for_status()
                leverage_data = leverage_response.json()
                logger.info(f"Leverage set: status={leverage_response.status_code}, data={leverage_data}")
                # Place futures order
                order_params = {
                    "category": "linear",
                    "symbol": symbol,
                    "side": side.capitalize(),
                    "orderType": "Market",
                    "qty": str(quantity),
                    "timeInForce": "GTC",
                    "positionIdx": 0
                }
                param_str = f"{timestamp}{BYBIT_API_KEY}{recv_window}{json.dumps(order_params)}"
                headers["X-BAPI-SIGN"] = generate_signature(BYBIT_SECRET, param_str)
                order_response = await client.post(
                    f"{BYBIT_MAINNET_URL}/v5/order/create",
                    headers=headers,
                    json=order_params
                )
                order_response.raise_for_status()
                order_data = order_response.json()
                if order_data.get('retCode') != 0:
                    logger.error(f"Bybit order failed: {order_data.get('retMsg', 'Unknown error')}")
                    raise ValueError(f"Bybit order error: {order_data.get('retMsg', 'Unknown error')}")
                return order_data['result'], usdt_balance
        except httpx.HTTPError as e:
            logger.error(f"Network error in Bybit order for {symbol}: {str(e)}")
            raise ValueError(f"Network error: {str(e)}")
        except Exception as e:
            logger.error(f"Bybit order failed for {symbol}: {str(e)}", exc_info=True)
            raise ValueError(f"Invalid order response: {str(e)}")

@app.route('/market/symbols', methods=['GET'])
@log_api_call
async def market_symbols():
    try:
        limit = int(request.args.get('limit', 50))
        if limit < 1 or limit > 100:
            return jsonify({"status": "error", "message": "Limit must be between 1 and 100"}), 400
        symbols = await get_top_50_symbols(limit=limit)
        return jsonify({"status": "success", "data": symbols})
    except Exception as e:
        logger.error(f"Error in /market/symbols: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/market/price', methods=['GET'])
@log_api_call
async def get_market_price():
    try:
        symbol = request.args.get('symbol')
        if not symbol:
            logger.error("Missing symbol parameter in /market/price request")
            return jsonify({"status": "error", "message": "Symbol required"}), 400
        logger.debug(f"Fetching price for symbol {symbol}")
        price_data = await get_current_price(symbol)
        logger.info(f"Returning price for {symbol}: {price_data}")
        return jsonify({
            "status": "success",
            "bid": round(price_data["bid"], 8),
            "ask": round(price_data["ask"], 8),
            "last": round(price_data["last"], 8)
        })
    except ValueError as e:
        logger.error(f"ValueError fetching price for {symbol}: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 503
    except Exception as e:
        logger.error(f"Error fetching price for {symbol}: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/trade-pamm', methods=['OPTIONS', 'POST'])
@log_api_call
async def trade_pamm():
    if request.method == 'OPTIONS':
        response = jsonify({"status": "success"})
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response
    try:
        data = await request.get_json()
        user_id = data.get('userId')
        symbol = data.get('symbol')
        action = data.get('action')
        amount = float(data.get('amount'))
        is_managed = data.get('isManaged', True)
        leverage = int(data.get('leverage', 1))
        if not all([user_id, symbol, action, amount]):
            logger.error(f"Missing required parameters: {data}")
            return jsonify({"status": "error", "message": "Missing required parameters"}), 400
        if action.lower() not in ["buy", "sell"]:
            logger.error(f"Invalid action: {action}")
            return jsonify({"status": "error", "message": "Invalid action"}), 400
        if amount <= 0 or leverage < 1 or leverage > 100:
            logger.error(f"Invalid amount or leverage: amount={amount}, leverage={leverage}")
            return jsonify({"status": "error", "message": "Invalid amount or leverage"}), 400
        user_ref = db.collection('users').document(user_id)
        user_doc = await asyncio.get_event_loop().run_in_executor(None, user_ref.get)
        if not user_doc.exists:
            logger.error(f"User not found: {user_id}")
            return jsonify({"status": "error", "message": "User not found"}), 404
        symbols = await get_top_50_symbols()
        if symbol not in symbols:
            logger.error(f"Invalid symbol: {symbol}")
            return jsonify({"status": "error", "message": f"Invalid symbol: {symbol}"}), 400
        price_data = await get_current_price(symbol)
        quantity = amount / price_data["last"]
        timestamp = await get_bybit_server_time()
        recv_window = "5000"
        query_string = "accountType=UNIFIED&coin=USDT"
        param_str = f"{timestamp}{BYBIT_API_KEY}{recv_window}{query_string}"
        headers = {
            "X-BAPI-API-KEY": BYBIT_API_KEY,
            "X-BAPI-SIGN": generate_signature(BYBIT_SECRET, param_str),
            "X-BAPI-TIMESTAMP": timestamp,
            "X-BAPI-RECV-WINDOW": recv_window
        }
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(f"{BYBIT_MAINNET_URL}/v5/account/wallet-balance?{query_string}", headers=headers)
            response.raise_for_status()
            balance_data = response.json()
            if balance_data.get('retCode') != 0:
                logger.error(f"Bybit balance check error: {balance_data.get('retMsg', 'Unknown error')}")
                return jsonify({"status": "error", "message": "Failed to check balance"}), 503
            current_balance = float(balance_data['result']['list'][0]['coin'][0].get('walletBalance', '0') or '0')
            margin_required = amount / leverage
            if action.lower() == "buy" and margin_required > current_balance:
                logger.error(f"Insufficient balance for user {user_id}: required={margin_required}, available={current_balance}")
                return jsonify({
                    "status": "error",
                    "message": "Insufficient balance for trade",
                    "required": round(margin_required, 2),
                    "available": round(current_balance, 2)
                }), 400
            order_result, new_balance = await place_bybit_order(symbol, action, quantity, leverage)
            bybit_order_id = order_result['orderId']
            trade_data = {
                "tradeId": bybit_order_id,
                "bybitOrderId": bybit_order_id,
                "symbol": symbol,
                "action": action.lower(),
                "executedAmount": amount,
                "executionPrice": price_data["last"],
                "newBalance": new_balance,
                "newHoldings": quantity,
                "profit": 0.0,
                "isManaged": is_managed,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "leverage": leverage
            }
            @firestore.transactional
            def update_firebase(transaction):
                transaction.update(user_ref, {
                    "balance": new_balance,
                    "lastUpdated": firestore.SERVER_TIMESTAMP
                })
                trade_ref = user_ref.collection('trades_manager_bybit').document(bybit_order_id)
                transaction.set(trade_ref, trade_data)
            try:
                transaction = db.transaction()
                await asyncio.get_event_loop().run_in_executor(None, lambda: update_firebase(transaction))
                logger.info(f"Trade recorded in Firestore for user {user_id}: {bybit_order_id}")
            except Exception as e:
                logger.error(f"Firestore transaction failed for trade {bybit_order_id}: {str(e)}")
                return jsonify({"status": "error", "message": "Failed to store trade in database"}), 500
            return jsonify({"status": "success", "data": trade_data})
    except httpx.HTTPError as e:
        logger.error(f"Network error in trade_pamm for {symbol}: {str(e)}")
        return jsonify({"status": "error", "message": f"Network error: {str(e)}"}), 503
    except Exception as e:
        logger.error(f"Trade failed for user {user_id}: {str(e)}")
        return jsonify({"status": "error", "message": f"Trade failed: {str(e)}"}), 500

@app.route('/users/<user_id>/trades', methods=['GET'])
@log_api_call
async def get_user_trades(user_id):
    try:
        logger.debug(f"Starting trade fetch for user {user_id}")
        if not user_id or user_id == 'undefined':
            logger.error(f"Invalid user ID: {user_id}")
            return jsonify({"status": "error", "message": "Invalid user ID"}), 400
        user_ref = db.collection('users').document(user_id)
        user_doc = await asyncio.get_event_loop().run_in_executor(None, user_ref.get)
        if not user_doc.exists:
            logger.error(f"User not found: {user_id}")
            return jsonify({"status": "error", "message": "User not found"}), 404
        page = max(1, int(request.args.get('page', 1)))
        page_size = min(int(request.args.get('page_size', 10)), 20)
        cache_key = f"{user_id}_trades_{page}"
        if cache_key in trades_cache:
            trades = trades_cache[cache_key]
            logger.debug(f"Returning cached trades for user {user_id}")
            return jsonify({"status": "success", "data": trades})
        trades_ref = user_ref.collection('trades_manager_bybit')
        query = trades_ref.order_by('timestamp', direction=firestore.Query.DESCENDING)
        seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
        query = query.where(filter=firestore.FieldFilter('timestamp', '>=', seven_days_ago.isoformat()))
        if page > 1:
            offset_query = trades_ref.limit((page - 1) * page_size).order_by('timestamp', direction=firestore.Query.DESCENDING)
            offset_docs = await asyncio.get_event_loop().run_in_executor(None, lambda: list(offset_query.get()))
            if offset_docs:
                last_doc = offset_docs[-1]
                query = query.start_after(last_doc)
        query = query.limit(page_size)
        try:
            trades = await asyncio.get_event_loop().run_in_executor(
                None, lambda: [doc.to_dict() for doc in query.get()]
            )
            logger.info(f"Found {len(trades)} trades for user {user_id}")
            trades_cache[cache_key] = trades
            return jsonify({"status": "success", "data": trades})
        except Exception as e:
            logger.error(f"Firestore query failed for user {user_id}: {str(e)}")
            return jsonify({"status": "error", "message": "Failed to fetch trades from Firestore"}), 500
    except Exception as e:
        logger.error(f"Error fetching trades for user {user_id}: {str(e)}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/users/<user_id>/balance', methods=['GET'])
@log_api_call
async def get_user_balance(user_id):
    try:
        logger.debug(f"Fetching balance for user {user_id}")
        if not user_id or user_id == 'undefined':
            logger.error(f"Invalid user ID: {user_id}")
            return jsonify({"status": "error", "message": "Invalid user ID"}), 400
        user_ref = db.collection('users').document(user_id)
        user_doc = await asyncio.get_event_loop().run_in_executor(None, user_ref.get)
        if not user_doc.exists:
            logger.error(f"User not found: {user_id}")
            return jsonify({"status": "error", "message": "User not found"}), 404
        timestamp = await get_bybit_server_time()
        recv_window = "5000"
        query_string = "accountType=UNIFIED&coin=USDT"
        param_str = f"{timestamp}{BYBIT_API_KEY}{recv_window}{query_string}"
        signature = generate_signature(BYBIT_SECRET, param_str)
        headers = {
            "X-BAPI-API-KEY": BYBIT_API_KEY,
            "X-BAPI-SIGN": signature,
            "X-BAPI-TIMESTAMP": timestamp,
            "X-BAPI-RECV-WINDOW": recv_window
        }
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(f"{BYBIT_MAINNET_URL}/v5/account/wallet-balance?{query_string}", headers=headers)
            response.raise_for_status()
            balance_data = response.json()
            if balance_data.get('retCode') != 0:
                logger.error(f"Bybit balance fetch error: {balance_data.get('retMsg', 'Unknown error')}")
                return jsonify({"status": "error", "message": "Failed to fetch balance from Bybit"}), 503
            usdt_balance = float(balance_data['result']['list'][0]['coin'][0].get('walletBalance', '0') or '0')
            logger.info(f"Fetched Bybit balance for user {user_id}: {usdt_balance}")
            try:
                await asyncio.get_event_loop().run_in_executor(None, lambda: user_ref.update({
                    "balance": usdt_balance,
                    "lastUpdated": firestore.SERVER_TIMESTAMP
                }))
                logger.debug(f"Updated Firestore balance for user {user_id}: {usdt_balance}")
            except Exception as e:
                logger.warning(f"Failed to update Firestore balance for user {user_id}: {str(e)}")
            return jsonify({"status": "success", "balance": round(usdt_balance, 2)})
    except httpx.HTTPError as e:
        logger.error(f"Network error fetching balance for user {user_id}: {str(e)}")
        try:
            user_data = user_doc.to_dict()
            balance = float(user_data.get('balance', 0.0))
            logger.info(f"Falling back to Firestore balance for user {user_id}: {balance}")
            return jsonify({"status": "success", "balance": round(balance, 2)})
        except Exception as e2:
            logger.error(f"Firestore fallback failed for user {user_id}: {str(e2)}")
            return jsonify({"status": "error", "message": "Failed to fetch balance"}), 503
    except Exception as e:
        logger.error(f"Error fetching balance for user {user_id}: {str(e)}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/users/<user_id>/pnl', methods=['GET'])
@log_api_call
async def get_user_pnl(user_id):
    try:
        logger.debug(f"Starting P&L fetch for user {user_id}")
        if not user_id or user_id == 'undefined':
            logger.error(f"Invalid user ID: {user_id}")
            return jsonify({"status": "error", "message": "Invalid user ID"}), 400
        user_ref = db.collection('users').document(user_id)
        user_doc = await asyncio.get_event_loop().run_in_executor(None, user_ref.get)
        if not user_doc.exists:
            logger.error(f"User not found: {user_id}")
            return jsonify({"status": "error", "message": "User not found"}), 404
        cache_key = f"{user_id}_pnl"
        if cache_key in pnl_cache:
            logger.debug(f"Returning cached P&L for user {user_id}")
            return jsonify({"status": "success", "pnl": round(pnl_cache[cache_key], 2)})
        realized_pnl = 0.0
        unrealized_pnl = 0.0
        trades_ref = user_ref.collection('trades_manager_bybit')
        seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
        query = trades_ref.where(filter=firestore.FieldFilter('isManaged', '==', True))
        query = query.where(filter=firestore.FieldFilter('timestamp', '>=', seven_days_ago.isoformat()))
        query = query.order_by('timestamp', direction=firestore.Query.DESCENDING).limit(50)
        try:
            trades = await asyncio.get_event_loop().run_in_executor(
                None, lambda: [doc.to_dict() for doc in query.get()]
            )
            logger.info(f"Found {len(trades)} trades for P&L calculation for user {user_id}")
            holdings = {}
            for trade in trades:
                symbol = trade.get('symbol')
                if not symbol:
                    continue
                qty = float(trade.get('newHoldings', 0))
                price = float(trade.get('executionPrice', 0))
                action = trade.get('action')
                if symbol not in holdings:
                    holdings[symbol] = {'qty': 0.0, 'total_cost': 0.0, 'trades': 0}
                if action == 'buy':
                    holdings[symbol]['qty'] += qty
                    holdings[symbol]['total_cost'] += qty * price
                    holdings[symbol]['trades'] += 1
                elif action == 'sell':
                    holdings[symbol]['qty'] -= qty
                    holdings[symbol]['total_cost'] -= qty * price
                    holdings[symbol]['trades'] += 1
            async with httpx.AsyncClient(timeout=15) as client:
                timestamp = await get_bybit_server_time()
                recv_window = "15000"
                for symbol in holdings:
                    if holdings[symbol]['qty'] <= 0:
                        continue
                    try:
                        query_string = f"category=linear&symbol={symbol}"
                        param_str = f"{timestamp}{BYBIT_API_KEY}{recv_window}{query_string}"
                        headers = {
                            "X-BAPI-API-KEY": BYBIT_API_KEY,
                            "X-BAPI-SIGN": generate_signature(BYBIT_SECRET, param_str),
                            "X-BAPI-TIMESTAMP": timestamp,
                            "X-BAPI-RECV-WINDOW": recv_window
                        }
                        response = await client.get(f"{BYBIT_MAINNET_URL}/v5/market/tickers?{query_string}", headers=headers)
                        response.raise_for_status()
                        ticker_data = response.json()
                        if ticker_data.get('retCode') == 0:
                            current_price = float(ticker_data['result']['list'][0]['lastPrice'])
                            avg_price = holdings[symbol]['total_cost'] / holdings[symbol]['qty'] if holdings[symbol]['qty'] > 0 else 0
                            unrealized_pnl += holdings[symbol]['qty'] * (current_price - avg_price)
                            logger.debug(f"Unrealized P&L for {symbol}: qty={holdings[symbol]['qty']}, avg_price={avg_price}, current_price={current_price}")
                        else:
                            logger.warning(f"Bybit ticker fetch error for {symbol}: {ticker_data.get('retMsg', 'Unknown error')}")
                    except httpx.HTTPError as e:
                        logger.warning(f"Failed to fetch ticker for {symbol}: {str(e)}")
            total_pnl = realized_pnl + unrealized_pnl
            try:
                today = datetime.now(timezone.utc).date().isoformat()
                portfolio_ref = user_ref.collection('portfolioHistory').document(today)
                await asyncio.get_event_loop().run_in_executor(None, lambda: portfolio_ref.set({
                    "date": today,
                    "pnl": total_pnl,
                    "lastUpdated": firestore.SERVER_TIMESTAMP
                }, merge=True))
                logger.debug(f"Updated Firestore P&L for user {user_id} on {today}: {total_pnl}")
            except Exception as e:
                logger.warning(f"Failed to update Firestore P&L for user {user_id}: {str(e)}")
            pnl_cache[cache_key] = total_pnl
            logger.info(f"Returning P&L {total_pnl} for user {user_id}")
            return jsonify({"status": "success", "pnl": round(total_pnl, 2)})
        except Exception as e:
            logger.error(f"Firestore query failed for user {user_id}: {str(e)}")
            return jsonify({"status": "error", "message": "Failed to fetch trades from Firestore"}), 500
    except Exception as e:
        logger.error(f"Error fetching P&L for user {user_id}: {str(e)}")
        return jsonify({"status": "error", "message": "Internal server error"}), 500






# Updated save_trade endpoint
@app.route('/api/save_trade', methods=['POST'])
async def save_trade():
    try:
        data = await request.get_json()
        user_id = data.get('userId')
        trade = data.get('trade')
        
        if not user_id or not trade:
            return jsonify({"error": "Missing userId or trade data"}), 400
            
        # Use trade ID as document ID
        trade_id = trade.get('id')
        if not trade_id:
            return jsonify({"error": "Trade ID missing"}), 400
            
        # Save/update trade in Firestore
        trade_ref = db.collection('users').document(user_id)\
                        .collection('trades_recent').document(trade_id)
        trade_ref.set(trade)
        
        return jsonify({"message": "Trade saved successfully"}), 200
    except Exception as e:
        logger.error(f"Error saving trade: {str(e)}")
        return jsonify({"error": str(e)}), 500

# New delete_trade endpoint
@app.route('/api/delete_trade', methods=['DELETE'])
async def delete_trade():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        # trade_id = data.get('tradeId')
        trade_id = str(data.get('tradeId'))  # Ensure trade_id is a string
        
        if not user_id or not trade_id:
            return jsonify({"error": "Missing userId or tradeId"}), 400
            
        # Delete trade from Firestore
        trade_ref = db.collection('users').document(user_id)\
                        .collection('trades_recent').document(trade_id)
        trade_ref.delete()
        
        return jsonify({"message": "Trade deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error deleting trade: {str(e)}")
        return jsonify({"error": str(e)}), 500
    


# Endpoint to save trade streak
@app.route('/api/save_streak', methods=['POST'])
async def save_streak():
    try:
        data = await request.get_json()
        user_id = data.get('userId')
        streak = data.get('streak')
        
        if not user_id or streak is None:
            return jsonify({"error": "Missing userId or streak data"}), 400
            
        # Save streak to Firestore (synchronous)
        profile_ref = db.collection('users').document(user_id)
        profile_ref.set({"tradeStreak": streak}, merge=True)
        
        return jsonify({"message": "Streak saved successfully"}), 200
    except Exception as e:
        logger.error(f"Error saving streak: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Endpoint to get trade history
@app.route('/api/get_trades/<user_id>', methods=['GET'])
async def get_trades(user_id):
    try:
        trades_ref = db.collection('users').document(user_id).collection('trades_recent')
        trades = [doc.to_dict() for doc in trades_ref.stream()]  # Always returns an array
        return jsonify({"trades_recent": trades}), 200
    except Exception as e:
        logger.error(f"Error fetching trades_recent: {str(e)}")
        return jsonify({"trades_recent": [], "error": str(e)}), 200  # Return empty array on error

# Endpoint to get trade streak
@app.route('/api/get_streak/<user_id>', methods=['GET'])
async def get_streak(user_id):
    try:
        profile_ref = db.collection('users').document(user_id)
        doc = profile_ref.get()
        streak = doc.to_dict().get('tradeStreak', 0) if doc.exists else 0
        return jsonify({"streak": streak}), 200
    except Exception as e:
        logger.error(f"Error fetching streak: {str(e)}")
        return jsonify({"streak": 0, "error": str(e)}), 200  # Return 0 on error

# Endpoint to clear trades and reset streak
@app.route('/api/clear_trades/<user_id>', methods=['POST'])
async def clear_trades(user_id):
    try:
        trades_ref = db.collection('users').document(user_id).collection('trades_recent')
        trades = trades_ref.get()
        batch = db.batch()
        for doc in trades:
            batch.delete(doc.reference)
        batch.commit()
        
        profile_ref = db.collection('users').document(user_id)
        profile_ref.set({"tradeStreak": 0}, merge=True)
        
        return jsonify({"message": "Trades and streak cleared successfully"}), 200
    except Exception as e:
        logger.error(f"Error clearing trades and streak: {str(e)}")
        return jsonify({"error": str(e)}), 500








# # # Get current sell attempts
# @app.route('/api/get_sell_attempts/<user_id>', methods=['GET'])
# async def get_sell_attempts(user_id: str):
#     try:
#         # Run synchronous Firestore operation in a separate thread
#         loop = asyncio.get_event_loop()
#         user_doc = await loop.run_in_executor(None, lambda: db.collection('users').document(user_id).get())
        
#         if not user_doc.exists:
#             logger.warning(f"User not found: {user_id}")
#             return jsonify({"error": "User not found"}), 404
        
#         user_data = user_doc.to_dict()
#         response = {
#             "attempts": user_data.get("sellAttempts", 0),
#             "lastSellDate": user_data.get("lastSellDate", None)
#         }
#         logger.debug(f"Retrieved sell attempts for user {user_id}: {response}")
#         return jsonify(response), 200
#     except Exception as e:
#         logger.error(f"Error retrieving sell attempts for user {user_id}: {str(e)}")
#         return jsonify({"error": str(e)}), 500

# # Save sell attempts
# @app.route('/api/save_sell_attempts', methods=['POST'])
# async def save_sell_attempts():
#     try:
#         data = await request.get_json()
#         user_id = data.get('userId')
#         attempts = data.get('attempts')
#         last_sell_date = data.get('lastSellDate')

#         if not user_id or attempts is None:
#             logger.warning("Missing userId or attempts in request body")
#             return jsonify({"error": "userId and attempts are required"}), 400

#         # Prepare update data
#         update_data = {
#             "sellAttempts": attempts,
#             "lastSellDate": last_sell_date if last_sell_date else None
#         }

#         # Run synchronous Firestore operation in a separate thread
#         loop = asyncio.get_event_loop()
#         await loop.run_in_executor(None, lambda: db.collection('users').document(user_id).set(update_data, merge=True))

#         logger.info(f"Saved sell attempts for user {user_id}: {update_data}")
#         return jsonify({"success": True}), 200
#     except Exception as e:
#         logger.error(f"Error saving sell attempts: {str(e)}")
#         return jsonify({"error": str(e)}), 500




# Get current sell attempts and last sell time
@app.route('/api/get_sell_attempts/<user_id>', methods=['GET'])
async def get_sell_attempts(user_id: str):
    try:
        loop = asyncio.get_event_loop()
        user_doc = await loop.run_in_executor(None, lambda: db.collection('users').document(user_id).get())
        
        if not user_doc.exists:
            logger.warning(f"User not found: {user_id}")
            return jsonify({"error": "User not found"}), 404
        
        user_data = user_doc.to_dict()
        attempts = user_data.get("sellAttempts", 0)
        last_sell_date = user_data.get("lastSellDate", None)
        
        # Check if it's a new day to reset attempts
        today = date.today().isoformat()
        if last_sell_date:
            last_sell_day = datetime.fromisoformat(last_sell_date).date().isoformat()
            if last_sell_day != today:
                attempts = 0
                last_sell_date = None
                # Update Firestore
                await loop.run_in_executor(None, lambda: db.collection('users').document(user_id).set(
                    {"sellAttempts": 0, "lastSellDate": None}, merge=True))
        
        response = {
            "attempts": attempts,
            "lastSellDate": last_sell_date
        }
        logger.debug(f"Retrieved sell attempts for user {user_id}: {response}")
        return jsonify(response), 200
    except Exception as e:
        logger.error(f"Error retrieving sell attempts for user {user_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500



MAX_SELL_ATTEMPTS = 1,
MAX_HOURS = 1,
       
@app.route('/api/save_sell_attempts', methods=['POST'])
async def save_sell_attempts():
    try:
        data = await request.get_json()
        user_id = data.get('userId')
        attempts = data.get('attempts')
        last_sell_date = data.get('lastSellDate')

        if not user_id or attempts is None:
            logger.warning("Missing userId or attempts in request body")
            return jsonify({"error": "userId and attempts are required"}), 400

        # Prepare update data
        update_data = {
            "sellAttempts": attempts,
            "lastSellDate": last_sell_date if last_sell_date else datetime.now().isoformat(),
            "lockUntil": (datetime.now() + timedelta(MAX_HOURS)).isoformat() if attempts >= MAX_SELL_ATTEMPTS else None
        }

        # Run synchronous Firestore operation in a separate thread
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, lambda: db.collection('users').document(user_id).set(update_data, merge=True))

        logger.info(f"Saved sell attempts for user {user_id}: {update_data}")
        return jsonify({"success": True, "lockUntil": update_data["lockUntil"]}), 200
    except Exception as e:
        logger.error(f"Error saving sell attempts: {str(e)}")
        return jsonify({"error": str(e)}), 500
        

if __name__ == '__main__':
    start_background_worker()
    import hypercorn.asyncio
    from hypercorn.config import Config
    config = Config()
    config.bind = ["0.0.0.0:5000"]
    asyncio.run(hypercorn.asyncio.serve(app, config))