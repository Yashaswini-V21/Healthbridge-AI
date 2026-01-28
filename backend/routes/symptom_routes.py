from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.symptom_analyzer import get_symptom_analyzer
from models.user_model import db, SearchHistory
from utils.analytics import analytics
from utils.azure_translator_service import translate_to_kannada, translate_list
import logging
import time

symptom_bp = Blueprint('symptoms', __name__)
logger = logging.getLogger(__name__)

@symptom_bp.route('/analyze', methods=['POST'])
def analyze_symptoms():
    """Analyze user symptoms and recommend specialties"""
    start_time = time.time()
    
    try:
        data = request.get_json()
        
        # Validate input
        if not data.get('symptoms'):
            return jsonify({'error': 'Symptoms description is required'}), 400
        
        symptoms_text = data['symptoms']
        language = data.get('language', 'en')
        
        # Get analyzer instance
        analyzer = get_symptom_analyzer()
        
        # Analyze symptoms
        analysis_result = analyzer.analyze(symptoms_text, language)
        
        # Translate to Kannada if requested
        if language == 'kn':
            try:
                logger.info("Translating analysis result to Kannada...")
                # Translate recommendation
                if analysis_result.get('recommendation'):
                    analysis_result['recommendation'] = translate_to_kannada(analysis_result['recommendation'])
                
                # Translate specialties
                if analysis_result.get('recommended_specialties'):
                    analysis_result['recommended_specialties'] = translate_list(
                        analysis_result['recommended_specialties'], 'kn'
                    )
                
                # Translate first aid tips
                if analysis_result.get('first_aid_tips'):
                    analysis_result['first_aid_tips'] = translate_list(
                        analysis_result['first_aid_tips'], 'kn'
                    )
                
                # Translate red flags
                if analysis_result.get('red_flags'):
                    analysis_result['red_flags'] = translate_list(
                        analysis_result['red_flags'], 'kn'
                    )
                
                logger.info("Translation to Kannada completed")
            except Exception as trans_error:
                logger.warning(f"Translation failed, keeping English: {trans_error}")
                # Continue with English results if translation fails
        
        # Track analytics
        response_time = (time.time() - start_time) * 1000  # milliseconds
        urgency = analysis_result.get('urgency', 'MEDIUM')
        analytics.track_symptom_search(symptoms_text, urgency, response_time, language)
        
        logger.info(f"Symptom analysis completed: {len(analysis_result['matched_symptoms'])} symptoms matched, {response_time:.2f}ms")
        
        return jsonify({
            'success': True,
            'analysis': analysis_result
        }), 200
        
    except Exception as e:
        logger.error(f"Error analyzing symptoms: {e}")
        return jsonify({'error': str(e)}), 500

@symptom_bp.route('/list', methods=['GET'])
def list_symptoms():
    """Get list of all available symptoms"""
    try:
        analyzer = get_symptom_analyzer()
        symptoms = analyzer.get_all_symptoms()
        
        return jsonify({
            'success': True,
            'symptoms': symptoms,
            'total': len(symptoms)
        }), 200
        
    except Exception as e:
        logger.error(f"Error listing symptoms: {e}")
        return jsonify({'error': str(e)}), 500

@symptom_bp.route('/search', methods=['GET'])
def search_symptoms():
    """Search symptoms by keyword"""
    try:
        query = request.args.get('q', '')
        limit = int(request.args.get('limit', 10))
        
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        
        analyzer = get_symptom_analyzer()
        results = analyzer.search_symptoms(query, limit)
        
        return jsonify({
            'success': True,
            'query': query,
            'results': results,
            'total': len(results)
        }), 200
        
    except Exception as e:
        logger.error(f"Error searching symptoms: {e}")
        return jsonify({'error': str(e)}), 500

@symptom_bp.route('/<symptom_id>', methods=['GET'])
def get_symptom_details(symptom_id):
    """Get detailed information about a specific symptom"""
    try:
        analyzer = get_symptom_analyzer()
        symptom = analyzer.get_symptom_by_id(symptom_id)
        
        if not symptom:
            return jsonify({'error': 'Symptom not found'}), 404
        
        return jsonify({
            'success': True,
            'symptom': symptom
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@symptom_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all symptom categories"""
    try:
        categories = analyzer.symptoms_data.get('categories', [])
        
        return jsonify({
            'success': True,
            'categories': categories
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@symptom_bp.route('/emergency-check', methods=['POST'])
def check_emergency():
    """Quick emergency symptom check"""
    try:
        data = request.get_json()
        
        if not data.get('symptoms'):
            return jsonify({'error': 'Symptoms description is required'}), 400
        
        symptoms_text = data['symptoms']
        language = data.get('language', 'english')
        
        # Analyze symptoms
        analysis_result = analyzer.analyze_symptoms(symptoms_text, language)
        
        # Check if emergency
        is_emergency = analysis_result['requires_emergency']
        urgency_level = analysis_result['urgency_level']
        
        return jsonify({
            'success': True,
            'is_emergency': is_emergency,
            'urgency_level': urgency_level,
            'urgency_score': analysis_result['urgency_score'],
            'message': 'Seek immediate medical attention' if is_emergency else 'Consult a doctor soon',
            'first_aid': analysis_result['first_aid_tips'],
            'red_flags': analysis_result['red_flags']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
