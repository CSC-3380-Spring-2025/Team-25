from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Allow your frontend (React / Next.js on localhost:3000) to access the backend
origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data to mock your gamified budgets
sample_budgets = [
    {
        "id": 1,
        "name": "Food",
        "amount": 300,
        "spent": 150,
        "points_earned": 50,
        "badge_unlocked": "Halfway Saver"
    },
    {
        "id": 2,
        "name": "Entertainment",
        "amount": 200,
        "spent": 80,
        "points_earned": 30,
        "badge_unlocked": None
    },
    {
        "id": 3,
        "name": "Savings",
        "amount": 500,
        "spent": 0,
        "points_earned": 100,
        "badge_unlocked": "Savings Star"
    }
]

# Root route - quick health check
@app.get("/")
async def read_root():
    return {"message": "Welcome to LevelUp Budget API!"}

# Get list of budgets (gamified data)
@app.get("/api/budgets")
async def get_budgets():
    return {"budgets": sample_budgets}

# Endpoint to get leaderboard (mocked)
@app.get("/api/leaderboard")
async def get_leaderboard():
    leaderboard = [
        {"username": "justin2flyy", "points": 500},
        {"username": "Brandon0706", "points": 450},
        {"username": "BellamyDev", "points": 400},
        {"username": "Phohou", "points": 350},
        {"username": "Kennadi718", "points": 300}
    ]
    return {"leaderboard": leaderboard}

# Example of future extension: get suggestions
@app.get("/api/suggestions")
async def get_suggestions():
    suggestions = [
        "You might want to review your streaming subscriptions.",
        "Consider increasing your savings goal by $50 this month!",
        "Your entertainment spending is below average this month — good job!"
    ]
    return {"suggestions": suggestions}


