"""
AI Doctor Chat Routes
Azure OpenAI powered health assistant with multilingual support
"""
from flask import Blueprint, request, jsonify
from utils.azure_openai_service import get_health_advice
from utils.azure_translator_service import translate_to_kannada, translate_to_english
import logging

logger = logging.getLogger(__name__)

chat_bp = Blueprint('chat', __name__)


def get_fallback_response(message: str) -> str:
    """Fallback responses when Azure OpenAI is unavailable"""
    message_lower = message.lower()
    
    # Greetings
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'hii', 'helo']):
        return "Hello! 👋 I'm your AI Health Assistant. I can help you with:\n• Understanding symptoms\n• General health advice\n• When to see a doctor\n• Basic first aid\n\nWhat's concerning you today?"
    
    # Kannada language request
    elif any(word in message_lower for word in ['kannada', 'kannaad', 'ಕನ್ನಡ', 'kannda']):
        return "Sure! I can help you in Kannada. Please switch the language using the language toggle (🌐 button) in the top header. After switching, I'll automatically respond in Kannada. How can I assist you?"
    
    # Headache
    elif any(word in message_lower for word in ['headache', 'head pain', 'migraine', 'head ache']):
        return "**Headache Relief:**\n• Rest in a quiet, dark room\n• Drink plenty of water (dehydration is a common cause)\n• Apply cold compress to forehead\n• Avoid screens and bright lights\n• Try gentle neck stretches\n\n⚠️ **See a doctor if:**\n- Severe sudden headache (worst ever)\n- Headache with fever, stiff neck, or confusion\n- Persistent headaches (>3 days)\n- Headaches that wake you from sleep"
    
    # Fever
    elif any(word in message_lower for word in ['fever', 'temperature', 'hot', 'burning']):
        return "**Fever Care:**\n• Rest and stay hydrated (water, ORS, clear fluids)\n• Take temperature regularly\n• Light clothing and cool room\n• Lukewarm sponge bath if needed\n• Paracetamol can help (follow dosage)\n\n⚠️ **Seek immediate medical help if:**\n- Fever >101°F (38.3°C) for >3 days\n- Fever with severe headache or rash\n- Difficulty breathing\n- Confusion or drowsiness\n- Infants <3 months with any fever"
    
    # Cold/Cough/Flu
    elif any(word in message_lower for word in ['cough', 'cold', 'flu', 'runny nose', 'sneez', 'congestion']):
        return "**Cold & Cough Relief:**\n• Rest adequately (7-8 hours sleep)\n• Drink warm fluids (tea, soup, warm water)\n• Steam inhalation 2-3 times daily\n• Gargle with warm salt water\n• Honey (1 tsp) can soothe throat\n• Stay warm and avoid cold drinks\n\n⚠️ **Consult doctor if:**\n- Symptoms worsen after 7-10 days\n- Difficulty breathing or chest pain\n- High fever (>101°F)\n- Coughing up blood or green/yellow mucus"
    
    # Stomach/Digestive issues
    elif any(word in message_lower for word in ['stomach', 'belly', 'tummy', 'pain', 'ache', 'digest', 'nausea', 'vomit', 'diarrhea']):
        return "**Stomach Issues:**\n• Eat light, bland foods (rice, banana, toast)\n• Stay hydrated with ORS or clear fluids\n• Avoid spicy, oily, and dairy foods\n• Ginger or mint tea can help nausea\n• Rest and lie on your left side\n\n⚠️ **Urgent care needed if:**\n- Severe, persistent pain (>6 hours)\n- Blood in stool or vomit\n- Unable to keep fluids down\n- Signs of dehydration (dark urine, dizziness)\n- Fever with abdominal pain"
    
    # Fatigue/Tiredness
    elif any(word in message_lower for word in ['tired', 'fatigue', 'weak', 'energy', 'exhaust', 'sleepy']):
        return "**Boost Your Energy:**\n• **Sleep:** 7-8 hours nightly, consistent schedule\n• **Hydration:** 8-10 glasses of water daily\n• **Nutrition:** Balanced meals with protein, fruits, vegetables\n• **Exercise:** 30 min daily walk boosts energy\n• **Iron-rich foods:** Spinach, dates, jaggery, eggs\n• **Stress management:** Meditation, deep breathing\n\n⚠️ **See doctor if:**\n- Persistent fatigue despite good sleep\n- Sudden unexplained weakness\n- Fatigue with weight loss or fever\n- May need tests for anemia, thyroid, vitamin deficiency"
    
    # Chest pain
    elif any(word in message_lower for word in ['chest pain', 'chest', 'heart']):
        return "⚠️ **CHEST PAIN IS SERIOUS!**\n\n🚨 **Call 108 IMMEDIATELY if:**\n- Crushing/squeezing chest pain\n- Pain spreading to arm, jaw, or back\n- Shortness of breath\n- Sweating, nausea, dizziness\n- Could be heart attack!\n\n**For mild chest discomfort:**\n- Avoid exertion and rest\n- Monitor symptoms closely\n- See doctor today for evaluation\n- Don't ignore chest pain!"
    
    # Breathing difficulty
    elif any(word in message_lower for word in ['breath', 'breathing', 'asthma', 'wheez']):
        return "🚨 **BREATHING DIFFICULTY - URGENT!**\n\n**Call 108 or go to ER if:**\n- Severe difficulty breathing\n- Blue lips or fingernails\n- Unable to speak full sentences\n- Chest tightness\n\n**For mild breathlessness:**\n- Sit upright, don't lie down\n- Stay calm, breathe slowly\n- Open windows for fresh air\n- Use inhaler if prescribed\n- See doctor if not improving"
    
    # Diabetes
    elif any(word in message_lower for word in ['diabetes', 'sugar', 'diabetic', 'insulin']):
        return "**Diabetes Management:**\n• Monitor blood sugar regularly\n• Balanced diet (avoid refined sugar, white rice)\n• Regular exercise (30 min walking)\n• Take medications as prescribed\n• Stay hydrated\n• Regular doctor checkups\n• Check feet daily for cuts\n\n**Good foods:** Vegetables, whole grains, lean protein, nuts\n**Avoid:** Sweets, sugary drinks, fried foods, white bread"
    
    # Blood pressure
    elif any(word in message_lower for word in ['blood pressure', 'bp', 'hypertension']):
        return "**Managing Blood Pressure:**\n• **Reduce salt** (avoid pickles, chips, processed foods)\n• **Exercise:** 30 minutes daily\n• **Weight:** Maintain healthy weight\n• **DASH diet:** Fruits, vegetables, whole grains\n• **Stress:** Practice relaxation techniques\n• **Limit alcohol** and quit smoking\n• **Monitor:** Check BP regularly\n• **Medication:** Take as prescribed\n\nTarget: <120/80 mmHg"
    
    # General health
    elif any(word in message_lower for word in ['health', 'healthy', 'wellness', 'fit']):
        return "**Stay Healthy:**\n✅ **Sleep:** 7-8 hours nightly\n✅ **Exercise:** 30 min daily activity\n✅ **Nutrition:** Balanced diet, fruits, vegetables\n✅ **Hydration:** 8-10 glasses water\n✅ **Mental health:** Manage stress, stay connected\n✅ **Check-ups:** Annual health screenings\n✅ **Hygiene:** Regular handwashing\n✅ **Avoid:** Smoking, excessive alcohol\n\nSmall daily habits create big health benefits!"
    
    # Emergency
    elif any(word in message_lower for word in ['emergency', 'urgent', '108', 'ambulance', 'serious']):
        return "🚨 **FOR EMERGENCIES:**\n\n📞 **Call 108** (India Emergency Number)\n\n**When to call:**\n• Severe chest pain or difficulty breathing\n• Unconsciousness or confusion\n• Severe bleeding\n• Suspected heart attack or stroke\n• Severe allergic reaction\n• Poisoning\n• Major injury\n\n⏱️ **Time is critical - don't delay!**"
    
    # Medicine/Medication
    elif any(word in message_lower for word in ['medicine', 'medication', 'drug', 'tablet', 'pill']):
        return "**Medication Safety:**\n• ⚠️ **Never self-prescribe** - see a doctor\n• Take as prescribed (dose, timing)\n• Complete full course (antibiotics)\n• Don't share medications\n• Store properly (cool, dry place)\n• Check expiry dates\n• Inform doctor of all medications\n• Report side effects\n\n**Common OTC:**\n• Paracetamol - fever/pain (500mg max 4x/day)\n• ORS - dehydration\n• Antacids - acidity\n\nConsult doctor before any medication!"
    
    else:
        return "I'm here to help with your health questions! You can ask me about:\n\n🤒 **Symptoms:** Fever, headache, cough, stomach issues\n💊 **Conditions:** Diabetes, blood pressure, general health\n🚨 **When to see a doctor** or call emergency services\n🏥 **Self-care tips** and home remedies\n\nWhat would you like to know? (For emergencies, call 108)"


