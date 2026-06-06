from fastapi import APIRouter
from schemas.donor import DonorCreate

router = APIRouter(
    prefix="/donors",
    tags=["Donors"]
)


@router.post("/")
def create_donor(
    payload: DonorCreate
):
    return {
        "message": "Donor Created",
        "donor": payload
    }


@router.get("/")
def get_donors():
    return {
        "donors": []
    }