from fastapi import FastAPI
from pydantic import BaseModel
from prediction import predict_transaction

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Fraud Detection AI Service Running"}

@app.post("/predict")
def predict(transaction: dict):
    result = predict_transaction(transaction)
    return result