


# from quart import Blueprint, request, jsonify, make_response
# from firebase_admin import auth, firestore
# from datetime import datetime, timezone
# import logging
# import base64
# import json
# from functools import wraps

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# def create_admin_blueprint(db):
#     admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

#     # Add CORS headers to all responses
#     @admin_bp.after_request
#     async def add_cors_headers(response):
#         logger.info(f"Adding CORS headers to {request.method} {request.path}")
#         response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
#         response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
#         response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
#         response.headers['Access-Control-Allow-Credentials'] = 'true'
#         return response

#     # Handle OPTIONS requests globally
#     @admin_bp.before_request
#     async def handle_options():
#         logger.info(f"Handling {request.method} request for {request.path}")
#         if request.method == 'OPTIONS':
#             logger.info("Handling OPTIONS request")
#             response = await make_response(jsonify({}), 200)
#             response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
#             response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
#             response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
#             response.headers['Access-Control-Allow-Credentials'] = 'true'
#             return response
#         return None

#     # Firebase authentication decorator for admin routes
#     def firebase_admin_required(f):
#         @wraps(f)
#         async def wrapper(*args, **kwargs):
#             try:
#                 auth_header = request.headers.get('Authorization', '')
#                 if not auth_header.startswith('Bearer '):
#                     logger.error("Authorization header missing or invalid")
#                     return jsonify({'status': 'error', 'message': 'Token required'}), 401
                
#                 token = auth_header.replace('Bearer ', '')
#                 logger.info(f"Verifying Firebase token for user: {token[:10]}...")
#                 decoded_token = auth.verify_id_token(token)
                
#                 # Check if user is admin
#                 user_ref = db.collection('users').document(decoded_token['uid'])
#                 user_doc = user_ref.get()
                
#                 if not user_doc.exists or not user_doc.to_dict().get('is_admin', False):
#                     logger.error(f"User {decoded_token['uid']} is not an admin")
#                     return jsonify({'status': 'error', 'message': 'Admin access required'}), 403
                    
#                 logger.info(f"User {decoded_token['uid']} authenticated as admin")
#                 request.user_id = decoded_token['uid']
#                 return await f(*args, **kwargs)
#             except Exception as e:
#                 logger.error(f"Admin auth error: {str(e)}")
#                 return jsonify({'status': 'error', 'message': 'Authentication failed'}), 401
#         return wrapper

#     # Sensitive fields to filter from user responses
#     SENSITIVE_FIELDS = {'password', 'tokens', 'secret_key', 'api_key', 'auth_token', 'verification_code'}

#     # Helper for cursor-based pagination
#     def encode_cursor(data):
#         return base64.b64encode(json.dumps(data, default=str).encode()).decode()

#     def decode_cursor(cursor_str):
#         return json.loads(base64.b64decode(cursor_str.encode()).decode())

#     # Filter sensitive user data
#     def filter_user_data(user_dict):
#         return {k: v for k, v in user_dict.items() if k not in SENSITIVE_FIELDS}

#     # Define route functions
#     @admin_bp.route('/users', methods=['GET'])
#     @firebase_admin_required
#     async def list_users():
#         logger.info("Processing GET /admin/users")
#         try:
#             limit = min(int(request.args.get('limit', 50)), 100)
#             cursor = request.args.get('cursor')
            
#             users_ref = db.collection('users').order_by('createdAt')
            
#             if cursor:
#                 cursor_data = decode_cursor(cursor)
#                 last_doc_ref = db.collection('users').document(cursor_data['last_id'])
#                 last_doc = last_doc_ref.get()
#                 users_ref = users_ref.start_after(last_doc).limit(limit)
#             else:
#                 users_ref = users_ref.limit(limit)
            
#             users = []
#             last_doc = None
            
#             for doc in users_ref.stream():
#                 user_data = filter_user_data(doc.to_dict())
#                 user_data['id'] = doc.id
#                 users.append(user_data)
#                 last_doc = doc
#                 logger.debug(f"User fetched: {user_data['id']}, Email: {user_data.get('email')}, Balance: {user_data.get('balance')}")
            
#             next_cursor = None
#             if last_doc and len(users) == limit:
#                 last_data = last_doc.to_dict()
#                 cursor_payload = {
#                     'last_created_at': last_data.get('createdAt'),
#                     'last_id': last_doc.id
#                 }
#                 next_cursor = encode_cursor(cursor_payload)
            
#             logger.info(f"Returning {len(users)} users")
#             return jsonify({
#                 'status': 'success',
#                 'data': users,
#                 'next_cursor': next_cursor
#             })
#         except Exception as e:
#             logger.error(f"Error listing users: {str(e)}")
#             return jsonify({'status': 'error', 'message': str(e)}), 500

