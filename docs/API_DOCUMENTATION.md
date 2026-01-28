# 📡 MediConnect AI - API Documentation

## API Overview

MediConnect AI provides a RESTful API for healthcare navigation, symptom analysis, and hospital matching.

**Base URL**: `http://localhost:5000/api`  
**Production URL**: `https://mediconnect-ai.com/api` (when deployed)

**API Version**: v1.0  
**Last Updated**: December 24, 2025

---

## 🔐 Authentication

MediConnect AI uses JWT (JSON Web Tokens) for authentication.

### Authentication Flow:
1. User signs up or logs in
2. Server returns a JWT token
3. Client includes token in subsequent requests
4. Token expires after 7 days

### Including Auth Token:
```http
Authorization: Bearer <your-jwt-token>
```

---

## 📚 API Endpoints

### Table of Contents:
1. [Authentication](#authentication-endpoints)
2. [Symptom Analysis](#symptom-analysis-endpoints)
3. [Hospital Matching](#hospital-matching-endpoints)
4. [User Profile](#user-profile-endpoints)

---

## 🔑 Authentication Endpoints

### 1. Sign Up

**Endpoint**: `POST /api/auth/signup`

**Description**: Create a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2025-12-24T10:30:00Z"
  }
}
```

**Response** (Email already exists - 400):
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Response** (Invalid email - 400):
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

**Response** (Missing fields - 400):
```json
{
  "success": false,
  "message": "Name, email, and password are required"
}
```

**Validation Rules**:
- Name: Required, 2-100 characters
- Email: Required, valid email format
- Password: Required, minimum 8 characters

---

### 2. Login

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticate existing user

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

**Response** (Invalid credentials - 401):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User

**Endpoint**: `GET /api/auth/me`

**Description**: Get currently authenticated user's information

**Authentication**: Required

**Headers**:
```http
Authorization: Bearer <token>
```

**Response** (Success - 200):
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2025-12-24T10:30:00Z"
  }
}
```

**Response** (Unauthorized - 401):
```json
{
  "success": false,
  "message": "Missing or invalid token"
}
```

---

### 4. Get User Profile

**Endpoint**: `GET /api/auth/profile`

**Description**: Get user profile with search history

**Authentication**: Required

**Response** (Success - 200):
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "search_history": [],
    "favorites": []
  }
}
```

---

### 5. Update User Profile

**Endpoint**: `PUT /api/auth/profile`

**Description**: Update user profile information

**Authentication**: Required

**Request Body**:
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "current_password": "OldPassword123",
  "new_password": "NewPassword456"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com"
  }
}
```

---

## 🩺 Symptom Analysis Endpoints

### 1. Analyze Symptoms

**Endpoint**: `POST /api/symptoms/analyze`

**Description**: Analyze symptoms and get medical recommendations

**Request Body**:
```json
{
  "text": "I have severe chest pain and difficulty breathing",
  "language": "en"
}
```

**Parameters**:
- `text` (string, required): Symptom description in plain language
- `language` (string, optional): Language code ('en' or 'kn'), default: 'en'

**Response** (Success - 200):
```json
{
  "success": true,
  "analysis": {
    "urgency": "HIGH",
    "urgency_score": 9,
    "matched_symptoms": [
      "Chest Pain",
      "Difficulty Breathing"
    ],
    "specialties": [
      "Cardiology",
      "Emergency Medicine",
      "Pulmonology"
    ],
    "description": "Your symptoms indicate a potentially serious condition requiring immediate medical attention.",
    "first_aid": [
      "Sit down and try to stay calm",
      "Loosen tight clothing",
      "If you have prescribed medication, take it",
      "Call emergency services (108) immediately"
    ],
    "red_flags": [
      "Severe chest pain",
      "Breathing difficulties"
    ],
    "symptom_details": [
      {
        "name": "Chest Pain",
        "urgency": "HIGH",
        "specialties": ["Cardiology", "Emergency Medicine"],
        "description": "Pain or discomfort in the chest area"
      },
      {
        "name": "Difficulty Breathing",
        "urgency": "HIGH",
        "specialties": ["Pulmonology", "Emergency Medicine"],
        "description": "Trouble breathing or shortness of breath"
      }
    ],
    "timestamp": "2025-12-24T14:30:00Z"
  }
}
```

**Response** (No symptoms matched - 200):
```json
{
  "success": true,
  "analysis": {
    "urgency": "LOW",
    "urgency_score": 1,
    "matched_symptoms": [],
    "specialties": ["General Medicine"],
    "description": "No specific symptoms identified. Please describe your symptoms in more detail or consult a general physician.",
    "first_aid": [
      "Rest and monitor symptoms",
      "Stay hydrated",
      "Maintain a healthy diet"
    ],
    "red_flags": [],
    "symptom_details": [],
    "timestamp": "2025-12-24T14:30:00Z"
  }
}
```

**Urgency Levels**:
- **HIGH**: Immediate medical attention required (ER visit)
- **MEDIUM**: See a doctor within 24 hours
- **LOW**: Schedule routine checkup

