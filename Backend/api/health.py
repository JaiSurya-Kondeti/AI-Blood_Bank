from fastapi import APIRouter, UploadFile, File
from services.pdf_service import PDFService
from services.health_service import HealthService
import tempfile

router = APIRouter(
    prefix="/health",
    tags=["Health AI"]
)


@router.post("/analyze")
async def analyze_report(
    file: UploadFile = File(...)
):

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as temp:

        temp.write(await file.read())

        file_path = temp.name

    report_text = PDFService.extract_text(
        file_path
    )

    result = HealthService.analyze_donor_report(
        report_text
    )

    return result