from fastapi import APIRouter
from schemas.auth import (
    RegisterRequest,
    LoginRequest
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register_user(
    payload: RegisterRequest
):
    return {
        "message": "User Registered",
        "data": payload
    }


@router.post("/login")
def login_user(
    payload: LoginRequest
):
    return {
        "message": "Login Success"
    }