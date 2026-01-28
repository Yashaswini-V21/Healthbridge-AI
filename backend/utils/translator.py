"""Translation utilities for multi-language support"""

TRANSLATIONS = {
    'english': {
        'chest_pain': 'chest pain',
        'headache': 'headache',
        'fever': 'fever',
        'cough': 'cough',
        'breathing_difficulty': 'difficulty breathing'
    },
    'kannada': {
        'chest_pain': 'ಎದೆ ನೋವು',
        'headache': 'ತಲೆನೋವು',
        'fever': 'ಜ್ವರ',
        'cough': 'ಕೆಮ್ಮು',
        'breathing_difficulty': 'ಉಸಿರಾಟದ ತೊಂದರೆ'
    },
    'hindi': {
        'chest_pain': 'सीने में दर्द',
        'headache': 'सरदर्द',
        'fever': 'बुखार',
        'cough': 'खांसी',
        'breathing_difficulty': 'सांस लेने में कठिनाई'
    },
    'tamil': {
        'chest_pain': 'மார்பு வலி',
        'headache': 'தலைவலி',
        'fever': 'காய்ச்சல்',
        'cough': 'இருமல்',
        'breathing_difficulty': 'சுவாசிப்பதில் சிரமம்'
    }
}

def translate_text(text, from_lang='english', to_lang='kannada'):
    """
    Translate text between supported languages
    
    Args:
        text (str): Text to translate
        from_lang (str): Source language
        to_lang (str): Target language
    
    Returns:
        str: Translated text or original if not found
    """
    text_lower = text.lower().replace(' ', '_')
    
    # Find key in source language
    source_dict = TRANSLATIONS.get(from_lang, {})
    target_dict = TRANSLATIONS.get(to_lang, {})
    
    # Direct lookup
    if text_lower in source_dict.values():
        key = [k for k, v in source_dict.items() if v == text_lower]
        if key and key[0] in target_dict:
            return target_dict[key[0]]
    
    # Reverse lookup
    for key, value in source_dict.items():
        if value.lower() == text_lower:
            return target_dict.get(key, text)
    
    return text

def get_supported_languages():
    """Get list of supported languages"""
    return list(TRANSLATIONS.keys())

def detect_language(text):
    """
    Simple language detection based on character sets
    
    Args:
        text (str): Text to detect language
    
    Returns:
        str: Detected language code
    """
    # Kannada Unicode range
    if any('\u0C80' <= char <= '\u0CFF' for char in text):
        return 'kannada'
    
    # Devanagari (Hindi) Unicode range
    if any('\u0900' <= char <= '\u097F' for char in text):
        return 'hindi'
    
    # Tamil Unicode range
    if any('\u0B80' <= char <= '\u0BFF' for char in text):
        return 'tamil'
    
    # Default to English
    return 'english'
