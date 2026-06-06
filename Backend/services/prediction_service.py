class PredictionService:

    @staticmethod
    def predict_next_transfusion(
        patient_data
    ):

        hb_level = patient_data.get(
            "hb_level",
            10
        )

        if hb_level < 8:
            urgency = "HIGH"
            days = 3

        elif hb_level < 10:
            urgency = "MEDIUM"
            days = 7

        else:
            urgency = "LOW"
            days = 15

        return {
            "urgency": urgency,
            "predicted_days": days
        }