import json
import math
import os
from typing import List, Dict, Tuple, Optional
import logging

# Configure logging
logger = logging.getLogger(__name__)

class HospitalMatcher:
    """Intelligent hospital matching and ranking system"""
    
    def __init__(self, hospitals_db_path=None):
        if hospitals_db_path is None:
            hospitals_db_path = os.path.join(
                os.path.dirname(__file__), '..', 'data', 'hospitals.json'
            )
        self.hospitals_db_path = hospitals_db_path
        self.hospitals = self._load_hospitals()
        logger.info(f"HospitalMatcher initialized with {len(self.hospitals)} hospitals")
    
    def _load_hospitals(self) -> List[Dict]:
        """Load hospitals database from JSON file"""
        try:
            with open(self.hospitals_db_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                hospitals = data.get('hospitals', [])
                logger.info(f"Successfully loaded {len(hospitals)} hospitals from database")
                return hospitals
        except FileNotFoundError:
            logger.error(f"Hospitals file not found: {self.hospitals_db_path}")
            return []
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing hospitals JSON: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error loading hospitals: {e}")
            return []
    
    def find_hospitals(
        self,
        specialties: List[str],
        user_location: Dict[str, float],
        urgency: str = 'MEDIUM',
        filters: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Find and rank hospitals based on requirements
        
        Args:
            specialties: List of required medical specialties
            user_location: {'lat': float, 'lng': float}
            urgency: 'HIGH', 'MEDIUM', or 'LOW'
            filters: {
                'type': 'Government'/'Private',
                'emergency_only': bool,
                'max_distance': float (km)
            }
        
        Returns:
            List of matched hospitals with scores and distances
        """
        logger.info(f"Finding hospitals: specialties={specialties}, urgency={urgency}")
        
        # Validate user location
        if not user_location or 'lat' not in user_location or 'lng' not in user_location:
            # Use Bangalore city center as default
            user_location = {'lat': 12.9716, 'lng': 77.5946}
            logger.warning("Invalid user location, using Bangalore center as default")
        
        # Initialize filters
        if filters is None:
            filters = {}
        
        # Filter hospitals
        filtered_hospitals = self._apply_filters(
            self.hospitals,
            specialties,
            urgency,
            filters
        )
        
        if not filtered_hospitals:
            logger.warning("No hospitals matched the filters")
            return []
        
        logger.info(f"Filtered to {len(filtered_hospitals)} hospitals")
        
        # Calculate distances and add location data
        hospitals_with_distance = []
        for hospital in filtered_hospitals:
            try:
                distance = self._calculate_distance(
                    user_location['lat'],
                    user_location['lng'],
                    hospital['location']['lat'],
                    hospital['location']['lng']
                )
                
                # Skip if too far (except for HIGH urgency)
                max_distance = filters.get('max_distance', 20)
                if urgency != 'HIGH' and distance > max_distance:
                    continue
                
                hospitals_with_distance.append({
                    **hospital,
                    'distance_km': round(distance, 2),
                    'estimated_time_minutes': self._estimate_travel_time(distance, urgency)
                })
            except Exception as e:
                logger.error(f"Error calculating distance for hospital {hospital.get('name')}: {e}")
                continue
        
        if not hospitals_with_distance:
            logger.warning("No hospitals within distance range")
            return []
        
        # Score and rank hospitals
        ranked_hospitals = self._rank_hospitals(
            hospitals_with_distance,
            specialties,
            urgency
        )
        
        logger.info(f"Ranked {len(ranked_hospitals)} hospitals, returning top 15")
        
        # Return top 15 hospitals
        return ranked_hospitals[:15]
    
    def find_emergency_hospitals(
        self,
        user_location: Dict[str, float],
        max_results: int = 5
    ) -> List[Dict]:
        """
        Find nearest hospitals with emergency services
        
        Args:
            user_location: {'lat': float, 'lng': float}
            max_results: Maximum number of results
        
        Returns:
            List of emergency hospitals sorted by distance
        """
        logger.info("Finding emergency hospitals")
        
        # Validate location
        if not user_location or 'lat' not in user_location or 'lng' not in user_location:
            user_location = {'lat': 12.9716, 'lng': 77.5946}
            logger.warning("Invalid location for emergency search, using default")
        
        # Filter for emergency-enabled hospitals
        emergency_hospitals = [
            h for h in self.hospitals
            if h.get('emergency_available', False)
        ]
        
        logger.info(f"Found {len(emergency_hospitals)} emergency-enabled hospitals")
        
        # Calculate distances
        hospitals_with_distance = []
        for hospital in emergency_hospitals:
            try:
                distance = self._calculate_distance(
                    user_location['lat'],
                    user_location['lng'],
                    hospital['location']['lat'],
                    hospital['location']['lng']
                )
                
                hospitals_with_distance.append({
                    **hospital,
                    'distance_km': round(distance, 2),
                    'estimated_time_minutes': self._estimate_travel_time(distance, 'HIGH')
                })
            except Exception as e:
                logger.error(f"Error processing emergency hospital: {e}")
                continue
        
        # Sort by distance (nearest first)
        hospitals_with_distance.sort(key=lambda x: x['distance_km'])
        
        result = hospitals_with_distance[:max_results]
        logger.info(f"Returning {len(result)} emergency hospitals")
        
        return result
    
    def _apply_filters(
        self,
        hospitals: List[Dict],
        specialties: List[str],
        urgency: str,
        filters: Dict
    ) -> List[Dict]:
        """Apply filters to hospital list"""
        filtered = hospitals.copy()
        
        # Filter by specialty (must have at least one matching specialty)
        if specialties:
            filtered = [
                h for h in filtered
                if any(s in h.get('specialties', []) for s in specialties)
            ]
            logger.debug(f"After specialty filter: {len(filtered)} hospitals")
        
        # Filter by hospital type (Government/Private)
        if filters.get('type'):
            filtered = [
                h for h in filtered
                if h.get('type') == filters['type']
            ]
            logger.debug(f"After type filter: {len(filtered)} hospitals")
        
        # Filter by emergency availability (required for HIGH urgency)
        if filters.get('emergency_only') or urgency == 'HIGH':
            filtered = [
                h for h in filtered
                if h.get('emergency_available', False)
            ]
            logger.debug(f"After emergency filter: {len(filtered)} hospitals")
        
        # Filter by 24/7 availability
        if filters.get('open_24_7'):
            filtered = [
                h for h in filtered
                if h.get('open_24_7', False)
            ]
            logger.debug(f"After 24/7 filter: {len(filtered)} hospitals")
        
        return filtered
    
    def _calculate_distance(
        self,
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float
    ) -> float:
        """
        Calculate distance between two points using Haversine formula
        
        Args:
            lat1, lon1: Starting point coordinates
            lat2, lon2: Ending point coordinates
        
        Returns:
            Distance in kilometers
        """
        # Earth's radius in kilometers
        R = 6371.0
        
        # Convert degrees to radians
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)
        
        # Calculate differences
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        # Haversine formula
        a = (math.sin(dlat / 2)**2 + 
             math.cos(lat1_rad) * math.cos(lat2_rad) * 
             math.sin(dlon / 2)**2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        distance = R * c
        return distance
    
    def _estimate_travel_time(self, distance_km: float, urgency: str = 'MEDIUM') -> int:
        """
        Estimate travel time in minutes based on distance and Bangalore traffic
        
        Args:
            distance_km: Distance in kilometers
            urgency: Urgency level (affects speed estimate)
        
        Returns:
            Estimated time in minutes
        """
        # Average speeds based on urgency (km/h)
        if urgency == 'HIGH':
            avg_speed = 35  # Faster with emergency priority
        elif urgency == 'MEDIUM':
            avg_speed = 25  # Normal Bangalore traffic
        else:
            avg_speed = 20  # Slower, non-urgent
        
        # Calculate base time
        time_hours = distance_km / avg_speed
        time_minutes = time_hours * 60
        
        # Add buffer time for traffic and navigation
        if distance_km < 3:
            buffer = 5
        elif distance_km < 10:
            buffer = 10
        else:
            buffer = 15
        
        total_time = int(time_minutes + buffer)
        
        return max(total_time, 5)  # Minimum 5 minutes
    
    def _rank_hospitals(
        self,
        hospitals: List[Dict],
        specialties: List[str],
        urgency: str
    ) -> List[Dict]:
        """
        Score and rank hospitals using multi-factor algorithm
        
        Scoring breakdown (out of 100):
        - Specialty match: 35 points
        - Distance: 30 points
        - Rating: 20 points
        - Emergency available: 15 points (if HIGH urgency)
        
        Args:
            hospitals: List of hospitals with distance data
            specialties: Required specialties
            urgency: Urgency level
        
        Returns:
            Sorted list of hospitals with match scores
        """
        scored_hospitals = []
        
        for hospital in hospitals:
            score = 0
            score_breakdown = {}
            
            # 1. Specialty match score (35 points)
            hospital_specialties = hospital.get('specialties', [])
            if specialties:
                matching_specialties = [
                    s for s in specialties
                    if s in hospital_specialties
                ]
                specialty_score = (len(matching_specialties) / len(specialties)) * 35
                score += specialty_score
                score_breakdown['specialty'] = round(specialty_score, 2)
            else:
                # Base score if no specific specialties
                score += 20
                score_breakdown['specialty'] = 20
            
            # 2. Distance score (30 points) - closer is better
            distance = hospital['distance_km']
            if distance <= 2:
                distance_score = 30
            elif distance <= 5:
                distance_score = 25
            elif distance <= 10:
                distance_score = 20
            elif distance <= 15:
                distance_score = 15
            elif distance <= 20:
                distance_score = 10
            else:
                # Penalize distant hospitals
                distance_score = max(0, 30 - (distance - 20) * 2)
            
            score += distance_score
            score_breakdown['distance'] = round(distance_score, 2)
            
            # 3. Rating score (20 points)
            rating = hospital.get('rating', 3.0)
            rating_score = (rating / 5.0) * 20
            score += rating_score
            score_breakdown['rating'] = round(rating_score, 2)
            
            # 4. Emergency availability bonus (15 points for HIGH urgency)
            if urgency == 'HIGH':
                if hospital.get('emergency_available', False):
                    score += 15
                    score_breakdown['emergency'] = 15
                else:
                    score_breakdown['emergency'] = 0
            
            # 5. 24/7 availability bonus (5 points)
            if hospital.get('open_24_7', False):
                score += 5
                score_breakdown['availability'] = 5
            else:
                score_breakdown['availability'] = 0
            
            # Add scored hospital to list
            scored_hospitals.append({
                **hospital,
                'match_score': round(score, 2),
                'score_breakdown': score_breakdown
            })
        
        # Sort by match score (descending)
        scored_hospitals.sort(key=lambda x: x['match_score'], reverse=True)
        
        return scored_hospitals
    
    def get_hospital_by_id(self, hospital_id: str) -> Optional[Dict]:
        """
        Get specific hospital details by ID
        
        Args:
            hospital_id: Hospital ID
        
        Returns:
            Hospital data or None if not found
        """
        for hospital in self.hospitals:
            if hospital.get('id') == hospital_id:
                logger.info(f"Found hospital: {hospital.get('name')}")
                return hospital
        
        logger.warning(f"Hospital not found: {hospital_id}")
        return None
    
    def get_hospitals_by_specialty(self, specialty: str) -> List[Dict]:
        """
        Get all hospitals offering a specific specialty
        
        Args:
            specialty: Medical specialty name
        
        Returns:
            List of hospitals
        """
        hospitals = [
            h for h in self.hospitals
            if specialty in h.get('specialties', [])
        ]
        logger.info(f"Found {len(hospitals)} hospitals with specialty: {specialty}")
        return hospitals
    
    def get_all_hospitals(self) -> List[Dict]:
        """Get all hospitals in database"""
        return self.hospitals
    
    def get_hospital_statistics(self) -> Dict:
        """Get statistics about hospital database"""
        total = len(self.hospitals)
        
        emergency_count = sum(1 for h in self.hospitals if h.get('emergency_available'))
        private_count = sum(1 for h in self.hospitals if h.get('type') == 'Private')
        govt_count = sum(1 for h in self.hospitals if h.get('type') == 'Government')
        
        # Collect all specialties
        all_specialties = set()
        for h in self.hospitals:
            all_specialties.update(h.get('specialties', []))
        
        stats = {
            'total_hospitals': total,
            'emergency_hospitals': emergency_count,
            'private_hospitals': private_count,
            'government_hospitals': govt_count,
            'total_specialties': len(all_specialties),
            'specialties': sorted(list(all_specialties))
        }
        
        logger.info(f"Hospital statistics: {stats['total_hospitals']} total, "
                   f"{stats['emergency_hospitals']} with emergency")
        
        return stats


# Global matcher instance
hospital_matcher = None

def get_hospital_matcher():
    """Get or create hospital matcher instance"""
    global hospital_matcher
    if hospital_matcher is None:
        hospital_matcher = HospitalMatcher()
    return hospital_matcher
