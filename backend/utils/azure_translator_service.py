"""
Azure Translator Service for Multilingual Support
Translates medical text between English and Kannada
"""

import os
import json
import logging
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

# Azure Translator API configuration
TRANSLATOR_ENDPOINT = "https://api.cognitive.microsofttranslator.com/translate"
API_VERSION = "3.0"


def get_translator_headers():
    """Get headers for Azure Translator API requests"""
    api_key = os.getenv('AZURE_TRANSLATOR_KEY')
    location = os.getenv('AZURE_TRANSLATOR_LOCATION', 'global')
    
    if not api_key:
        logger.error("Azure Translator key not found in environment variables")
        return None
    
    headers = {
        'Ocp-Apim-Subscription-Key': api_key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-Type': 'application/json'
    }
    
    return headers


def translate_to_kannada(text: str) -> str:
    """
    Translate English text to Kannada
    
    Args:
        text: English text to translate
        
    Returns:
        Translated Kannada text, or original text if translation fails
    """
    
    if not text or not text.strip():
        return text
    
    headers = get_translator_headers()
    if not headers:
        logger.warning("Translator headers not available, returning original text")
        return text
    
    try:
        params = {
            'api-version': API_VERSION,
            'from': 'en',
            'to': 'kn'
        }
        
        body = [{'text': text}]
        
        logger.info(f"Translating to Kannada: {text[:50]}...")
        
        response = requests.post(
            TRANSLATOR_ENDPOINT,
            params=params,
            headers=headers,
            json=body,
            timeout=10
        )
        
        response.raise_for_status()
        result = response.json()
        
        if result and len(result) > 0 and 'translations' in result[0]:
            translated = result[0]['translations'][0]['text']
            logger.info("Translation to Kannada successful")
            return translated
        else:
            logger.warning("No translation found in response")
            return text
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Translation request failed: {e}")
        return text
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return text


def translate_to_english(text: str) -> str:
    """
    Translate Kannada text to English
    
    Args:
        text: Kannada text to translate
        
    Returns:
        Translated English text, or original text if translation fails
    """
    
    if not text or not text.strip():
        return text
    
    headers = get_translator_headers()
    if not headers:
        logger.warning("Translator headers not available, returning original text")
        return text
    
    try:
        params = {
            'api-version': API_VERSION,
            'from': 'kn',
            'to': 'en'
        }
        
        body = [{'text': text}]
        
        logger.info(f"Translating to English: {text[:50]}...")
        
        response = requests.post(
            TRANSLATOR_ENDPOINT,
            params=params,
            headers=headers,
            json=body,
            timeout=10
        )
        
        response.raise_for_status()
        result = response.json()
        
        if result and len(result) > 0 and 'translations' in result[0]:
            translated = result[0]['translations'][0]['text']
            logger.info("Translation to English successful")
            return translated
        else:
            logger.warning("No translation found in response")
            return text
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Translation request failed: {e}")
        return text
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return text


def translate_list(items: list, target_language: str) -> list:
    """
    Translate a list of strings
    
    Args:
        items: List of strings to translate
        target_language: 'kn' for Kannada or 'en' for English
        
    Returns:
        List of translated strings
    """
    
    if not items:
        return items
    
    translate_func = translate_to_kannada if target_language == 'kn' else translate_to_english
    
    try:
        translated = []
        for item in items:
            if isinstance(item, str):
                translated.append(translate_func(item))
            else:
                translated.append(item)
        return translated
    except Exception as e:
        logger.error(f"List translation error: {e}")
        return items


def test_translator_connection():
    """Test Azure Translator connection"""
    try:
        headers = get_translator_headers()
        if not headers:
            return False, "Failed to get translator headers"
        
        # Simple test translation
        result = translate_to_kannada("Hello")
        
        if result and result != "Hello":
            return True, f"Translator working: 'Hello' → '{result}'"
        else:
            return False, "Translation test failed"
            
    except Exception as e:
        return False, f"Connection test failed: {str(e)}"
