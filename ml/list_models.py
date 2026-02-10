
import google.generativeai as genai
import os

genai.configure(api_key="AIzaSyCfFlpGMPRqXdbDRV54K4UVr0WJxT3yb4g")

print("Listing models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error listing models: {e}")
