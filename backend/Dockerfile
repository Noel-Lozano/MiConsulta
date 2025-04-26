# Use an official Python image
FROM python:alpine

# Set working directory inside the container
WORKDIR /app

# Install any needed dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your code
COPY . .

# Expose the port (change if your backend runs on another port)
EXPOSE 8000

# Run your app (you might need to change this depending if you use Flask, FastAPI, etc.)
CMD ["python", "app.py"]
