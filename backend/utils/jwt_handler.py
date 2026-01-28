"""JWT token handling utilities"""

from flask_jwt_extended import create_access_token, decode_token as jwt_decode
from datetime import timedelta
import jwt
from functools import wraps
from flask import request, jsonify

def create_token(user_id: int, expires_delta: timedelta = None) -> str:
    """
    Create JWT access token
    
    Args:
        user_id: User ID to encode in token
        expires_delta: Token expiration time
    
    Returns:
        str: JWT token
    """
    if expires_delta is None:
        expires_delta = timedelta(hours=24)
    
    access_token = create_access_token(
        identity=user_id,
        expires_delta=expires_delta
    )
    
    return access_token

def decode_token(token: str) -> dict:
    """
    Decode JWT token
    
    Args:
        token: JWT token string
    
    Returns:
        dict: Decoded token payload
    """
    try:
        decoded = jwt_decode(token)
        return decoded
    except Exception as e:
        print(f"Error decoding token: {e}")
        return None

def token_required(f):
    """
    Decorator for routes that require authentication
    
    Usage:
        @app.route('/protected')
        @token_required
        def protected_route(current_user_id):
            return jsonify({'user_id': current_user_id})
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Decode token
            data = jwt_decode(token)
            current_user_id = data.get('sub')  # 'sub' is the standard claim for user ID
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

def verify_token(token: str) -> tuple:
    """
    Verify if token is valid
    
    Args:
        token: JWT token string
    
    Returns:
        tuple: (is_valid: bool, user_id: int or None, error: str or None)
    """
    try:
        decoded = jwt_decode(token)
        user_id = decoded.get('sub')
        return (True, user_id, None)
    except jwt.ExpiredSignatureError:
        return (False, None, 'Token has expired')
    except jwt.InvalidTokenError:
        return (False, None, 'Invalid token')
    except Exception as e:
        return (False, None, str(e))

def refresh_token(old_token: str) -> str:
    """
    Create new token from old token
    
    Args:
        old_token: Existing JWT token
    
    Returns:
        str: New JWT token or None if invalid
    """
    try:
        decoded = jwt_decode(old_token)
        user_id = decoded.get('sub')
        
        if user_id:
            return create_token(user_id)
        
        return None
    except Exception as e:
        print(f"Error refreshing token: {e}")
        return None