#     @admin_bp.route('/users/<user_id>', methods=['GET'])
#     @firebase_admin_required
#     async def get_user(user_id):
#         logger.info(f"Processing GET /admin/users/{user_id}")
#         try:
#             user_ref = db.collection('users').document(user_id)
#             user_doc = user_ref.get()
            
#             if not user_doc.exists:
#                 logger.error(f"User {user_id} not found")
#                 return jsonify({'status': 'error', 'message': 'User not found'}), 404
                
#             user_data = filter_user_data(user_doc.to_dict())
#             user_data['id'] = user_doc.id
            
#             return jsonify({
#                 'status': 'success',
#                 'data': user_data
#             })
#         except Exception as e:
#             logger.error(f"Error getting user {user_id}: {str(e)}")
#             return jsonify({'status': 'error', 'message': str(e)}), 500

#     @admin_bp.route('/users/<user_id>/promote', methods=['POST'])
#     @firebase_admin_required
#     async def promote_user(user_id):
#         logger.info(f"Processing POST /admin/users/{user_id}/promote")
#         try:
#             data = await request.get_json()
#             role = data.get('role')
            
#             if role not in ['manager', 'admin', 'user']:
#                 logger.error(f"Invalid role: {role}")
#                 return jsonify({'status': 'error', 'message': 'Invalid role'}), 400
                
#             user_ref = db.collection('users').document(user_id)
#             user_doc = user_ref.get()
            
#             if not user_doc.exists:
#                 logger.error(f"User {user_id} not found")
#                 return jsonify({'status': 'error', 'message': 'User not found'}), 404
                
#             updates = {
#                 'is_manager': role == 'manager',
#                 'is_admin': role == 'admin',
#                 'updated_at': datetime.now(timezone.utc)
#             }
#             if role == 'user':
#                 updates['is_manager'] = False
#                 updates['is_admin'] = False
                
#             user_ref.update(updates)
            
#             logger.info(f"User {user_id} promoted to {role}")
#             return jsonify({
#                 'status': 'success',
#                 'message': f'User promoted to {role}',
#                 'data': updates
#             })
#         except Exception as e:
#             logger.error(f"Error promoting user {user_id}: {str(e)}")
#             return jsonify({'status': 'error', 'message': str(e)}), 500

#     @admin_bp.route('/transactions', methods=['GET'])
#     @firebase_admin_required
#     async def list_transactions():
#         logger.info("Processing GET /admin/transactions")
#         try:
#             limit = min(int(request.args.get('limit', 50)), 100)
#             cursor = request.args.get('cursor')
            
#             tx_ref = db.collection('pamm_distributions').order_by('timestamp', direction=firestore.Query.DESCENDING)
            
#             if cursor:
#                 cursor_data = decode_cursor(cursor)
#                 last_doc_ref = db.collection('pamm_distributions').document(cursor_data['last_id'])
#                 last_doc = last_doc_ref.get()
#                 tx_ref = tx_ref.start_after(last_doc).limit(limit)
#             else:
#                 tx_ref = tx_ref.limit(limit)
            
#             transactions = []
#             last_doc = None
            
#             for doc in tx_ref.stream():
#                 tx_data = doc.to_dict()
#                 details = tx_data.get('details', [{}])[0] if tx_data.get('details', []) else {}
#                 user_id = tx_data.get('user_id', details.get('user_id', 'N/A'))
#                 net_amount = float(tx_data.get('net_amount', details.get('net_amount', 0.0)))
#                 timestamp = tx_data.get('timestamp')
#                 created_at = timestamp.isoformat() if timestamp else None
                
#                 transactions.append({
#                     'id': doc.id,
#                     'user_id': user_id,
#                     'type': tx_data.get('type', 'pamm_distribution'),
#                     'amount': net_amount,
#                     'created_at': created_at
#                 })
#                 logger.debug(f"Transaction fetched: ID={doc.id}, User ID={user_id}, Amount={net_amount}, Timestamp={created_at}")
#                 last_doc = doc
            
#             next_cursor = None
#             if last_doc and len(transactions) == limit:
#                 last_data = last_doc.to_dict()
#                 cursor_payload = {
#                     'last_timestamp': last_data.get('timestamp'),
#                     'last_id': last_doc.id
#                 }
#                 next_cursor = encode_cursor(cursor_payload)
            
#             logger.info(f"Returning {len(transactions)} transactions")
#             return jsonify({
#                 'status': 'success',
#                 'data': transactions,
#                 'next_cursor': next_cursor
#             })
#         except Exception as e:
#             logger.error(f"Error listing transactions: {str(e)}")
#             return jsonify({'status': 'error', 'message': str(e)}), 500

#     @admin_bp.route('/pamm/override', methods=['POST'])
#     @firebase_admin_required
#     async def pamm_override():
#         logger.info("Processing POST /admin/pamm/override")
#         try:
#             data = await request.get_json()
#             action = data.get('action')
            
