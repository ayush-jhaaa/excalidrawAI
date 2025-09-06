import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

from rich import print_json
# Load API key
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Gemini client
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro",
    google_api_key=API_KEY,
    callbacks=[StreamingStdOutCallbackHandler()]
)

# 🔥 Build reusable context + prompt once
system_instruction = """
You are a excalidraw JSON generator bot. 
Rules:
- generate such that it can directly convert into excalidraw diagram
- Always output ONLY JSON (no explanations, no text outside).
- Use the provided schema strictly.
"""

format_rules = """
Schema:
{{
  "produced_elements": [
    {{ "type": "string", "name": "string", "connections": ["string"] }}
  ]
}}
"""

prompt_template = ChatPromptTemplate.from_messages([
    ("system", system_instruction),
    ("human", "{user_prompt}")
])

def generate_json(user_prompt: str):
    chain = prompt_template | llm
    response = chain.invoke({"user_prompt": user_prompt})
    return response.content  # should be JSON string

def node_1_generator(state: dict):
    # Call once
    prompt = "generate a simple linked list diagram"
    result = generate_json(prompt)
    
    # Store in state
    state["raw_diagram"] = result
    state['prompt'] = prompt
    print("node 1 running")
    return state

# Test run
if __name__ == "__main__":
    state = {}
    final_state = node_1_generator(state)
    print(final_state['raw_diagram'])
