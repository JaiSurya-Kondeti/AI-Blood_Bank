from fastapi import APIRouter

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)


@router.get("/{patient_id}")
def predict(
    patient_id: str
):
    return {
        "patient_id": patient_id,
        "blood_needed_in_days": 5,
        "urgency": "HIGH"
    }