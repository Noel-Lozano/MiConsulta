from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.ask import router as ask_router
from app.api.user import router as user_router 
from app.api.leaderboard import router as leaderboard_router
from app.api.daily import router as daily_router
from app.api.rewards import router as rewards_router
from app.api.auth import router as auth_router

from app.database import db

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import Request

# Load environment variables from .env before anything else
load_dotenv()

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content=jsonable_encoder({"detail": exc.errors()}),
    )

# Allow CORS (good for frontend-backend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Basic health check
@app.get("/ping")
async def ping():
    return {"message": "pong"}

# MongoDB debug route
@app.get("/test-db")
async def test_db():
    try:
        collections = await db.list_collection_names()
        return {"collections": collections}
    except Exception as e:
        return {"error": str(e)}

# Include all routers
app.include_router(ask_router)
app.include_router(user_router)  
app.include_router(leaderboard_router, prefix="/leaderboard")
app.include_router(daily_router, prefix="/daily")
app.include_router(rewards_router, prefix="/rewards")
app.include_router(auth_router, prefix="/auth")
