from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import db
from app.schemas import UserCreate, UserOut, UserUpdate
from app.utils import hash_password, award_points, determine_badge, verify_password
from datetime import datetime, timedelta
from pydantic import BaseModel


router = APIRouter()

@router.post("/users", response_model=UserOut)
async def create_user(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    user_doc = {
        "username": user.username,
        "email": user.email,
        "password_hash": hashed_pw,
        "age": user.age,
        "gender": user.gender,
        "weight": user.weight,
        "total_points": 0,
        "points_history": [],
        "created_at": datetime.now(datetime.timezone.utc),
        "daily_streak": 0,
        "completed_7_day_streaks": 0,
        "last_claimed_date": None,
        "last_daily_points_claimed": None
    }
    result = await db.users.insert_one(user_doc)

    return UserOut(
        id=str(result.inserted_id),
        username=user.username,
        email=user.email,
        age=user.age,
        gender=user.gender,
        weight=user.weight,
        points=0,
        daily_streak=0,  
        completed_7_day_streaks=0,  
        last_claimed_date=None,  
        last_daily_points_claimed=None  
    )

@router.patch("/users/{user_id}")
async def update_user(user_id: str, user_update: UserUpdate):
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User updated successfully"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

@router.post("/users/{user_id}/claim-daily")
async def claim_daily_points(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    now = datetime.now(datetime.timezone.utc)
    last_claimed_date = user.get("last_claimed_date")
    daily_streak = user.get("daily_streak", 0)
    completed_streaks = user.get("completed_7_day_streaks", 0)

    # Check if already claimed today
    last_daily_claim = user.get("last_daily_points_claimed")
    if last_daily_claim:
        if isinstance(last_daily_claim, str):
            last_daily_claim = datetime.fromisoformat(last_daily_claim)

        if last_daily_claim.date() == now.date():
            raise HTTPException(status_code=400, detail="Already claimed daily points today")

    # Check streak logic
    if last_claimed_date:
        if isinstance(last_claimed_date, str):
            last_claimed_date = datetime.fromisoformat(last_claimed_date)

        yesterday = now.date() - timedelta(days=1)

        if last_claimed_date.date() == yesterday:
            daily_streak += 1  # Continue streak
        else:
            daily_streak = 1  # Reset streak
    else:
        daily_streak = 1

    # Base daily points
    await award_points(user_id, 5)

    # Bonus points if completed a 7-day streak
    bonus_message = ""
    if daily_streak % 7 == 0:
        completed_streaks += 1
        bonus_points = 5 * completed_streaks
        await award_points(user_id, bonus_points)
        bonus_message = f" You also earned {bonus_points} bonus points for a {daily_streak}-day streak!"

    # Update user record
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "last_daily_points_claimed": now,
                "last_claimed_date": now,
                "daily_streak": daily_streak,
                "completed_7_day_streaks": completed_streaks
            }
        }
    )

    return {"message": f"Daily points claimed!{bonus_message}"}

@router.get("/users/{user_id}/profile")
async def get_user_profile(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    badge = determine_badge(user.get("total_points", 0))

    return {
        "username": user["username"],
        "gender": user.get("gender"),
        "weight": user.get("weight"),
        "points": user.get("total_points", 0),
        "badge": badge
    }

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/users/login")
async def login_user(payload: LoginRequest):
    user = await db.users.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # If login is successful, return user basic info
    return {
        "id": str(user["_id"]),  # MongoDB ID
        "username": user["username"],
        "email": user["email"],
        "age": user.get("age"),
        "gender": user.get("gender"),
        "weight": user.get("weight"),
        "points": user.get("total_points", 0),
        "badge": determine_badge(user.get("total_points", 0)),
        "daily_streak": user.get("daily_streak", 0),
        "completed_7_day_streaks": user.get("completed_7_day_streaks", 0),
        "last_claimed_date": user.get("last_claimed_date"),
        "last_daily_points_claimed": user.get("last_daily_points_claimed")
    }