**Example Symptoms by Urgency**:

**HIGH Urgency**:
- Severe chest pain
- Difficulty breathing
- Heavy bleeding
- Unconsciousness
- Severe head injury
- Stroke symptoms

**MEDIUM Urgency**:
- High fever
- Persistent vomiting
- Severe headache
- Abdominal pain
- Irregular heartbeat

**LOW Urgency**:
- Mild cough
- Fatigue
- Minor aches
- Mild headache

---

### 2. Get All Symptoms

**Endpoint**: `GET /api/symptoms/list`

**Description**: Get list of all available symptoms in the database

**Response** (Success - 200):
```json
{
  "success": true,
  "count": 55,
  "symptoms": [
    {
      "id": 1,
      "name": "Fever",
      "keywords": ["fever", "temperature", "hot", "chills"],
      "urgency": "MEDIUM",
      "specialties": ["General Medicine", "Infectious Disease"],
      "kannada": "ಜ್ವರ",
      "hindi": "बुखार",
      "tamil": "காய்ச்சல்"
    },
    // ... more symptoms
  ]
}
```

---

## 🏥 Hospital Matching Endpoints

### 1. Find Hospitals

**Endpoint**: `POST /api/hospitals/find`

**Description**: Find hospitals based on specialties and location

**Request Body**:
```json
{
  "specialties": ["Cardiology", "Emergency Medicine"],
  "user_location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "urgency": "HIGH",
  "filters": {
    "type": "Private",
    "emergency_only": false,
    "max_distance": 20
  }
}
```

**Parameters**:
- `specialties` (array, required): List of medical specialties needed
- `user_location` (object, required): User's coordinates
  - `lat` (number): Latitude
  - `lng` (number): Longitude
- `urgency` (string, optional): 'HIGH', 'MEDIUM', or 'LOW', default: 'MEDIUM'
- `filters` (object, optional): Additional filters
  - `type` (string): 'Government' or 'Private'
  - `emergency_only` (boolean): Show only emergency hospitals
  - `max_distance` (number): Maximum distance in kilometers

**Response** (Success - 200):
```json
{
  "success": true,
  "count": 15,
  "hospitals": [
    {
      "id": 1,
      "name": "Manipal Hospital",
      "type": "Private",
      "address": "98, HAL Airport Road, Bangalore",
      "phone": "+91-80-2502-4444",
      "location": {
        "lat": 12.9579,
        "lng": 77.6509
      },
      "distance_km": 1.26,
      "estimated_time_minutes": 8,
      "specialties": [
        "Cardiology",
        "Neurology",
        "Emergency Medicine",
        "Orthopedics"
      ],
      "has_emergency": true,
      "is_24x7": true,
      "services": [
        "Emergency Care",
        "ICU",
        "CT Scan",
        "MRI",
        "Blood Bank"
      ],
      "rating": 4.5,
      "rank_score": 95.5
    },
    // ... more hospitals (up to 15)
  ]
}
```

**Response** (No hospitals found - 200):
```json
{
  "success": true,
  "count": 0,
  "hospitals": [],
  "message": "No hospitals found matching your criteria. Try expanding search radius."
}
```

---

### 2. Find Emergency Hospitals

**Endpoint**: `POST /api/hospitals/emergency`

**Description**: Find nearest hospitals with 24/7 emergency services

**Request Body**:
```json
{
  "user_location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "max_results": 5
}
```

**Parameters**:
- `user_location` (object, required): User's coordinates
- `max_results` (number, optional): Maximum number of results, default: 5

**Response** (Success - 200):
```json
{
  "success": true,
  "count": 5,
  "hospitals": [
    {
      "id": 1,
      "name": "Manipal Hospital - Emergency",
      "phone": "+91-80-2502-4444",
      "location": {
        "lat": 12.9579,
        "lng": 77.6509
      },
      "distance_km": 1.26,
      "estimated_time_minutes": 8,
      "address": "98, HAL Airport Road, Bangalore",
      "has_ambulance": true,
      "is_24x7": true
    },
    // ... more hospitals
  ]
}
```

---

### 3. Get Hospital Details

**Endpoint**: `GET /api/hospitals/:id`

**Description**: Get detailed information about a specific hospital

**Response** (Success - 200):
```json
{
  "success": true,
  "hospital": {
    "id": 1,
    "name": "Manipal Hospital",
    "type": "Private",
    "address": "98, HAL Airport Road, Bangalore",
    "phone": "+91-80-2502-4444",
    "email": "info@manipalhospitals.com",
    "website": "https://www.manipalhospitals.com",
    "location": {
      "lat": 12.9579,
      "lng": 77.6509
    },
    "specialties": [
      "Cardiology",
      "Neurology",
      "Orthopedics",
      "Emergency Medicine"
    ],
    "services": [
      "Emergency Care",
      "ICU",
      "NICU",
      "CT Scan",
      "MRI"
    ],
    "has_emergency": true,
    "is_24x7": true,
    "has_ambulance": true,
    "beds_available": 450,
    "rating": 4.5,
    "reviews_count": 1234
  }
}
```

