import os
from motor.motor_asyncio import AsyncIOMotorClient

mongo_uri = os.getenv("MONGO_URI")
mongo_db_name = os.getenv("MONGO_DB_NAME")

client = AsyncIOMotorClient(mongo_uri)
db = client[mongo_db_name]