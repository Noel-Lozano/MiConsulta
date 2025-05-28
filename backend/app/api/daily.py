import os
import json
from datetime import date
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import HTTPException
from datetime import datetime, timezone, timedelta
import google.generativeai as genai

load_dotenv()

router = APIRouter()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Cache to store user questions for each day
user_daily_questions = {}

class UserRequest(BaseModel):
    user_id: str

@router.get("/daily-question/genai")
async def get_genai_daily_question(user_id: str):
    today = str(date.today())

    # Return cached question if already generated
    if user_id in user_daily_questions and today in user_daily_questions[user_id]:
        return user_daily_questions[user_id][today]

    try:
        model = genai.GenerativeModel('gemini-2.0-flash-001')

        prompt = (
            "Generate a JSON-formatted multiple choice question for a teen about health, nutrition, or first aid. "
            "Return only this format:\n"
            "{\n"
            "  \"question\": \"...\",\n"
            "  \"options\": [\"A\", \"B\", \"C\", \"D\"],\n"
            "  \"answer\": \"...correct option...\"\n"
            "}"
        )

        response = model.generate_content(prompt)
        ai_text = response.candidates[0].content.parts[0].text

        # JSON parsing try/except block
        try:
            start = ai_text.find("{")
            end = ai_text.rfind("}") + 1
            json_str = ai_text[start:end]
            question_json = json.loads(json_str)
        except Exception as parse_err:
            return {
                "error": "❌ Could not parse JSON from Gemini output.",
                "raw": ai_text,
                "details": str(parse_err)
            }

        # Save the generated question for the user
        if user_id not in user_daily_questions:
            user_daily_questions[user_id] = {}
        user_daily_questions[user_id][today] = question_json

        return question_json

    except Exception as e:
        return {"error": f"❌ Gemini error: {str(e)}"}
    
user_streaks = {}

class AnswerSubmission(BaseModel):
    user_id: str
    answer: str

@router.post("/daily/submit-daily-answer")
async def submit_daily_answer(submission: AnswerSubmission):
    today = str(date.today())
    user_id = submission.user_id
    answer = submission.answer

    # Ensure the user received a question today
    if user_id not in user_daily_questions or today not in user_daily_questions[user_id]:
        raise HTTPException(status_code=400, detail="No question assigned today.")

    # Retrieve correct answer
    correct_answer = user_daily_questions[user_id][today].get("answer")
    if correct_answer is None:
        raise HTTPException(status_code=500, detail="Answer key missing for today's question.")

    # Initialize user streak record if needed
    if user_id not in user_streaks:
        user_streaks[user_id] = {"last_date": None, "streak": 0}

    user_info = user_streaks[user_id]
    last_date = user_info["last_date"]

    # Check correctness and update streak
    if answer.strip().lower() == correct_answer.strip().lower():
        if last_date == str(date.today() - timedelta(days=1)):
            user_info["streak"] += 1
        else:
            user_info["streak"] = 1
        user_info["last_date"] = today
        return {"correct": True, "new_streak": user_info["streak"]}

    return {"correct": False, "streak": user_info["streak"]}