**Response** (Not found - 404):
```json
{
  "success": false,
  "message": "Hospital not found"
}
```

---

### 4. Get All Hospitals

**Endpoint**: `GET /api/hospitals/list`

**Description**: Get list of all hospitals in the database

**Query Parameters**:
- `type` (string, optional): Filter by 'Government' or 'Private'
- `specialty` (string, optional): Filter by specialty
- `emergency_only` (boolean, optional): Show only emergency hospitals

**Example**: `GET /api/hospitals/list?type=Private&emergency_only=true`

**Response** (Success - 200):
```json
{
  "success": true,
  "count": 40,
  "hospitals": [
    {
      "id": 1,
      "name": "Manipal Hospital",
      "type": "Private",
      "location": {
        "lat": 12.9579,
        "lng": 77.6509
      },
      "specialties": ["Cardiology", "Neurology"],
      "has_emergency": true
    },
    // ... more hospitals
  ]
}
```

---

## 👤 User Profile Endpoints

### 1. Get Search History

**Endpoint**: `GET /api/user/history`

**Description**: Get user's symptom search history

**Authentication**: Required

**Response** (Success - 200):
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "symptoms": "fever and headache",
      "urgency": "MEDIUM",
      "specialties": ["General Medicine"],
      "hospitals_found": 12,
      "timestamp": "2025-12-24T10:00:00Z"
    },
    // ... more history items
  ]
}
```

---

### 2. Get Favorite Hospitals

**Endpoint**: `GET /api/user/favorites`

**Description**: Get user's favorite hospitals

**Authentication**: Required

**Response** (Success - 200):
```json
{
  "success": true,
  "favorites": [
    {
      "id": 1,
      "name": "Manipal Hospital",
      "phone": "+91-80-2502-4444",
      "address": "98, HAL Airport Road, Bangalore",
      "added_at": "2025-12-20T14:30:00Z"
    }
  ]
}
```

---

### 3. Add Favorite Hospital

**Endpoint**: `POST /api/user/favorites`

**Description**: Add hospital to favorites

**Authentication**: Required

**Request Body**:
```json
{
  "hospital_id": 1
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "Hospital added to favorites"
}
```

---

### 4. Remove Favorite Hospital

**Endpoint**: `DELETE /api/user/favorites/:hospital_id`

**Description**: Remove hospital from favorites

**Authentication**: Required

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Hospital removed from favorites"
}
```

---

## 📊 Response Format

### Standard Success Response:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Standard Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "error_code": "OPTIONAL_ERROR_CODE"
}
```

---

## ⚠️ Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error - Server error |

---

## 🔧 Rate Limiting

- **Rate Limit**: 100 requests per minute per IP
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

**Rate Limit Exceeded Response** (429):
```json
{
  "success": false,
  "message": "Rate limit exceeded. Try again in 60 seconds."
}
```

---

## 🧪 Testing the API

### Using cURL:

**Sign Up**:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Analyze Symptoms**:
```bash
curl -X POST http://localhost:5000/api/symptoms/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"I have fever and headache","language":"en"}'
```

**Find Hospitals**:
```bash
curl -X POST http://localhost:5000/api/hospitals/find \
  -H "Content-Type: application/json" \
  -d '{"specialties":["Cardiology"],"user_location":{"lat":12.9716,"lng":77.5946}}'
```

---

## 📚 API Client Examples

### JavaScript (Axios):
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Analyze symptoms
const analyzeSymptoms = async (text) => {
  const response = await axios.post(`${API_URL}/symptoms/analyze`, {
    text,
    language: 'en'
  });
  return response.data;
};

// Find hospitals
const findHospitals = async (specialties, location) => {
  const response = await axios.post(`${API_URL}/hospitals/find`, {
    specialties,
    user_location: location,
    urgency: 'MEDIUM'
  });
  return response.data;
};
```

### Python (Requests):
```python
import requests

API_URL = 'http://localhost:5000/api'

# Analyze symptoms
def analyze_symptoms(text):
    response = requests.post(
        f'{API_URL}/symptoms/analyze',
        json={'text': text, 'language': 'en'}
    )
    return response.json()

# Find hospitals
def find_hospitals(specialties, location):
    response = requests.post(
        f'{API_URL}/hospitals/find',
        json={
            'specialties': specialties,
            'user_location': location,
            'urgency': 'MEDIUM'
        }
    )
    return response.json()
```

---

## 📝 API Changelog

### v1.0.0 (December 24, 2025)
- Initial API release
- Authentication endpoints
- Symptom analysis
- Hospital matching
- User profile management

---

## 🤝 Support

For API support or questions:
- Email: api@mediconnect-ai.com (example)
- GitHub Issues: [Report API issues](https://github.com/Yashaswini-V21/mediconnect-ai/issues)

---

**Built with ❤️ for Microsoft Imagine Cup 2026**
