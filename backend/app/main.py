from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.ask import router as ask_router
from app.api.user import router as user_router 
from app.api.leaderboard import router as leaderboard_router
from app.daily import router as daily_router
from app.api.rewards import router as rewards_router
from app.api.auth import router as auth_router



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
async def ping():
    return {"message": "pong"}

app.include_router(ask_router)
app.include_router(user_router)  
app.include_router(leaderboard_router, prefix="/leaderboard")
app.include_router(daily_router, prefix="/daily")
app.include_router(rewards_router, prefix="/rewards")
app.include_router(auth_router, prefix="/auth")