#             if action not in ['pause', 'resume', 'adjust_fee']:
#                 logger.error(f"Invalid action: {action}")
#                 return jsonify({'status': 'error', 'message': 'Invalid action'}), 400
                
#             if action == 'adjust_fee':
#                 new_fee = float(data.get('fee', 0.2))
#                 if not 0 <= new_fee <= 1:
#                     logger.error(f"Invalid fee: {new_fee}")
#                     return jsonify({'status': 'error', 'message': 'Fee must be between 0 and 1'}), 400
                    
#             # pamm_ref = dbWise.collection('pamm_settings').document('config')
#             pamm_ref = db.collection('pamm_settings').document('config')
            
#             if action == 'pause':
#                 pamm_ref.set({'status': 'paused'}, merge=True)
#                 message = 'PAMM system paused'
#             elif action == 'resume':
#                 pamm_ref.set({'status': 'active'}, merge=True)
#                 message = 'PAMM system resumed'
#             elif action == 'adjust_fee':
#                 pamm_ref.set({'performance_fee': new_fee}, merge=True)
#                 message = f'Performance fee updated to {new_fee*100}%'
                
#             logger.info(f"PAMM override successful: {message}")
#             return jsonify({
#                 'status': 'success',
#                 'message': message
#             })
#         except Exception as e:
#             logger.error(f"Error in PAMM override: {str(e)}")
#             return jsonify({'status': 'error', 'message': str(e)}), 500

#     @admin_bp.route('/system/stats', methods=['GET'])
#     @firebase_admin_required
#     async def system_stats():
#         logger.info("Processing GET /admin/system/stats")
#         try:
#             stats_ref = db.collection('system_stats').document('current')
#             stats_doc = stats_ref.get()
            
#             if stats_doc.exists:
#                 stats_data = stats_doc.to_dict()
#                 stats_data['total_deposits'] = float(stats_data.get('total_deposits', 0.0))
#                 stats_data['total_volume'] = float(stats_data.get('total_volume', 0.0))
#                 logger.info(f"System stats retrieved: {stats_data}")
#                 return jsonify({
#                     'status': 'success',
#                     'data': stats_data
#                 })
            
#             logger.warning("System stats not available, returning default values")
#             return jsonify({
#                 'status': 'success',
#                 'data': {
#                     'total_users': 0,
#                     'active_users': 0,
#                     'total_deposits': 0.0,
#                     'total_volume': 0.0
#                 }
#             })
#         except Exception as e:
#             logger.error(f"Error getting system stats: {str(e)}")
#             return jsonify({'status': 'error', 'message': str(e)}), 500

#     @admin_bp.route('/test', methods=['GET'])
#     async def test():
#         logger.info("Test route accessed")
#         return jsonify({'status': 'success', 'message': 'Admin test route working'})
    

#     return admin_bp

















from quart import Blueprint, request, jsonify, make_response
import os
from firebase_admin import auth, firestore
from datetime import datetime, timezone, timedelta
import logging
import base64
import json
from functools import wraps
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import uuid
from quart_rate_limiter import rate_limit

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Firebase authentication decorator factory for admin routes
def firebase_admin_required(db):
    def decorator(f):
        @wraps(f)
        async def wrapper(*args, **kwargs):
            try:
                auth_header = request.headers.get('Authorization', '')
                if not auth_header.startswith('Bearer '):
                    logger.error("Authorization header missing or invalid")
                    return jsonify({'status': 'error', 'message': 'Token required'}), 401
                
                token = auth_header.replace('Bearer ', '')
                logger.info(f"Verifying Firebase token for user: {token[:10]}...")
                decoded_token = auth.verify_id_token(token)
                
                user_ref = db.collection('users').document(decoded_token['uid'])
                user_doc = user_ref.get()
                
                if not user_doc.exists or not user_doc.to_dict().get('is_admin', False):
                    logger.error(f"User {decoded_token['uid']} is not an admin")
                    return jsonify({'status': 'error', 'message': 'Admin access required'}), 403
                    
                logger.info(f"User {decoded_token['uid']} authenticated as admin")
                request.user_id = decoded_token['uid']
                return await f(*args, **kwargs)
            except Exception as e:
                logger.error(f"Admin auth error: {str(e)}")
                return jsonify({'status': 'error', 'message': 'Authentication failed'}), 401
        return wrapper
    return decorator

