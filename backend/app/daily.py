from fastapi import APIRouter, Depends
from datetime import date

router = APIRouter()

# set of questions that will be chosen for daily questions {date:question}
questions ={}

# {user:strak}
temp_streak = {}

@router.get("/daily-question")