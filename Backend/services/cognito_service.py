import boto3
import os


cognito = boto3.client(
    "cognito-idp",
    region_name=os.getenv("AWS_REGION")
)


class CognitoService:

    @staticmethod
    def register_user(
        email,
        password
    ):

        response = cognito.sign_up(
            ClientId=os.getenv(
                "COGNITO_CLIENT_ID"
            ),
            Username=email,
            Password=password
        )

        return response

    @staticmethod
    def login_user(
        email,
        password
    ):

        response = cognito.initiate_auth(
            ClientId=os.getenv(
                "COGNITO_CLIENT_ID"
            ),
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": email,
                "PASSWORD": password
            }
        )

        return response