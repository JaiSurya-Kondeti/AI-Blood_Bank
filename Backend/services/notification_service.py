import boto3

sns = boto3.client(
    "sns"
)


class NotificationService:

    @staticmethod
    def send_sms(
        phone,
        message
    ):

        sns.publish(
            PhoneNumber=phone,
            Message=message
        )

        return {
            "status": "sent"
        }