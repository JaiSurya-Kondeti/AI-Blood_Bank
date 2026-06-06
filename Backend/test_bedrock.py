from services.bedrock_service import BedrockService

bedrock = BedrockService()

print(
    bedrock.ask(
        "Explain thalassemia in 2 lines"
    )
)