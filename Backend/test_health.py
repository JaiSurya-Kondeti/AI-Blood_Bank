from services.health_service import HealthService

report = """
Hemoglobin: 13.5
No medication
No chronic disease
Not pregnant
"""

result = HealthService.analyze_donor_report(
    report
)

print(result)