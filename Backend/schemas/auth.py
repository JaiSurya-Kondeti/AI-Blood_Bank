from pydantic import BaseModel
from typing import Literal


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Literal[
        "patient",
        "donor",
        "bloodbank"
    ]


class LoginRequest(BaseModel):
    email: str
    password: str