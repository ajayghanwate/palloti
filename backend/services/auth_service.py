import os
import hashlib
from jose import jwt
from datetime import datetime, timedelta
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# JWT configuration
SECRET_KEY = os.environ.get("SECRET_KEY", "hackathon-secret-key-123456789")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))

class AuthService:
    def get_password_hash(self, password: str) -> str:
        """Simple SHA256 hashing for hackathon compatibility"""
        return hashlib.sha256(password.encode()).hexdigest()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.get_password_hash(plain_password) == hashed_password

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

auth_service = AuthService()
