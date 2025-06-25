# /path/to/your/backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Define the list of origins that are allowed to make requests to this API.
# In development, this would be your Next.js frontend.
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    return {"message": "Hello from the FastAPI backend!"}

# A simple route to get a list of budgets (as an example)
@app.get("/api/budgets")
async def get_budgets():
    # In a real application, you would fetch this data from a database.
    # For now, we'll just return some sample data.
    sample_budgets = [
        {"id": 1, "name": "Monthly Groceries", "targetAmount": 500},
        {"id": 2, "name": "Uticlities", "targetAmount": 150},
    ]
    return sample_budgets