def create_admin_blueprint(db):
    admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

    # Add CORS headers to all responses
    @admin_bp.after_request
    async def add_cors_headers(response):
        logger.info(f"Adding CORS headers to {request.method} {request.path}")
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    # Handle OPTIONS requests globally
    @admin_bp.before_request
    async def handle_options():
        logger.info(f"Handling {request.method} request for {request.path}")
        if request.method == 'OPTIONS':
            logger.info("Handling OPTIONS request")
            response = await make_response(jsonify({}), 200)
            response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            return response
        return None

    # Sensitive fields to filter from user responses
    SENSITIVE_FIELDS = {'password', 'tokens', 'secret_key', 'api_key', 'auth_token', 'verification_code'}

    # Helper for cursor-based pagination
    def encode_cursor(data):
        return base64.b64encode(json.dumps(data, default=str).encode()).decode()

    def decode_cursor(cursor_str):
        return json.loads(base64.b64decode(cursor_str.encode()).decode())

    # Filter sensitive user data
    def filter_user_data(user_dict):
        return {k: v for k, v in user_dict.items() if k not in SENSITIVE_FIELDS}

    # Define admin route functions
    @admin_bp.route('/users', methods=['GET'])
    @firebase_admin_required(db)
    @rate_limit(50, timedelta(minutes=1))
    async def list_users():
        logger.info("Processing GET /admin/users")
        try:
            limit = min(int(request.args.get('limit', 50)), 100)
            cursor = request.args.get('cursor')
            
            users_ref = db.collection('users').order_by('createdAt')
            
            if cursor:
                cursor_data = decode_cursor(cursor)
                last_doc_ref = db.collection('users').document(cursor_data['last_id'])
                last_doc = last_doc_ref.get()
                users_ref = users_ref.start_after(last_doc).limit(limit)
            else:
                users_ref = users_ref.limit(limit)
            
            users = []
            last_doc = None
            
            for doc in users_ref.stream():
                user_data = filter_user_data(doc.to_dict())
                user_data['id'] = doc.id
                users.append(user_data)
                logger.debug(f"User fetched: {user_data['id']}, Email: {user_data.get('email')}, Balance: {user_data.get('balance')}")
                last_doc = doc
            
            next_cursor = None
            if last_doc and len(users) == limit:
                last_data = last_doc.to_dict()
                cursor_payload = {
                    'last_created_at': last_data.get('createdAt'),
                    'last_id': last_doc.id
                }
                next_cursor = encode_cursor(cursor_payload)
            
            logger.info(f"Returning {len(users)} users")
            return jsonify({
                'status': 'success',
                'data': users,
                'next_cursor': next_cursor
            })
        except Exception as e:
            logger.error(f"Error listing users: {str(e)}")
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @admin_bp.route('/users/<user_id>', methods=['GET'])
    @firebase_admin_required(db)
    @rate_limit(50, timedelta(minutes=1))
    async def get_user(user_id):
        logger.info(f"Processing GET /admin/users/{user_id}")
        try:
            user_ref = db.collection('users').document(user_id)
            user_doc = user_ref.get()
            
            if not user_doc.exists:
                logger.error(f"User {user_id} not found")
                return jsonify({'status': 'error', 'message': 'User not found'}), 404
                
            user_data = filter_user_data(user_doc.to_dict())
            user_data['id'] = user_doc.id
            
            return jsonify({
                'status': 'success',
                'data': user_data
            })
        except Exception as e:
            logger.error(f"Error getting user {user_id}: {str(e)}")
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @admin_bp.route('/users/<user_id>/promote', methods=['POST'])
    @firebase_admin_required(db)
    @rate_limit(10, timedelta(minutes=1))
    async def promote_user(user_id):
        logger.info(f"Processing POST /admin/users/{user_id}/promote")
        try:
            data = await request.get_json()
            role = data.get('role')
            
            if role not in ['manager', 'admin', 'user']:
                logger.error(f"Invalid role: {role}")
                return jsonify({'status': 'error', 'message': 'Invalid role'}), 400
                
            user_ref = db.collection('users').document(user_id)
            user_doc = user_ref.get()
            
            if not user_doc.exists:
                logger.error(f"User {user_id} not found")
                return jsonify({'status': 'error', 'message': 'User not found'}), 404
                
            updates = {
                'is_manager': role == 'manager',
                'is_admin': role == 'admin',
                'updated_at': datetime.now(timezone.utc)
            }
            if role == 'user':
                updates['is_manager'] = False
                updates['is_admin'] = False
                
            user_ref.update(updates)
            
            logger.info(f"User {user_id} promoted to {role}")
            return jsonify({
                'status': 'success',
                'message': f'User promoted to {role}',
                'data': updates
            })
        except Exception as e:
            logger.error(f"Error promoting user {user_id}: {str(e)}")
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @admin_bp.route('/transactions', methods=['GET'])
    @firebase_admin_required(db)
    @rate_limit(50, timedelta(minutes=1))
    async def list_transactions():
        logger.info("Processing GET /admin/transactions")
        try:
            limit = min(int(request.args.get('limit', 50)), 100)
            cursor = request.args.get('cursor')
            
            tx_ref = db.collection('pamm_distributions').order_by('timestamp', direction=firestore.Query.DESCENDING)
            
            if cursor:
                cursor_data = decode_cursor(cursor)
                last_doc_ref = db.collection('pamm_distributions').document(cursor_data['last_id'])
                last_doc = last_doc_ref.get()
                tx_ref = tx_ref.start_after(last_doc).limit(limit)
            else:
                tx_ref = tx_ref.limit(limit)
            
            transactions = []
            last_doc = None
            
            for doc in tx_ref.stream():
                tx_data = doc.to_dict()
                details = tx_data.get('details', [{}])[0] if tx_data.get('details', []) else {}
                user_id = tx_data.get('user_id', details.get('user_id', 'N/A'))
                net_amount = float(tx_data.get('net_amount', details.get('net_amount', 0.0)))
                timestamp = tx_data.get('timestamp')
                created_at = timestamp.isoformat() if timestamp else None
                
                transactions.append({
                    'id': doc.id,
                    'user_id': user_id,
                    'type': tx_data.get('type', 'pamm_distribution'),
                    'amount': net_amount,
                    'created_at': created_at
                })
                logger.debug(f"Transaction fetched: ID={doc.id}, User ID={user_id}, Amount={net_amount}, Timestamp={created_at}")
                last_doc = doc
            
            next_cursor = None
            if last_doc and len(transactions) == limit:
                last_data = last_doc.to_dict()
                cursor_payload = {
                    'last_timestamp': last_data.get('timestamp'),
                    'last_id': last_doc.id
                }
                next_cursor = encode_cursor(cursor_payload)
            
            logger.info(f"Returning {len(transactions)} transactions")
            return jsonify({
                'status': 'success',
                'data': transactions,
                'next_cursor': next_cursor
            })
        except Exception as e:
            logger.error(f"Error listing transactions: {str(e)}")
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @admin_bp.route('/pamm/override', methods=['POST'])
    @firebase_admin_required(db)
    @rate_limit(10, timedelta(minutes=1))
    async def pamm_override():
        logger.info("Processing POST /admin/pamm/override")
        try:
            data = await request.get_json()
            action = data.get('action')
            
            if action not in ['pause', 'resume', 'adjust_fee']:
                logger.error(f"Invalid action: {action}")
                return jsonify({'status': 'error', 'message': 'Invalid action'}), 400
                
            if action == 'adjust_fee':
                new_fee = float(data.get('fee', 0.2))
                if not 0 <= new_fee <= 1:
                    logger.error(f"Invalid fee: {new_fee}")
                    return jsonify({'status': 'error', 'message': 'Fee must be between 0 and 1'}), 400
                    
            pamm_ref = db.collection('pamm_settings').document('config')
            
            if action == 'pause':
                pamm_ref.set({'status': 'paused'}, merge=True)
                message = 'PAMM system paused'
            elif action == 'resume':
                pamm_ref.set({'status': 'active'}, merge=True)
                message = 'PAMM system resumed'
            elif action == 'adjust_fee':
                pamm_ref.set({'performance_fee': new_fee}, merge=True)
                message = f'Performance fee updated to {new_fee*100}%'
                
            logger.info(f"PAMM override successful: {message}")
            return jsonify({
                'status': 'success',
                'message': message
            })
        except Exception as e:
            logger.error(f"Error in PAMM override: {str(e)}")
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @admin_bp.route('/system/stats', methods=['GET'])
    @firebase_admin_required(db)
    @rate_limit(50, timedelta(minutes=1))
    async def system_stats():
        logger.info("Processing GET /admin/system/stats")
        try:
            stats_ref = db.collection('system_stats').document('current')
            stats_doc = stats_ref.get()
            
            if stats_doc.exists:
                stats_data = stats_doc.to_dict()
                stats_data['total_deposits'] = float(stats_data.get('total_deposits', 0.0))
                stats_data['total_volume'] = float(stats_data.get('total_volume', 0.0))
                logger.info(f"System stats retrieved: {stats_data}")
                return jsonify({
                    'status': 'success',
                    'data': stats_data
                })
            
            logger.warning("System stats not available, returning default values")
            return jsonify({
                'status': 'success',
                'data': {
                    'total_users': 0,
                    'active_users': 0,
                    'total_deposits': 0.0,
                    'total_volume': 0.0
                }
            })
        except Exception as e:
            logger.error(f"Error getting system stats: {str(e)}")
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @admin_bp.route('/test', methods=['GET'])
    async def test():
        logger.info("Test route accessed")
        return jsonify({'status': 'success', 'message': 'Admin test route working'})

    return admin_bp








