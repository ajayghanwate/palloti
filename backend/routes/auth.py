from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from services.auth_service import auth_service, SECRET_KEY, ALGORITHM
from services.supabase_service import supabase_service
from models.schemas import UserRegister, LoginRequest, Token, TokenData, StudentLoginRequest, StudentRegister
from typing import Optional
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Use HTTPBearer for simple token-based auth in Swagger UI
security = HTTPBearer()

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Get current user from token. Handles the 'Bearer ' prefix automatically.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role", "teacher")
        
        if role == "student":
            return {"email": user_id, "id": "student", "role": "student"}

        if user_id is None:
            raise credentials_exception
        
        # Check if user exists in Supabase
        user = supabase_service.get_client().table("teachers").select("*").eq("id", user_id).single().execute()
        if user.data:
            user_data = user.data
            user_data["role"] = "teacher"
            return user_data
        raise credentials_exception
    except Exception:
        raise credentials_exception

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    try:
        # Check if user already exists
        existing_user = supabase_service.get_client().table("teachers").select("*").eq("email", user_data.email).execute()
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = auth_service.get_password_hash(user_data.password)
        
        new_user = {
            "name": user_data.name,
            "email": user_data.email,
            "password_hash": hashed_password,
            "subject": user_data.subject
        }
        
        result = supabase_service.get_client().table("teachers").insert(new_user).execute()
        
        if not result.data:
            print(f"Registration failed: {result}")
            raise HTTPException(status_code=500, detail="Failed to create user in database")
        
        user = result.data[0]
        access_token = auth_service.create_access_token(
            data={"sub": str(user["id"]), "email": user["email"], "role": "teacher"}
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Error during registration: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Registration Error: {str(e)}")

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_res = supabase_service.get_client().table("teachers").select("*").eq("email", form_data.username).execute()
    if not user_res.data:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    user = user_res.data[0]
    if not auth_service.verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = auth_service.create_access_token(
        data={"sub": str(user["id"]), "email": user["email"], "role": "teacher"}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/student-register", response_model=Token)
async def student_register(user_data: StudentRegister):
    try:
        # Check if student already exists
        existing_user = supabase_service.get_client().table("students").select("*").eq("email", user_data.email).execute()
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = auth_service.get_password_hash(user_data.password)
        
        new_user = {
            "name": user_data.name,
            "email": user_data.email,
            "password_hash": hashed_password
        }
        
        result = supabase_service.get_client().table("students").insert(new_user).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create student account")
        
        user = result.data[0]
        access_token = auth_service.create_access_token(
            data={"sub": str(user["id"]), "email": user["email"], "role": "student"}
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Registration Error: {str(e)}")

@router.post("/student-login", response_model=Token)
async def student_login(request: StudentLoginRequest):
    # Verify student exists in students table
    user_res = supabase_service.get_client().table("students").select("*").eq("email", request.email).execute()
    
    if not user_res.data:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    user = user_res.data[0]
    if not auth_service.verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    # Create token with STUDENT role
    access_token = auth_service.create_access_token(data={"sub": str(user["id"]), "email": user["email"], "role": "student"})
    return {"access_token": access_token, "token_type": "bearer"}

