from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime 

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    age: Optional[int] = None
    gender: Optional[str] = None
    weight: Optional[float] = None

class UserUpdate(BaseModel):
    gender: Optional[str] = None
    weight: Optional[float] = None

class UserOut(BaseModel):
    id: str
    username: str
    email: EmailStr
    age: Optional[int]
    gender: Optional[str]
    weight: Optional[float]
    points: int
    daily_streak: Optional[int] = 0
    completed_7_day_streaks: Optional[int] = 0
    last_claimed_date: Optional[datetime] = None
    last_daily_points_claimed: Optional[datetime] = None