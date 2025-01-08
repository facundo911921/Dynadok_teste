import os
from langchain_openai import OpenAI


class LLMService:
    def __init__(self):
        # Aqui assumimos que há uma variável de ambiente HF_TOKEN configurada.
        self.llm = OpenAI(
            temperature=0.5,
            top_p=0.7,
            api_key=os.getenv("HF_TOKEN"),  # type: ignore
            base_url="https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1",
        )

    def summarize_text(self, text: str, lang: str) -> str:
        # prompt = f"traduza resumidamente para a língua {lang}: {text}. Escreva apenas na língua traduzida."
        prompt = f"traduza para a língua {lang}: {text}. Escreva apenas na língua traduzida e resuma o texto o máximo possível sem perder o sentido principal."

        response = self.llm.invoke(prompt)
        # print(response, type(response))
        return response