import uuid
from database.dynamodb import (
    patient_table,
    donor_table,
    request_table
)


class DynamoDBService:

    @staticmethod
    def create_patient(data):

        patient_id = str(uuid.uuid4())

        item = {
            "patient_id": patient_id,
            **data
        }

        patient_table.put_item(Item=item)

        return item

    @staticmethod
    def get_patients():

        response = patient_table.scan()

        return response.get("Items", [])

    @staticmethod
    def create_donor(data):

        donor_id = str(uuid.uuid4())

        item = {
            "donor_id": donor_id,
            **data
        }

        donor_table.put_item(Item=item)

        return item

    @staticmethod
    def get_donors():

        response = donor_table.scan()

        return response.get("Items", [])

    @staticmethod
    def get_requests():

        response = request_table.scan()

        return response.get("Items", [])