from fastapi import FastAPI
from pydantic import BaseModel
from prediction import predict_transaction

app = FastAPI()

class Transaction(BaseModel):
    data: dict

@app.get("/")
def home():
    return {"message": "Fraud Detection AI Service Running"}

@app.post("/predict")
def predict(transaction: Transaction):

    result = predict_transaction(transaction.data)

    return result