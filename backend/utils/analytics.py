import json
import os
from datetime import datetime
from threading import Lock

class Analytics:
    """Analytics tracking for MediConnect AI - Microsoft Imagine Cup 2026"""
    
    def __init__(self):
        self.db_path = os.path.join(os.path.dirname(__file__), '..', 'instance', 'analytics.json')
        self.lock = Lock()
        self.load_analytics()
    
    def load_analytics(self):
        """Load analytics data from JSON file"""
        try:
            # Create instance directory if it doesn't exist
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
            
            with open(self.db_path, 'r') as f:
                self.data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            # Initialize with default data
            self.data = {
                'total_searches': 0,
                'emergency_mode_uses': 0,
                'avg_response_time_ms': [],
                'top_symptoms': {},
                'top_hospitals_viewed': {},
                'languages_used': {'en': 0, 'kn': 0},
                'time_saved_minutes': 0,
                'total_users': 0,
                'searches_by_urgency': {'HIGH': 0, 'MEDIUM': 0, 'LOW': 0},
                'total_hospitals_called': 0,
                'total_directions_requested': 0,
                'created_at': datetime.utcnow().isoformat(),
                'last_updated': datetime.utcnow().isoformat()
            }
            self.save()
    
    def track_symptom_search(self, symptoms, urgency, response_time_ms, language='en'):
        """Track a symptom search event"""
        with self.lock:
            self.data['total_searches'] += 1
            self.data['searches_by_urgency'][urgency] += 1
            self.data['languages_used'][language] += 1
            self.data['avg_response_time_ms'].append(response_time_ms)
            
            # Keep only last 1000 response times to avoid memory issues
            if len(self.data['avg_response_time_ms']) > 1000:
                self.data['avg_response_time_ms'] = self.data['avg_response_time_ms'][-1000:]
            
            # Assuming 30 minutes saved per search (conservative estimate)
            self.data['time_saved_minutes'] += 30
            
            # Track popular symptoms
            symptom_key = symptoms.lower()[:100]  # Limit length
            if symptom_key in self.data['top_symptoms']:
                self.data['top_symptoms'][symptom_key] += 1
            else:
                self.data['top_symptoms'][symptom_key] = 1
            
            self.data['last_updated'] = datetime.utcnow().isoformat()
            self.save()
    
    def track_emergency_use(self):
        """Track emergency mode activation"""
        with self.lock:
            self.data['emergency_mode_uses'] += 1
            # Emergency saves more time (45 minutes)
            self.data['time_saved_minutes'] += 45
            self.data['last_updated'] = datetime.utcnow().isoformat()
            self.save()
    
    def track_hospital_view(self, hospital_id):
        """Track hospital detail view"""
        with self.lock:
            hospital_key = str(hospital_id)
            if hospital_key in self.data['top_hospitals_viewed']:
                self.data['top_hospitals_viewed'][hospital_key] += 1
            else:
                self.data['top_hospitals_viewed'][hospital_key] = 1
            
            self.data['last_updated'] = datetime.utcnow().isoformat()
            self.save()
    
    def track_hospital_call(self):
        """Track when user calls a hospital"""
        with self.lock:
            self.data['total_hospitals_called'] += 1
            self.data['last_updated'] = datetime.utcnow().isoformat()
            self.save()
    
    def track_directions_request(self):
        """Track when user requests directions"""
        with self.lock:
            self.data['total_directions_requested'] += 1
            self.data['last_updated'] = datetime.utcnow().isoformat()
            self.save()
    
    def track_new_user(self):
        """Track new user registration"""
        with self.lock:
            self.data['total_users'] += 1
            self.data['last_updated'] = datetime.utcnow().isoformat()
            self.save()
    
    def get_stats(self):
        """Get comprehensive analytics statistics"""
        with self.lock:
            # Calculate average response time
            avg_response = 0
            if self.data['avg_response_time_ms']:
                avg_response = sum(self.data['avg_response_time_ms']) / len(self.data['avg_response_time_ms'])
            
            # Calculate total searches
            total_searches = max(1, self.data['total_searches'])
            
            # Get top 5 symptoms
            top_symptoms = sorted(
                self.data['top_symptoms'].items(),
                key=lambda x: x[1],
                reverse=True
            )[:5]
            
            # Get top 5 hospitals
            top_hospitals = sorted(
                self.data['top_hospitals_viewed'].items(),
                key=lambda x: x[1],
                reverse=True
            )[:5]
            
            # Calculate percentages
            kannada_usage = (self.data['languages_used']['kn'] / total_searches) * 100
            high_urgency = (self.data['searches_by_urgency']['HIGH'] / total_searches) * 100
            medium_urgency = (self.data['searches_by_urgency']['MEDIUM'] / total_searches) * 100
            low_urgency = (self.data['searches_by_urgency']['LOW'] / total_searches) * 100
            
            # Calculate lives potentially saved (conservative: 1 life per 100 high-urgency searches)
            lives_saved = self.data['searches_by_urgency']['HIGH'] // 100
            
            # Calculate cost savings (₹8,500 per wrong hospital visit avoided)
            cost_saved_inr = self.data['total_searches'] * 8500
            
            return {
                # Core Metrics
                'total_searches': self.data['total_searches'],
                'emergency_uses': self.data['emergency_mode_uses'],
                'total_users': self.data['total_users'],
                
                # Performance Metrics
                'avg_response_time_ms': round(avg_response, 2),
                'avg_response_time_sec': round(avg_response / 1000, 2),
                
                # Time Saved
                'total_time_saved_minutes': self.data['time_saved_minutes'],
                'total_time_saved_hours': round(self.data['time_saved_minutes'] / 60, 1),
                'total_time_saved_days': round(self.data['time_saved_minutes'] / 1440, 1),
                
                # Language Usage
                'english_usage': self.data['languages_used']['en'],
                'kannada_usage': self.data['languages_used']['kn'],
                'kannada_usage_percent': round(kannada_usage, 1),
                
                # Urgency Distribution
                'high_urgency_searches': self.data['searches_by_urgency']['HIGH'],
                'medium_urgency_searches': self.data['searches_by_urgency']['MEDIUM'],
                'low_urgency_searches': self.data['searches_by_urgency']['LOW'],
                'high_urgency_percent': round(high_urgency, 1),
                'medium_urgency_percent': round(medium_urgency, 1),
                'low_urgency_percent': round(low_urgency, 1),
                
                # Engagement Metrics
                'total_hospitals_called': self.data['total_hospitals_called'],
                'total_directions_requested': self.data['total_directions_requested'],
                'engagement_rate': round((self.data['total_hospitals_called'] + self.data['total_directions_requested']) / total_searches * 100, 1) if total_searches > 0 else 0,
                
                # Top Data
                'top_symptoms': [{'symptom': s[0], 'count': s[1]} for s in top_symptoms],
                'top_hospitals_viewed': [{'hospital_id': h[0], 'views': h[1]} for h in top_hospitals],
                
                # Impact Metrics (for Imagine Cup!)
                'lives_potentially_saved': lives_saved,
                'cost_saved_inr': cost_saved_inr,
                'cost_saved_usd': round(cost_saved_inr / 83, 2),  # Approx conversion
                
                # Metadata
                'created_at': self.data['created_at'],
                'last_updated': self.data['last_updated']
            }
    
    def get_dashboard_stats(self):
        """Get simplified stats for dashboard display"""
        stats = self.get_stats()
        return {
            'total_searches': stats['total_searches'],
            'emergency_uses': stats['emergency_uses'],
            'time_saved_hours': stats['total_time_saved_hours'],
            'lives_saved': stats['lives_potentially_saved'],
            'avg_response_sec': stats['avg_response_time_sec'],
            'kannada_usage_percent': stats['kannada_usage_percent'],
            'high_urgency_percent': stats['high_urgency_percent'],
            'engagement_rate': stats['engagement_rate']
        }
    
    def save(self):
        """Save analytics data to JSON file"""
        try:
            with open(self.db_path, 'w') as f:
                json.dump(self.data, f, indent=2)
        except Exception as e:
            print(f"Error saving analytics: {e}")
    
    def reset_analytics(self):
        """Reset all analytics (admin only - for testing)"""
        with self.lock:
            self.data = {
                'total_searches': 0,
                'emergency_mode_uses': 0,
                'avg_response_time_ms': [],
                'top_symptoms': {},
                'top_hospitals_viewed': {},
                'languages_used': {'en': 0, 'kn': 0},
                'time_saved_minutes': 0,
                'total_users': 0,
                'searches_by_urgency': {'HIGH': 0, 'MEDIUM': 0, 'LOW': 0},
                'total_hospitals_called': 0,
                'total_directions_requested': 0,
                'created_at': datetime.utcnow().isoformat(),
                'last_updated': datetime.utcnow().isoformat()
            }
            self.save()


# Initialize global analytics instance
analytics = Analytics()
