from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from app.database import db
from app.utils import hash_password, verify_password
from bson import ObjectId
from jose import jwt
from datetime import datetime, timedelta, timezone

import os

router = APIRouter()

# JWT Settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str
    age: int = None
    gender: str = None
    weight: float = None

class LoginRequest(BaseModel):
    email: str
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/signup")
async def signup(payload: SignupRequest):
    email_clean = payload.email.strip().lower()
    print("Incoming email:", email_clean)

    existing_user = await db.users.find_one({"email": email_clean})
    print("Matched user:", existing_user)

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(payload.password)

    user_doc = {
        "username": payload.username,
        "email": email_clean,
        "password_hash": hashed_pw,
        "age": payload.age,
        "gender": payload.gender,
        "weight": payload.weight,
        "total_points": 0,
        "points_history": [],
        "created_at": datetime.now(timezone.utc),
        "daily_streak": 0,
        "completed_7_day_streaks": 0,
        "last_claimed_date": None,
        "last_daily_points_claimed": None
    }

    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    access_token = create_access_token({"sub": user_id})

    return {"access_token": access_token, "token_type": "bearer", "user_id": user_id}

@router.post("/login")
async def login(payload: LoginRequest):
    email_clean = payload.email.strip().lower()
    user = await db.users.find_one({"email": email_clean})
    
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    user_id = str(user["_id"])
    access_token = create_access_token({"sub": user_id})

    return {"access_token": access_token, "token_type": "bearer", "user_id": user_id}
