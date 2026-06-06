from fastapi import APIRouter
from schemas.patient import PatientCreate

router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


@router.post("/")
def create_patient(
    payload: PatientCreate
):
    return {
        "message": "Patient Created",
        "patient": payload
    }


@router.get("/")
def get_patients():
    return {
        "patients": []
    }