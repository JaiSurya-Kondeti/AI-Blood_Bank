import json
import re

from services.bedrock_service import BedrockService

bedrock = BedrockService()


class HealthService:

    @staticmethod
    def analyze_donor_report(report_text: str):

        prompt = f"""
You are a blood donation medical screening assistant.

Analyze the donor report.

Report:
{report_text}

Return ONLY valid JSON.

{{
    "eligible": true,
    "risk_level": "LOW",
    "reason": "..."
}}
"""

        response = bedrock.ask(prompt)

        try:
            response = re.sub(
                r"```json|```",
                "",
                response
            ).strip()

            return json.loads(response)

        except Exception:

            return {
                "eligible": False,
                "risk_level": "UNKNOWN",
                "reason": response
            }