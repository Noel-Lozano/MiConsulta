from fastapi import APIRouter
from datetime import date, timedelta
from pydantic import BaseModel

class AnswerSubmission(BaseModel):
    user_id: str
    answer: str

router = APIRouter()

#questions ={date: [question, answer, options]} 
# sample questions for the month of April 2025
questions = {
    "2025-04-26": {
        "question": "What is the normal resting heart rate for a healthy adult?",
        "options": ["60-100 bpm", "40-60 bpm", "100-140 bpm", "30-50 bpm"],
        "answer": "60-100 bpm"
    },
    "2025-04-27": {
        "question": "Which vitamin is primarily produced when the human skin is exposed to sunlight?",
        "options": ["Vitamin A", "Vitamin B12", "Vitamin D", "Vitamin K"],
        "answer": "Vitamin D"
    },
    "2025-04-28": {
        "question": "Which of the following blood pressure readings is considered normal?",
        "options": ["150/100 mmHg", "90/60 mmHg", "120/80 mmHg", "140/90 mmHg"],
        "answer": "120/80 mmHg"
    },
    "2025-04-29": {
        "question": "Which organ is primarily responsible for detoxifying chemicals and metabolizing drugs?",
        "options": ["Kidney", "Liver", "Stomach", "Pancreas"],
        "answer": "Liver"
    },
    "2025-04-30": {
        "question": "What blood type is considered the universal donor?",
        "options": ["O-", "O+", "AB+", "AB-"],
        "answer": "O-"
    }

}
user_streaks = {}  # Ideally later: Supabase/Postgres


@router.get("/daily-question")
def get_daily_question():
    print("Accessing daily question")
    today = str(date.today())
    question_data = questions.get(today)
    if not question_data:
        return {"message": "No question for today yet."}
    return {
        "question": question_data["question"],
        "options": question_data["options"]
    }

@router.post("/submit-daily-answer")
def submit_daily_answer(submission: AnswerSubmission):
    today = str(date.today())
    correct_answer = questions.get(today, {}).get("answer")
    
    if not correct_answer:
        return {"correct": False, "message": "No question set for today."}
    
    # Now use submission.user_id and submission.answer
    user_id = submission.user_id
    answer = submission.answer

    # Handle streaks
    if user_id not in user_streaks:
        user_streaks[user_id] = {"last_date": None, "streak": 0}
    
    user_info = user_streaks[user_id]
    last_date = user_info["last_date"]

    print(answer, correct_answer)

    if answer == correct_answer:
        if last_date == str(date.today() - timedelta(days=1)):
            user_info["streak"] += 1
        else:
            user_info["streak"] = 1
        
        user_info["last_date"] = today
        return {"correct": True, "new_streak": user_info["streak"]}
    
    return {"correct": False, "streak": user_info["streak"]}