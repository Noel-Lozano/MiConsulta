import os
from motor.motor_asyncio import AsyncIOMotorClient

mongo_url = os.getenv("MONGO_URL")
mongo_db_name = os.getenv("MONGO_DB_NAME")

client = AsyncIOMotorClient(mongo_url)
db = client[mongo_db_name]