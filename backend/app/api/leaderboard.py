
from fastapi import APIRouter, HTTPException
from app.database import db
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/leaderboard/daily")
async def leaderboard_daily():
    now = datetime.now(datetime.timezone.utc)
    start_of_day = datetime(now.year, now.month, now.day)

    users = []
    cursor = db.users.find()
    async for user in cursor:
        daily_points = sum(
            p["points"] for p in user.get("points_history", [])
            if "timestamp" in p and start_of_day <= p["timestamp"] <= now
        )
        users.append({
            "username": user["username"],
            "daily_points": daily_points
        })

    users = sorted(users, key=lambda x: x["daily_points"], reverse=True)[:10]
    return users

@router.get("/leaderboard/weekly")
async def leaderboard_weekly():
    now = datetime.now(datetime.timezone.utc)
    start_of_week = now - timedelta(days=now.weekday())

    users = []
    cursor = db.users.find()
    async for user in cursor:
        weekly_points = sum(
            p["points"] for p in user.get("points_history", [])
            if "timestamp" in p and start_of_week <= p["timestamp"] <= now
        )
        users.append({
            "username": user["username"],
            "weekly_points": weekly_points
        })

    users = sorted(users, key=lambda x: x["weekly_points"], reverse=True)[:10]
    return users

@router.get("/leaderboard/monthly")
async def leaderboard_monthly():
    now = datetime.now()
    start_of_month = datetime(now.year, now.month, 1)

    users = []
    cursor = db.users.find()
    async for user in cursor:
        monthly_points = sum(
            p["points"] for p in user.get("points_history", [])
            if "timestamp" in p and start_of_month <= p["timestamp"] <= now
        )
        users.append({
            "username": user["username"],
            "monthly_points": monthly_points
        })

    users = sorted(users, key=lambda x: x["monthly_points"], reverse=True)[:10]
    return users

@router.get("/leaderboard/alltime")
async def leaderboard_alltime():
    users_cursor = db.users.find().sort("total_points", -1).limit(10)
    leaderboard = []
    async for user in users_cursor:
        leaderboard.append({
            "username": user["username"],
            "total_points": user["total_points"]
        })
    return leaderboard
