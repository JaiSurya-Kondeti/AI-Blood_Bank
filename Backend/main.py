from fastapi import FastAPI

from api.auth import router as auth_router
from api.patient import router as patient_router
from api.donor import router as donor_router

app = FastAPI(
    title="AI Predictive Blood Crisis Prevention System",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(patient_router)
app.include_router(donor_router)


@app.get("/")
def root():
    return {
        "message": "AI Backend Running"
    }