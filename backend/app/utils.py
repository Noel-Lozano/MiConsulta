from passlib.context import CryptContext
from datetime import datetime
from bson import ObjectId
from app.database import db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

async def award_points(user_id: str, points: int):
    now = datetime.now(datetime.timezone.utc)
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$inc": {"total_points": points},
            "$push": {"points_history": {"points": points, "timestamp": now}}
        }
    )

def determine_badge(points: int) -> str:
    if points >= 1000:
        return "Platinum"
    elif points >= 500:
        return "Gold"
    elif points >= 200:
        return "Silver"
    elif points >= 100:
        return "Bronze"
    else:
        return "Beginner"
