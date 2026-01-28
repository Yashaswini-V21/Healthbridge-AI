"""
Azure OpenAI Service for Medical Symptom Analysis
Uses Azure OpenAI GPT models for intelligent symptom triage
"""

import os
import json
import logging
from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

# Initialize Azure OpenAI client
def get_azure_openai_client():
    """Initialize and return Azure OpenAI client"""
    api_key = os.getenv('AZURE_OPENAI_KEY')
    endpoint = os.getenv('AZURE_OPENAI_ENDPOINT')
    
    if not api_key or not endpoint:
        logger.error("Azure OpenAI credentials not found in environment variables")
        return None
    
    try:
        client = AzureOpenAI(
            api_key=api_key,
            api_version="2023-05-15",
            azure_endpoint=endpoint
        )
        return client
    except Exception as e:
        logger.error(f"Failed to initialize Azure OpenAI client: {e}")
        return None


def analyze_symptoms_with_azure_ai(symptoms_text: str) -> dict:
    """
    Analyze medical symptoms using Azure OpenAI
    
    Args:
        symptoms_text: Patient's symptom description
        
    Returns:
        dict with urgency, specialties, and explanation
        None if analysis fails
    """
    
    client = get_azure_openai_client()
    if not client:
        logger.warning("Azure OpenAI client not available, falling back to rule-based")
        return None
    
    deployment_name = os.getenv('AZURE_OPENAI_DEPLOYMENT', 'gpt-4o-mini')
    
    system_message = """You are a medical triage assistant. Analyze the symptoms and provide:
1) Urgency level (HIGH, MEDIUM, or LOW)
2) List of 2-3 recommended medical specialties
3) Brief 2-sentence explanation

Format response as JSON with keys: urgency, specialties (array), explanation

Urgency guidelines:
- HIGH: Life-threatening, severe pain, major trauma, breathing issues
- MEDIUM: Moderate symptoms, non-emergency but needs attention
- LOW: Minor issues, can wait for regular appointment"""
    
    try:
        logger.info(f"Analyzing symptoms with Azure OpenAI: {symptoms_text[:50]}...")
        
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": f"Patient symptoms: {symptoms_text}"}
            ],
            temperature=0.3,
            max_tokens=500,
            response_format={"type": "json_object"}
        )
        
        # Parse response
        result_text = response.choices[0].message.content
        result = json.loads(result_text)
        
        # Validate response structure
        if not all(key in result for key in ['urgency', 'specialties', 'explanation']):
            logger.error("Invalid response structure from Azure OpenAI")
            return None
        
        # Ensure urgency is uppercase
        result['urgency'] = result['urgency'].upper()
        
        # Validate urgency level
        if result['urgency'] not in ['HIGH', 'MEDIUM', 'LOW']:
            logger.warning(f"Invalid urgency level: {result['urgency']}, defaulting to MEDIUM")
            result['urgency'] = 'MEDIUM'
        
        logger.info(f"Azure OpenAI analysis successful: Urgency={result['urgency']}")
        return result
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON response from Azure OpenAI: {e}")
        return None
    except Exception as e:
        logger.error(f"Azure OpenAI analysis failed: {e}")
        return None


def test_azure_openai_connection():
    """Test Azure OpenAI connection and configuration"""
    try:
        client = get_azure_openai_client()
        if not client:
            return False, "Failed to initialize client"
        
        deployment = os.getenv('AZURE_OPENAI_DEPLOYMENT', 'gpt-4o-mini')
        
        # Simple test query
        response = client.chat.completions.create(
            model=deployment,
            messages=[{"role": "user", "content": "Say 'Hello'"}],
            max_tokens=10
        )
        
        if response.choices[0].message.content:
            return True, "Azure OpenAI connection successful"
        else:
            return False, "No response from Azure OpenAI"
            
    except Exception as e:
        return False, f"Connection test failed: {str(e)}"


def get_health_advice(message: str, conversation_history: list = None, system_prompt: str = None) -> str:
    """
    Get health advice from Azure OpenAI for chatbot
    
    Args:
        message: User's health question
        conversation_history: Previous messages for context
        system_prompt: Custom system instructions
        
    Returns:
        AI generated health advice
    """
    client = get_azure_openai_client()
    if not client:
        return "Sorry, I'm currently unable to process your request. Please try again later."
    
    try:
        deployment = os.getenv('AZURE_OPENAI_DEPLOYMENT', 'gpt-4o-mini')
        
        # Build messages
        messages = []
        
        # Add system prompt
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        else:
            messages.append({
                "role": "system",
                "content": "You are a helpful medical assistant. Provide brief, empathetic health advice. Always remind users to consult real doctors for serious concerns."
            })
        
        # Add conversation history
        if conversation_history:
            messages.extend(conversation_history)
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        logger.info(f"Sending chat request to Azure OpenAI - Messages: {len(messages)}")
        
        response = client.chat.completions.create(
            model=deployment,
            messages=messages,
            max_tokens=300,
            temperature=0.7,
            top_p=0.95
        )
        
        advice = response.choices[0].message.content.strip()
        logger.info(f"Azure OpenAI chat response received: {len(advice)} chars")
        
        return advice
        
    except Exception as e:
        logger.error(f"Azure OpenAI chat failed: {e}")
        return "I apologize, but I'm having trouble processing your request right now. Please try again or consult a healthcare professional."

