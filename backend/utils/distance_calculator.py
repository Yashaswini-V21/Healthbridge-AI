"""Distance calculation and geolocation utilities"""

from geopy.distance import geodesic
from typing import List, Tuple, Dict
import math

def calculate_distance(point1: Tuple[float, float], point2: Tuple[float, float], unit='km') -> float:
    """
    Calculate distance between two geographical points
    
    Args:
        point1: (latitude, longitude) tuple
        point2: (latitude, longitude) tuple
        unit: Distance unit ('km' or 'miles')
    
    Returns:
        float: Distance in specified unit
    """
    try:
        distance_km = geodesic(point1, point2).kilometers
        
        if unit == 'miles':
            return distance_km * 0.621371
        
        return distance_km
        
    except Exception as e:
        print(f"Error calculating distance: {e}")
        return None

def get_nearby_hospitals(
    user_location: Tuple[float, float],
    hospitals: List[Dict],
    max_distance: float = 50.0
) -> List[Dict]:
    """
    Filter hospitals within maximum distance from user
    
    Args:
        user_location: (latitude, longitude) of user
        hospitals: List of hospital dictionaries
        max_distance: Maximum distance in km
    
    Returns:
        List of hospitals with distance information
    """
    nearby = []
    
    for hospital in hospitals:
        if 'location' not in hospital:
            continue
        
        hospital_location = (
            hospital['location']['lat'],
            hospital['location']['lng']
        )
        
        distance = calculate_distance(user_location, hospital_location)
        
        if distance and distance <= max_distance:
            hospital_copy = hospital.copy()
            hospital_copy['distance'] = round(distance, 2)
            nearby.append(hospital_copy)
    
    # Sort by distance
    nearby.sort(key=lambda x: x['distance'])
    
    return nearby

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate haversine distance between two points (faster than geodesic)
    
    Args:
        lat1, lon1: First point coordinates
        lat2, lon2: Second point coordinates
    
    Returns:
        float: Distance in kilometers
    """
    R = 6371  # Earth's radius in kilometers
    
    # Convert to radians
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    # Haversine formula
    a = (math.sin(delta_lat / 2) ** 2 +
         math.cos(lat1_rad) * math.cos(lat2_rad) *
         math.sin(delta_lon / 2) ** 2)
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return distance

def get_bounding_box(
    center_lat: float,
    center_lon: float,
    distance_km: float
) -> Tuple[float, float, float, float]:
    """
    Calculate bounding box coordinates around a center point
    
    Args:
        center_lat: Center latitude
        center_lon: Center longitude
        distance_km: Distance from center in km
    
    Returns:
        Tuple: (min_lat, max_lat, min_lon, max_lon)
    """
    # Approximate degrees per km
    lat_degree = distance_km / 111.0
    lon_degree = distance_km / (111.0 * math.cos(math.radians(center_lat)))
    
    min_lat = center_lat - lat_degree
    max_lat = center_lat + lat_degree
    min_lon = center_lon - lon_degree
    max_lon = center_lon + lon_degree
    
    return (min_lat, max_lat, min_lon, max_lon)

def is_within_radius(
    point: Tuple[float, float],
    center: Tuple[float, float],
    radius_km: float
) -> bool:
    """
    Check if a point is within radius of center
    
    Args:
        point: (latitude, longitude) to check
        center: (latitude, longitude) of center
        radius_km: Radius in kilometers
    
    Returns:
        bool: True if point is within radius
    """
    distance = haversine_distance(center[0], center[1], point[0], point[1])
    return distance <= radius_km

def estimate_travel_time(distance_km: float, mode='car') -> int:
    """
    Estimate travel time based on distance and mode
    
    Args:
        distance_km: Distance in kilometers
        mode: Travel mode ('car', 'bike', 'walk')
    
    Returns:
        int: Estimated time in minutes
    """
    # Average speeds (km/h)
    speeds = {
        'car': 40,      # Urban driving
        'bike': 15,     # Cycling
        'walk': 5,      # Walking
        'ambulance': 50 # Emergency vehicle
    }
    
    speed = speeds.get(mode, 40)
    time_hours = distance_km / speed
    time_minutes = int(time_hours * 60)
    
    return time_minutes