@chat_bp.route('/doctor', methods=['POST'])
def doctor_chat():
    """
    AI Doctor chatbot endpoint
    Supports English and Kannada responses
    """
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        language = data.get('language', 'english')
        conversation_history = data.get('conversation_history', [])
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        logger.info(f"AI Doctor request - Language: {language}, Message: {message[:50]}...")
        
        # Build conversation context
        context_messages = []
        for msg in conversation_history[-3:]:  # Last 3 messages for context
            context_messages.append({
                'role': msg.get('role', 'user'),
                'content': msg.get('content', '')
            })
        
        # System prompt for medical assistant
        system_prompt = """You are MediConnect AI Doctor, a helpful and empathetic medical assistant. 
You provide accurate health information, symptom guidance, and general medical advice.

IMPORTANT GUIDELINES:
- Be warm, empathetic, and professional
- Provide clear, easy-to-understand medical information
- Always remind users to consult a real doctor for serious concerns
- Never diagnose or prescribe medication
- For emergencies, always advise calling emergency services (108 in India)
- Keep responses concise (2-4 sentences) and actionable
- Use simple language, avoid complex medical jargon
- Be culturally sensitive for Indian patients

Example responses:
- "Based on your symptoms, it could be a common cold. Rest, stay hydrated, and monitor your temperature. If symptoms worsen or persist beyond 3 days, please consult a doctor."
- "Headaches can have many causes. Try drinking water, resting in a dark room, and avoiding screens. If severe or recurring, see a doctor for proper evaluation."
"""

        # Get AI response
        try:
            response = get_health_advice(
                message=message,
                conversation_history=context_messages,
                system_prompt=system_prompt
            )
        except Exception as e:
            logger.error(f"Azure OpenAI failed, using fallback: {str(e)}")
            # Fallback responses
            response = get_fallback_response(message)
        
        # Translate to Kannada if needed
        response_kn = None
        if language == 'kannada':
            try:
                response_kn = translate_to_kannada(response)
            except Exception as e:
                logger.warning(f"Kannada translation failed: {str(e)}")
                response_kn = response  # Fallback to English
        else:
            response_kn = response
        
        return jsonify({
            'success': True,
            'response': response,
            'response_kn': response_kn,
            'language': language
        })
    
    except Exception as e:
        logger.error(f"AI Doctor chat error: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Failed to process your message',
            'details': str(e)
        }), 500


