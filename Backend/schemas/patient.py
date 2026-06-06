from pydantic import BaseModel


class PatientCreate(BaseModel):
    name: str
    blood_group: str
    hb_level: float
    city: str