def create_payment_blueprint(db):
    payment_bp = Blueprint('payment', __name__, url_prefix='/api/payment')

    # Add CORS headers to all responses
    @payment_bp.after_request
    async def add_cors_headers(response):
        logger.info(f"Adding CORS headers to {request.method} {request.path}")
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    # Handle OPTIONS requests
    @payment_bp.before_request
    async def handle_options():
        logger.info(f"Handling {request.method} request for {request.path}")
        if request.method == 'OPTIONS':
            response = await make_response(jsonify({}), 200)
            response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            return response
        return None

    # Email configuration
    EMAIL_SENDER = os.getenv("EMAIL_SENDER")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

    # Send welcome email with access token
    def send_welcome_email(investor_email: str, investor_name: str, access_token: str):
        try:
            msg = MIMEMultipart()
            msg['From'] = EMAIL_SENDER
            msg['To'] = investor_email
            msg['Subject'] = "Welcome to GimaCapital Investor Portal"
            body = f"""
Dear {investor_name},

Congratulations on your investment in GimaCapital! Your payment has been verified, and legal documents have been processed.
Please use the following link to access your private investor dashboard:
https://www.gimacapital.com/investor-login?token={access_token}

This link is valid for 24 hours. Once logged in, you can set up your account and access quarterly updates and financial reports.

Best regards,
GimaCapital Investment Team
investment@gimacapital.com
"""
            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, investor_email, msg.as_string())
            server.quit()
            logger.info(f"Welcome email sent to {investor_email}")
        except Exception as e:
            logger.error(f"Failed to send welcome email: {str(e)}")
            
            
    
             # Email configuration
    EMAIL_SENDER = os.getenv("EMAIL_SENDER")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

    def send_welcome_email(investor_email: str, investor_name: str, access_token: str):
        try:
            msg = MIMEMultipart()
            msg['From'] = EMAIL_SENDER
            msg['To'] = investor_email
            msg['Subject'] = "Your GimaCapital Investor Portal Access Token"
            body = f"""
Dear {investor_name},

Your access token for the GimaCapital Investor Portal has been updated. Please use the following link to log in:
https://www.gimacapital.com/investor-login?token={access_token}

This link is valid for 24 hours. Once logged in, you can access your investor dashboard, quarterly updates, and financial reports.

Best regards,
GimaCapital Investment Team
investment@gimacapital.com
"""
            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, investor_email, msg.as_string())
            server.quit()
            logger.info(f"Access token email sent to {investor_email}")
        except Exception as e:
            logger.error(f"Failed to send access token email: {str(e)}")
            

    @payment_bp.route('/request-new-token', methods=['POST'])
    async def request_new_token():
        try:
            data = await request.get_json()
            email = data.get('email')

            if not email:
                logger.error("Missing email in request-new-token request")
                return jsonify({"error": "Email is required"}), 400

            # Find investor by email
            investor_query = db.collection('accredited_investors').where('email', '==', email).get()
            if not investor_query:
                logger.error(f"No investor found for email: {email}")
                return jsonify({"error": "No investor account found for this email"}), 404

            investor = investor_query[0]
            investor_data = investor.to_dict()
            if investor_data['status'] != 'active':
                logger.error(f"Investor account not active for email: {email}")
                return jsonify({"error": "Investor account is not active"}), 403

            # Generate new access token
            new_access_token = str(uuid.uuid4())
            expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

            # Update Firestore
            investor_ref = db.collection('accredited_investors').document(investor.id)
            investor_ref.update({
                'accessToken': new_access_token,
                'accessTokenExpires': expires_at,
                'updatedAt': firestore.SERVER_TIMESTAMP
            })

            # Send email with new token
            send_welcome_email(investor_data['email'], investor_data['name'], new_access_token)

            logger.info(f"New access token generated for investor {investor.id}")
            return jsonify({"message": "A new access token has been sent to your email"}), 200

        except Exception as e:
            logger.error(f"Error generating new access token: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
        
        
        
    
    
    @payment_bp.route('/save-investor', methods=['POST'])
    @rate_limit(10, timedelta(minutes=1))
    async def save_investor():
        try:
            data = await request.get_json()
            logger.info(f"Received payload for /save-investor: {data}")  # Log payload for debugging
            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone', '')  # Default to empty string
            accredited_investor = data.get('accreditedInvestor')
            transaction_hash = data.get('transactionHash')
            currency = data.get('currency')
            amount = data.get('amount')

            # Validate required fields
            if not all([name, email, transaction_hash, currency]) or accredited_investor is not True or not isinstance(amount, (int, float)) or amount <= 0:
                logger.error(f"Validation failed: name={name}, email={email}, accreditedInvestor={accredited_investor}, transactionHash={transaction_hash}, currency={currency}, amount={amount}")
                return jsonify({"error": "Missing or invalid required fields. Ensure all fields are provided, accreditedInvestor is true, and amount is positive."}), 400

            if currency not in ['BTC', 'USDT']:
                logger.error(f"Unsupported currency: {currency}")
                return jsonify({"error": "Unsupported currency"}), 400

            investor_id = str(uuid.uuid4())
            investor_ref = db.collection('accredited_investors').document(investor_id)
            investor_ref.set({
                'name': name,
                'email': email,
                'phone': phone,
                'accreditedInvestor': accredited_investor,
                'totalInvested': 0.0,
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP,
                'investments': {},
                'status': 'pending_verification',
                'accessToken': None,
                'accessTokenExpires': None
            }, merge=True)

            transaction_ref = db.collection('accredited_transactions').document(transaction_hash)
            transaction_ref.set({
                'investorId': investor_id,
                'currency': currency,
                'amount': float(amount),
                'transactionHash': transaction_hash,
                'status': 'pending',
                'createdAt': firestore.SERVER_TIMESTAMP
            })

            logger.info(f"Saved accredited investor details and transaction for {investor_id}")
            return jsonify({
                "investorId": investor_id,
                "transactionHash": transaction_hash,
                "message": "Accredited investor details and transaction saved. Awaiting admin verification."
            }), 200

        except Exception as e:
            logger.error(f"Error saving accredited investor: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
        

    # Admin: Get pending accredited investors
    @payment_bp.route('/admin/pending-investors', methods=['GET'])
    @firebase_admin_required(db)
    @rate_limit(5, timedelta(minutes=1))
    async def get_pending_investors():
        try:
            investors = db.collection('accredited_investors').where('status', '==', 'pending_verification').stream()
            pending_investors = [
                {
                    'investorId': investor.id,
                    **investor.to_dict(),
                    'transactions': [
                        tx.to_dict() for tx in db.collection('accredited_transactions')
                        .where('investorId', '==', investor.id)
                        .where('status', '==', 'pending')
                        .stream()
                    ]
                }
                for investor in investors
            ]
            return jsonify(pending_investors), 200

        except Exception as e:
            logger.error(f"Error fetching pending accredited investors: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

    # Admin: Verify accredited investor and grant access
    @payment_bp.route('/admin/verify-investor/<investor_id>', methods=['POST'])
    @firebase_admin_required(db)
    @rate_limit(5, timedelta(minutes=1))
    async def verify_investor(investor_id: str):
        try:
            investor_ref = db.collection('accredited_investors').document(investor_id)
            investor = investor_ref.get()
            if not investor.exists:
                return jsonify({"error": "Accredited investor not found"}), 404

            investor_data = investor.to_dict()
            if investor_data['status'] != 'pending_verification':
                return jsonify({"error": "Accredited investor not in pending verification status"}), 400

            transactions = db.collection('accredited_transactions').where('investorId', '==', investor_id).where('status', '==', 'pending').stream()
            for tx in transactions:
                tx_ref = db.collection('accredited_transactions').document(tx.id)
                tx_ref.update({
                    'status': 'confirmed',
                    'confirmedAt': firestore.SERVER_TIMESTAMP
                })

            access_token = str(uuid.uuid4())
            expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

            investor_ref.update({
                'status': 'active',
                'accessToken': access_token,
                'accessTokenExpires': expires_at,
                'totalInvested': firestore.Increment(sum(tx.to_dict()['amount'] for tx in db.collection('accredited_transactions').where('investorId', '==', investor_id).stream())),
                'updatedAt': firestore.SERVER_TIMESTAMP
            })

            send_welcome_email(investor_data['email'], investor_data['name'], access_token)

            logger.info(f"Accredited investor {investor_id} verified and access granted")
            return jsonify({"message": "Accredited investor verified, access granted, and welcome email sent"}), 200

        except Exception as e:
            logger.error(f"Error verifying accredited investor: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
        
        
        
    
    @payment_bp.route('/admin/active-investors', methods=['GET'])
    @firebase_admin_required(db)
    @rate_limit(5, timedelta(minutes=1))
    async def get_active_investors():
        try:
            investors = db.collection('accredited_investors').where('status', '==', 'active').stream()
            active_investors = [
                {
                    'investorId': investor.id,
                    **investor.to_dict(),
                    'transactions': [
                        tx.to_dict() for tx in db.collection('accredited_transactions')
                        .where('investorId', '==', investor.id)
                        .where('status', '==', 'confirmed')
                        .stream()
                    ]
                }
                for investor in investors
            ]
            return jsonify(active_investors), 200
        except Exception as e:
            logger.error(f"Error fetching active accredited investors: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
        
        

     # Investor login with access token
    @payment_bp.route('/investor-login', methods=['POST'])
    @rate_limit(10, timedelta(minutes=1))
    async def investor_login():
        try:
            data = await request.get_json()
            access_token = data.get('accessToken')

            if not access_token:
                logger.error("Missing access token in investor login request")
                return jsonify({"error": "Missing access token"}), 400

            investor = db.collection('accredited_investors').where('accessToken', '==', access_token).get()
            if not investor:
                logger.error(f"Invalid access token: {access_token}")
                return jsonify({"error": "Invalid or expired access token"}), 401

            investor = investor[0]
            investor_data = investor.to_dict()
            if investor_data['accessTokenExpires'].replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
                logger.error(f"Expired access token for investor: {investor.id}")
                return jsonify({"error": "Access token expired"}), 401

            # Generate Firebase custom token
            custom_token = auth.create_custom_token(investor.id)
            logger.info(f"Generated custom token for investor: {investor.id}")

            return jsonify({
                "investorId": investor.id,
                "customToken": custom_token.decode('utf-8'),  # Convert bytes to string
                "message": "Login successful"
            }), 200

        except Exception as e:
            logger.error(f"Error during accredited investor login: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
        
        
        

    # # Fetch accredited investor data
    # @payment_bp.route('/investor/<investor_id>', methods=['GET'])
    # @rate_limit(10, timedelta(minutes=1))
    # async def get_investor(investor_id: str):
    #     try:
    #         investor_ref = db.collection('accredited_investors').document(investor_id)
    #         investor = investor_ref.get()
    #         if not investor.exists:
    #             return jsonify({"error": "Accredited investor not found"}), 404

    #         investor_data = investor.to_dict()
    #         if investor_data['status'] != 'active':
    #             return jsonify({"error": "Accredited investor account not active"}), 403

    #         # Verify access token in Authorization header
    #         auth_header = request.headers.get('Authorization', '')
    #         if not auth_header.startswith('Bearer '):
    #             return jsonify({"error": "Unauthorized"}), 401

    #         token = auth_header.replace('Bearer ', '')
    #         if investor_data['accessToken'] != token or investor_data['accessTokenExpires'].replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
    #             return jsonify({"error": "Invalid or expired access token"}), 401

    #         return jsonify(investor_data), 200

    #     except Exception as e:
    #         logger.error(f"Error fetching accredited investor data: {str(e)}")
    #         return jsonify({"error": "Internal server error"}), 500
    
    
    @payment_bp.route('/investor/<investor_id>', methods=['GET'])
    @rate_limit(10, timedelta(minutes=1))
    async def get_investor(investor_id: str):
        try:
            # Fetch investor data
            investor_ref = db.collection('accredited_investors').document(investor_id)
            investor = investor_ref.get()
            if not investor.exists:
                return jsonify({"error": "Accredited investor not found"}), 404

            investor_data = investor.to_dict()
            if investor_data['status'] != 'active':
                return jsonify({"error": "Accredited investor account not active"}), 403

            # Verify access token
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return jsonify({"error": "Unauthorized"}), 401

            token = auth_header.replace('Bearer ', '')
            if investor_data['accessToken'] != token or investor_data['accessTokenExpires'].replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
                return jsonify({"error": "Invalid or expired access token"}), 401

            # Fetch transactions for this investor
            transactions_ref = db.collection('accredited_transactions').where('investorId', '==', investor_id)
            transactions = transactions_ref.stream()

            # Build investments map
            investments = {}
            for tx in transactions:
                tx_data = tx.to_dict()
                investments[tx.id] = {
                    'amount': tx_data['amount'],
                    'currency': tx_data['currency'],
                    'status': tx_data['status'],
                    'confirmedAt': tx_data.get('confirmedAt', None),  # Handle missing confirmedAt
                    'createdAt': tx_data.get('createdAt', None),
                    'transactionHash': tx_data['transactionHash']
                }

            # Merge investments into investor_data
            investor_data['investments'] = investments

            return jsonify(investor_data), 200

        except Exception as e:
            logger.error(f"Error fetching accredited investor data: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
            
        
        

    # Fetch quarterly updates
    @payment_bp.route('/quarterly-updates', methods=['GET'])
    @rate_limit(10, timedelta(minutes=1))
    async def get_quarterly_updates():
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return jsonify({"error": "Unauthorized"}), 401

            token = auth_header.replace('Bearer ', '')
            investor = db.collection('accredited_investors').where('accessToken', '==', token).get()
            if not investor:
                return jsonify({"error": "Invalid or expired access token"}), 401

            investor = investor[0]
            investor_data = investor.to_dict()
            if investor_data['accessTokenExpires'].replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
                return jsonify({"error": "Access token expired"}), 401

            updates = db.collection('quarterly_updates').order_by('publishedAt', direction=firestore.Query.DESCENDING).get()
            updates_list = [
                {
                    'title': update.to_dict()['title'],
                    'summary': update.to_dict()['summary'],
                    'publishedAt': update.to_dict()['publishedAt'].isoformat(),
                    'reportUrl': update.to_dict().get('reportUrl', '')
                }
                for update in updates
            ]
            return jsonify(updates_list), 200

        except Exception as e:
            logger.error(f"Error fetching quarterly updates: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
        
        

    return payment_bp








