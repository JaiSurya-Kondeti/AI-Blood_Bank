import boto3
import json


class BedrockService:

    def __init__(self):

        self.client = boto3.client(
            "bedrock-runtime",
            region_name="us-east-1"
        )

    def ask(self, prompt):

        body = {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }

        response = self.client.invoke_model(
            modelId="amazon.nova-lite-v1:0",
            body=json.dumps(body)
        )

        result = json.loads(
            response["body"].read()
        )

        return result["output"]["message"]["content"][0]["text"]