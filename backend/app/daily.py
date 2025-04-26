from fastapi import APIRouter, Depends
from datetime import date, timedelta

router = APIRouter()

# set of questions that will be chosen for daily questions {date:question}
questions ={}

# {user:strak}
temp_streak = {}

@router.get("/daily-question")
def get_daily_question():
    today = str(date.today())
    question_data = questions.get(today)
    if not question_data:
        return {"message": "No question for today yet."}
    return {
        "question": question_data["question"],
        "options": question_data["options"]
    }

@router.post("/submit-daily-answer")
def submit_daily_answer(user_id: str, answer: str):
    today = str(date.today())
    correct_answer = questions.get(today, {}).get("answer")
    
    if not correct_answer:
        return {"correct": False, "message": "No question set for today."}
    
    # Handle streaks
    if user_id not in temp_streak:
        temp_streak[user_id] = {"last_date": None, "streak": 0}
    
    user_info = temp_streak[user_id]
    last_date = user_info["last_date"]
    
    if answer == correct_answer:
        if last_date == str(date.today() - timedelta(days=1)):
            user_info["streak"] += 1
        else:
            user_info["streak"] = 1
        
        user_info["last_date"] = today
        return {"correct": True, "new_streak": user_info["streak"]}
    
    return {"correct": False, "streak": user_info["streak"]}