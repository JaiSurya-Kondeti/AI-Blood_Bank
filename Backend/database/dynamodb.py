import boto3

dynamodb = boto3.resource(
    "dynamodb",
    region_name="ap-south-1"
)

patient_table = dynamodb.Table("PatientTable")

donor_table = dynamodb.Table("DonorTable")

request_table = dynamodb.Table("BloodRequestTable")