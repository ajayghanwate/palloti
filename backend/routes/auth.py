```python
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from services.auth_service import verify_password, create_access_token, get_password_hash, SECRET_KEY, ALGORITHM
from services.supabase_service import supabase_service
from models.schemas import UserRegister, UserLogin, Token, TokenData, StudentLoginRequest
from typing import Optional
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        
        # Check if user exists in Supabase
        user = supabase_service.get_client().table("teachers").select("*").eq("id", user_id).single().execute()
        return user.data if user.data else None
    except Exception:
        return None

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    try:
        # Check if user already exists
        existing_user = supabase_service.get_client().table("teachers").select("*").eq("email", user_data.email).execute()
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = get_password_hash(user_data.password)
        
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
        access_token = create_access_token(
            data={"sub": str(user["id"]), "email": user["email"]}
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
    if not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(
        data={"sub": str(user["id"]), "email": user["email"]}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/student-login", response_model=Token)
async def student_login(request: StudentLoginRequest):
    # Verify student exists in attendance or feedback table
    # For MVP, broad check: does this name exist in our system?
    res_att = supabase_service.get_client().table("attendance").select("student_name").ilike("student_name", request.student_name).limit(1).execute()
    res_feed = supabase_service.get_client().table("feedback").select("student_name").ilike("student_name", request.student_name).limit(1).execute()
    
    if not res_att.data and not res_feed.data:
        raise HTTPException(status_code=400, detail="Student name not found in records")
        
    # For MVP, we trust the name + fixed PIN.
    # In production, we would check a stored hash.
    if request.pin != "1234":
         raise HTTPException(status_code=400, detail="Invalid PIN")

    # Create token with STUDENT role
    access_token = create_access_token(data={"sub": request.student_name, "role": "student"})
    return {"access_token": access_token, "token_type": "bearer"}
```
