from fastapi import APIRouter

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def admin_dashboard():
    """
    Admin dashboard summary
    """

    return {
        "total_patients": 120,
        "total_donors": 540,
        "active_requests": 25,
        "critical_requests": 5,
        "blood_banks": 12
    }


@router.get("/patients")
def get_all_patients():
    """
    Get all patients
    """

    return {
        "patients": []
    }


@router.get("/donors")
def get_all_donors():
    """
    Get all donors
    """

    return {
        "donors": []
    }


@router.get("/blood-requests")
def get_all_requests():
    """
    Get all blood requests
    """

    return {
        "requests": []
    }


@router.get("/predictions")
def get_predictions():
    """
    Get AI predictions
    """

    return {
        "predictions": []
    }


@router.get("/analytics")
def analytics():
    """
    Platform analytics
    """

    return {
        "monthly_donations": 250,
        "successful_matches": 220,
        "response_rate": "88%"
    }


@router.get("/health")
def system_health():
    """
    System health check
    """

    return {
        "status": "healthy",
        "database": "connected",
        "dynamodb": "active",
        "s3": "active"
    }