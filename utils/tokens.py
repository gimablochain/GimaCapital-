
import os
import jwt
from datetime import datetime, timedelta
from typing import Optional, Tuple, Dict
from functools import wraps
from quart import jsonify, request

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is not set")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRY_DAYS = 1
REFRESH_TOKEN_EXPIRY_DAYS = 30

def create_access_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRY_DAYS),
        "iat": datetime.utcnow(),
        "type": "access",
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRY_DAYS),
        "iat": datetime.utcnow(),
        "type": "refresh",
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str, expected_type: str = None) -> Tuple[Optional[Dict], Optional[str]]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        if expected_type and payload.get("type") != expected_type:
            return None, f"Expected {expected_type} token"
            
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, "Token expired. Please login again"
    except jwt.InvalidTokenError as e:
        return None, f"Invalid token: {str(e)}"
    except Exception as e:
        return None, f"Token verification failed: {str(e)}"

def jwt_required(f):
    @wraps(f)
    async def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"status": "error", "message": "Missing or malformed token"}), 401

        token = auth_header.split(" ")[1]
        payload, error = verify_token(token, expected_type="access")

        if error:
            return jsonify({"status": "error", "message": error}), 401

        request.user_id = payload["sub"]
        return await f(*args, **kwargs)
    return decorated

async def create_auth_response(user_id: str, user_data: dict = None):
    """Helper to create consistent auth responses with tokens"""
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)
    
    response = {
        "status": "success",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_in": ACCESS_TOKEN_EXPIRY_DAYS * 86400,  # Convert days to seconds
    }
    
    if user_data:
        response["user"] = {
            "uid": user_id,
            "displayName": user_data.get("displayName", ""),
            "email": user_data.get("email", ""),
            "phone": user_data.get("phone", ""),
            "balance": user_data.get("balance", 0),
            "holdings": user_data.get("holdings", 0),
            "photoURL": user_data.get("photoURL", ""),
            "profit": user_data.get("profit", 0)
        }
    
    return response