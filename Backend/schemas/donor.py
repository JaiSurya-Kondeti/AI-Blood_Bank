from pydantic import BaseModel


class DonorCreate(BaseModel):
    name: str
    blood_group: str
    city: str
    last_donation_date: str