@chat_bp.route('/quick-advice', methods=['POST'])
def quick_advice():
    """
    Quick health advice for common symptoms
    """
    try:
        data = request.get_json()
        symptom = data.get('symptom', '').strip()
        language = data.get('language', 'english')
        
        if not symptom:
            return jsonify({'error': 'Symptom is required'}), 400
        
        # Quick advice templates
        quick_tips = {
            'headache': "Drink water, rest in a dark quiet room, apply cold compress. If severe or persistent, consult a doctor.",
            'fever': "Stay hydrated, rest, take temperature regularly. If fever >101°F or lasts >3 days, see a doctor immediately.",
            'cold': "Rest, drink warm fluids, use steam inhalation. Most colds resolve in 7-10 days. Seek help if breathing difficulty occurs.",
            'cough': "Stay hydrated, use honey (if no diabetes), avoid smoke. Persistent cough >2 weeks needs medical attention.",
            'stomach': "Eat light foods, stay hydrated with ORS, avoid spicy foods. Severe pain or blood requires immediate medical care."
        }
        
        # Find matching advice
        advice = None
        for key, value in quick_tips.items():
            if key in symptom.lower():
                advice = value
                break
        
        if not advice:
            advice = "For any health concern, it's best to consult with a healthcare professional for proper diagnosis and treatment."
        
        # Translate if needed
        advice_kn = None
        if language == 'kannada':
            try:
                advice_kn = translate_to_kannada(advice)
            except:
                advice_kn = advice
        
        return jsonify({
            'success': True,
            'advice': advice,
            'advice_kn': advice_kn if advice_kn else advice
        })
    
    except Exception as e:
        logger.error(f"Quick advice error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to get advice'}), 500
