from fastapi import APIRouter, HTTPException
from app.database import db
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/rewards/claim-daily")
async def claim_daily_reward(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    now = datetime.now(datetime.timezone.utc)
    last_claimed = user.get("last_daily_points_claimed")

    if last_claimed:
        if isinstance(last_claimed, str):
            last_claimed = datetime.fromisoformat(last_claimed)

        if last_claimed.date() == now.date():
            raise HTTPException(status_code=400, detail="Already claimed today")

    points_awarded = 10

    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$inc": {"total_points": points_awarded},
            "$set": {"last_daily_points_claimed": now}
        }
    )

    return {"message": f"You claimed {points_awarded} points for today!"}