from database.dynamodb import (
    patient_table,
    donor_table,
    request_table
)


class AdminService:

    @staticmethod
    def dashboard():

        patients = patient_table.scan()

        donors = donor_table.scan()

        requests = request_table.scan()

        return {
            "patients":
                len(
                    patients.get(
                        "Items",
                        []
                    )
                ),

            "donors":
                len(
                    donors.get(
                        "Items",
                        []
                    )
                ),

            "requests":
                len(
                    requests.get(
                        "Items",
                        []
                    )
                )
        }