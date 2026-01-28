from .auth_routes import auth_bp
from .symptom_routes import symptom_bp
from .hospital_routes import hospital_bp

__all__ = ['auth_bp', 'symptom_bp', 'hospital_bp']
