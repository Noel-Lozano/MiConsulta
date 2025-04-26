from fastapi import APIRouter, Depends
from datetime import date

router = APIRouter()

# set of questions that will be chosen for daily questions {date:question}
questions ={}

# {user:strak}
temp_streak = {}

@router.get("/daily-question")
def get_daily_question():
    today = str(date.today())
    question_data = questions.get(today)
    if question_data:
        return {"question": question_data["questions"], 
                "options" : question_data["options"]}
    else:
        return {"message": "No question available for today."}
    
@router.post("/submit-daily-answer")
def submit_daily_answer(username:str, answer:str):
    today = str(date.tpday())
    correct_answer = questions.get(today, {}).get("answer")