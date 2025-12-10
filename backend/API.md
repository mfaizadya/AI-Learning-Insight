# Learning Assessment API Documentation

## Overview

The Learning Assessment API is a RESTful web service that provides endpoints for managing learning assessments, user profiles, test results, and administrative functions. This API supports educational applications focused on learning style and pattern assessment.

## Base URL

```
http://localhost:3000/api
```

**Note:** The base URL may vary depending on your deployment environment. Check your `.env` configuration for the correct PORT setting.

## API Structure

The API is organized into the following main sections:

- **Authentication** (`/auth`) - User registration, login, and token management
- **Users** (`/users`) - User profile management and profile pictures
- **Tests** (`/tests`) - Learning assessment tests (POLA and GAYA)
- **Results** (`/results`) - Test result submission and retrieval
- **Insights** (`/insights`) - Learning insights and recommendations
- **Admin** (`/admin`) - Administrative functions for managing test content
- **MOTD** (`/motd`) - Message of the Day management

## Quick Start

1. Register a new user account via `/auth/register`
2. Login to receive a JWT token via `/auth/login`
3. Include the JWT token in the `Authorization` header for protected endpoints
4. Access available tests via `/tests` endpoints
5. Submit test results via `/results` endpoints

## Authentication

This API uses JWT (JSON Web Token) for authentication. After successful login, you'll receive a JWT token that must be included in the Authorization header for protected endpoints.

### Authentication Header Format

```
Authorization: Bearer <your_jwt_token>
```

### JWT Token Structure

The JWT token contains the following payload:
- `id` - User ID
- `email` - User email address  
- `role` - User role (user or admin)
- `iat` - Token issued at timestamp
- `exp` - Token expiration timestamp

Token expires in 24 hours by default.

### Authentication Endpoints

#### Register New User

**POST** `/auth/register`

Creates a new user account with email, username, and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Email, username, and password are required",
  "details": [
    "Email is required",
    "Password is required"
  ]
}
```

**Error Response (400 Bad Request - Duplicate Email):**
```json
{
  "success": false,
  "error": "Email already registered"
}
```

#### User Login

**POST** `/auth/login`

Authenticates user credentials and returns JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user",
      "learning_style": "visual",
      "learning_pattern": "consistent"
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Email and password are required",
  "details": [
    "Email is required"
  ]
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

### Authentication Flow Example

1. **Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

2. **Login to get JWT token:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

3. **Use token for protected endpoints:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Notes

- Passwords are hashed using bcrypt with 10 salt rounds
- Default role is "user" if not specified during registration
- Admin role can be assigned during registration by setting `"role": "admin"`
- New users get default learning style "visual" and learning pattern "consistent"
- JWT tokens expire after 24 hours and need to be refreshed by logging in again

## Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "data": object | array | null,
  "error": string | null
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## User Management

The user management endpoints allow authenticated users to manage their profiles and profile pictures.

### Get User Profile

**GET** `/users/profile`

**Authentication Required:** Yes (JWT Token)

Retrieves the authenticated user's profile information including learning style, learning pattern, and profile picture URL.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user",
    "learning_style": "visual",
    "learning_pattern": "consistent",
    "profile_picture_url": "/api/users/profile/picture/1-1234567890.jpg"
  }
}
```

**Response (200 OK - No Profile Picture):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user",
    "learning_style": "visual",
    "learning_pattern": "consistent",
    "profile_picture_url": null
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "User not found"
}
```

### Upload Profile Picture

**POST** `/users/profile/picture`

**Authentication Required:** Yes (JWT Token)

Uploads or updates the authenticated user's profile picture. Accepts JPEG, PNG, GIF, and WebP image formats with a maximum file size of 5MB.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `profilePicture` (file) - Image file to upload

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "profile_picture_url": "/api/users/profile/picture/1-1234567890.jpg",
    "message": "Profile picture uploaded successfully"
  }
}
```

**Error Response (400 Bad Request - No File):**
```json
{
  "success": false,
  "error": "No file provided"
}
```

**Error Response (400 Bad Request - File Size Limit):**
```json
{
  "success": false,
  "error": "File size exceeds 5MB limit"
}
```

**Error Response (400 Bad Request - Invalid File Type):**
```json
{
  "success": false,
  "error": "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "User not found"
}
```

**Error Response (500 Internal Server Error - Storage Error):**
```json
{
  "success": false,
  "error": "Failed to upload image"
}
```

### Get Profile Picture

**GET** `/users/profile/picture/:filename`

**Authentication Required:** No

Serves uploaded profile picture files. The filename is typically returned in the profile picture URL from other endpoints.

**Request Parameters:**
- `filename` (string) - The filename of the profile picture (e.g., "1-1234567890.jpg")

**Response (200 OK):**
Returns the image file with appropriate content-type headers (image/jpeg, image/png, etc.)

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Image not found"
}
```

### User Management Examples

#### Complete Profile Management Flow

1. **Get current profile:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

2. **Upload a profile picture:**
```bash
curl -X POST http://localhost:3000/api/users/profile/picture \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "profilePicture=@/path/to/your/image.jpg"
```

3. **Access the uploaded profile picture:**
```bash
curl -X GET http://localhost:3000/api/users/profile/picture/1-1234567890.jpg
```

#### JavaScript/Fetch Example

```javascript
// Get user profile
const getProfile = async () => {
  const response = await fetch('/api/users/profile', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  return data;
};

// Upload profile picture
const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  
  const response = await fetch('/api/users/profile/picture', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  const data = await response.json();
  return data;
};
```

### Notes

- Profile pictures are automatically resized and optimized during upload
- Old profile pictures are automatically deleted when a new one is uploaded
- Profile picture URLs are relative and should be prefixed with the base URL for external access
- Supported image formats: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB
- Profile pictures are stored in the `uploads/profile-pictures/` directory
- Filename format: `{userId}-{timestamp}.{extension}`

## Tests

The test endpoints provide access to learning assessment tests. There are two types of tests available:
- **POLA Tests** - Learning pattern assessment tests that evaluate learning consistency, speed, reflection, and balance
- **GAYA Tests** - Learning style assessment tests that evaluate visual, auditory, and kinesthetic learning preferences

### Get All POLA Tests

**GET** `/tests/pola`

**Authentication Required:** No

Retrieves a list of all available POLA (learning pattern) tests.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Tes Pola Belajar Dasar"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid test type. Must be \"pola\" or \"gaya\""
}
```

### Get POLA Test by ID

**GET** `/tests/pola/:id`

**Authentication Required:** No

Retrieves a specific POLA test with all its questions and answer choices.

**Request Parameters:**
- `id` (integer) - The ID of the POLA test

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Tes Pola Belajar Dasar",
    "questions": [
      {
        "id": 1,
        "test_id": 1,
        "question": "Bagaimana Anda biasanya memulai belajar hal baru?",
        "choices": [
          {
            "id": 1,
            "soal_id": 1,
            "option_text": "Mulai dengan merencanakan langkah-langkah belajar",
            "bobot_consistent": 5,
            "bobot_fast": 1,
            "bobot_reflective": 3,
            "bobot_balanced": 4
          },
          {
            "id": 2,
            "soal_id": 1,
            "option_text": "Langsung mencoba tanpa banyak rencana",
            "bobot_consistent": 1,
            "bobot_fast": 5,
            "bobot_reflective": 2,
            "bobot_balanced": 3
          },
          {
            "id": 3,
            "soal_id": 1,
            "option_text": "Menganalisis dulu sebelum memulai",
            "bobot_consistent": 3,
            "bobot_fast": 1,
            "bobot_reflective": 5,
            "bobot_balanced": 4
          },
          {
            "id": 4,
            "soal_id": 1,
            "option_text": "Mengikuti alur secara fleksibel",
            "bobot_consistent": 3,
            "bobot_fast": 3,
            "bobot_reflective": 3,
            "bobot_balanced": 5
          }
        ]
      }
    ]
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Test not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid test type. Must be \"pola\" or \"gaya\""
}
```

### Get All GAYA Tests

**GET** `/tests/gaya`

**Authentication Required:** No

Retrieves a list of all available GAYA (learning style) tests.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Tes Gaya Belajar Dasar"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid test type. Must be \"pola\" or \"gaya\""
}
```

### Get GAYA Test by ID

**GET** `/tests/gaya/:id`

**Authentication Required:** No

Retrieves a specific GAYA test with all its questions and answer choices.

**Request Parameters:**
- `id` (integer) - The ID of the GAYA test

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Tes Gaya Belajar Dasar",
    "questions": [
      {
        "id": 1,
        "test_id": 1,
        "question": "Saat belajar, Anda paling terbantu oleh apa?",
        "choices": [
          {
            "id": 1,
            "soal_id": 1,
            "option_text": "Melihat gambar atau diagram",
            "bobot_visual": 5,
            "bobot_auditori": 1,
            "bobot_kinestetik": 1
          },
          {
            "id": 2,
            "soal_id": 1,
            "option_text": "Mendengarkan penjelasan",
            "bobot_visual": 1,
            "bobot_auditori": 5,
            "bobot_kinestetik": 1
          },
          {
            "id": 3,
            "soal_id": 1,
            "option_text": "Mencoba mempraktikkan langsung",
            "bobot_visual": 1,
            "bobot_auditori": 1,
            "bobot_kinestetik": 5
          }
        ]
      }
    ]
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Test not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid test type. Must be \"pola\" or \"gaya\""
}
```

### Test Structure and Format

#### POLA Test Structure
POLA tests assess learning patterns with four dimensions:
- **bobot_consistent** - Measures preference for consistent, structured learning
- **bobot_fast** - Measures preference for fast-paced learning
- **bobot_reflective** - Measures preference for reflective, thoughtful learning
- **bobot_balanced** - Measures preference for balanced learning approaches

#### GAYA Test Structure
GAYA tests assess learning styles with three dimensions:
- **bobot_visual** - Measures preference for visual learning (charts, diagrams, images)
- **bobot_auditori** - Measures preference for auditory learning (listening, discussion)
- **bobot_kinestetik** - Measures preference for kinesthetic learning (hands-on, movement)

#### Question Format
Each test contains multiple questions, and each question has multiple choice answers. Each choice has weighted scores for different learning dimensions that are used to calculate the final assessment results.

### Test Usage Examples

#### Get Available POLA Tests
```bash
curl -X GET http://localhost:3000/api/tests/pola
```

#### Get Specific POLA Test with Questions
```bash
curl -X GET http://localhost:3000/api/tests/pola/1
```

#### Get Available GAYA Tests
```bash
curl -X GET http://localhost:3000/api/tests/gaya
```

#### Get Specific GAYA Test with Questions
```bash
curl -X GET http://localhost:3000/api/tests/gaya/1
```

#### JavaScript/Fetch Example
```javascript
// Get all POLA tests
const getPolaTests = async () => {
  const response = await fetch('/api/tests/pola');
  const data = await response.json();
  return data;
};

// Get specific GAYA test with questions
const getGayaTest = async (testId) => {
  const response = await fetch(`/api/tests/gaya/${testId}`);
  const data = await response.json();
  return data;
};

// Example usage
const polaTests = await getPolaTests();
const gayaTest = await getGayaTest(1);
```

### Notes

- Test endpoints do not require authentication and are publicly accessible
- Tests are designed for educational assessment purposes
- Each choice in a question has weighted scores that contribute to the final learning assessment
- POLA tests focus on learning patterns and approaches
- GAYA tests focus on sensory learning preferences
- Test results should be submitted via the `/results` endpoints after completion

## Results

The results endpoints handle test answer submission and result retrieval. These endpoints allow users to submit their test answers and retrieve their test history and detailed results.

### Submit POLA Test Results

**POST** `/results/pola`

**Authentication Required:** Yes (JWT Token)

Submits answers for a POLA (learning pattern) test and calculates the user's learning pattern based on weighted scores.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "test_id": 1,
  "answers": [
    {
      "soal_id": 1,
      "pilihan_id": 3
    },
    {
      "soal_id": 2,
      "pilihan_id": 7
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "hasil_test_id": 15,
    "learning_pattern": "reflective",
    "weight_totals": {
      "consistent": 12,
      "fast": 8,
      "reflective": 18,
      "balanced": 14
    }
  }
}
```

**Error Response (400 Bad Request - Missing Fields):**
```json
{
  "success": false,
  "error": "test_id and answers array are required",
  "details": [
    "test_id is required",
    "answers must be an array"
  ]
}
```

**Error Response (400 Bad Request - Invalid Answer):**
```json
{
  "success": false,
  "error": "Each answer must have soal_id and pilihan_id"
}
```

**Error Response (400 Bad Request - Invalid Question):**
```json
{
  "success": false,
  "error": "Invalid soal_id 999 for test 1"
}
```

**Error Response (400 Bad Request - Invalid Choice):**
```json
{
  "success": false,
  "error": "Invalid pilihan_id 999 for soal 1"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

### Submit GAYA Test Results

**POST** `/results/gaya`

**Authentication Required:** Yes (JWT Token)

Submits answers for a GAYA (learning style) test and calculates the user's learning style based on weighted scores.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "test_id": 1,
  "answers": [
    {
      "soal_id": 1,
      "pilihan_id": 2
    },
    {
      "soal_id": 2,
      "pilihan_id": 5
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "hasil_test_id": 16,
    "learning_style": "auditori",
    "weight_totals": {
      "visual": 6,
      "auditori": 15,
      "kinestetik": 4
    }
  }
}
```

**Error Response (400 Bad Request - Missing Fields):**
```json
{
  "success": false,
  "error": "test_id and answers array are required",
  "details": [
    "answers array cannot be empty"
  ]
}
```

**Error Response (400 Bad Request - Invalid Answer):**
```json
{
  "success": false,
  "error": "Each answer must have soal_id and pilihan_id"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

### Get Test History

**GET** `/results/history`

**Authentication Required:** Yes (JWT Token)

Retrieves the authenticated user's complete test history, including both POLA and GAYA test results.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 16,
      "timestamp": "2024-01-15T10:30:00.000Z",
      "test_name": "Tes Gaya Belajar Dasar",
      "test_type": "gaya"
    },
    {
      "id": 15,
      "timestamp": "2024-01-15T09:15:00.000Z",
      "test_name": "Tes Pola Belajar Dasar",
      "test_type": "pola"
    }
  ]
}
```

**Response (200 OK - Empty History):**
```json
{
  "success": true,
  "data": []
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

### Get Test Result Details

**GET** `/results/:id`

**Authentication Required:** Yes (JWT Token)

Retrieves detailed information about a specific test result, including all answers and their weighted scores.

**Request Parameters:**
- `id` (integer) - The ID of the test result

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK - POLA Test Result):**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "user_id": 1,
    "test_type": "pola",
    "test_name": "Tes Pola Belajar Dasar",
    "timestamp": "2024-01-15T09:15:00.000Z",
    "answers": [
      {
        "id": 45,
        "soal_id": 1,
        "pilihan_id": 3,
        "bobot_consistent": 3,
        "bobot_fast": 1,
        "bobot_reflective": 5,
        "bobot_balanced": 4,
        "question": "Bagaimana Anda biasanya memulai belajar hal baru?",
        "option_text": "Menganalisis dulu sebelum memulai"
      },
      {
        "id": 46,
        "soal_id": 2,
        "pilihan_id": 7,
        "bobot_consistent": 4,
        "bobot_fast": 2,
        "bobot_reflective": 5,
        "bobot_balanced": 3,
        "question": "Ketika menghadapi masalah sulit, Anda cenderung?",
        "option_text": "Merenungkan berbagai solusi terlebih dahulu"
      }
    ]
  }
}
```

**Response (200 OK - GAYA Test Result):**
```json
{
  "success": true,
  "data": {
    "id": 16,
    "user_id": 1,
    "test_type": "gaya",
    "test_name": "Tes Gaya Belajar Dasar",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "answers": [
      {
        "id": 47,
        "soal_id": 1,
        "pilihan_id": 2,
        "bobot_visual": 1,
        "bobot_auditori": 5,
        "bobot_kinestetik": 1,
        "question": "Saat belajar, Anda paling terbantu oleh apa?",
        "option_text": "Mendengarkan penjelasan"
      },
      {
        "id": 48,
        "soal_id": 2,
        "pilihan_id": 5,
        "bobot_visual": 2,
        "bobot_auditori": 4,
        "bobot_kinestetik": 1,
        "question": "Cara terbaik untuk mengingat informasi bagi Anda adalah?",
        "option_text": "Mengulangi informasi secara verbal"
      }
    ]
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Test result not found"
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "error": "Access denied: This result belongs to another user"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

### Answer Submission and Result Retrieval Examples

#### Complete Test Flow Example

1. **Get available POLA tests:**
```bash
curl -X GET http://localhost:3000/api/tests/pola
```

2. **Get specific test with questions:**
```bash
curl -X GET http://localhost:3000/api/tests/pola/1
```

3. **Submit test answers:**
```bash
curl -X POST http://localhost:3000/api/results/pola \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "test_id": 1,
    "answers": [
      {"soal_id": 1, "pilihan_id": 3},
      {"soal_id": 2, "pilihan_id": 7}
    ]
  }'
```

4. **Get test history:**
```bash
curl -X GET http://localhost:3000/api/results/history \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

5. **Get detailed result:**
```bash
curl -X GET http://localhost:3000/api/results/15 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### JavaScript/Fetch Examples

```javascript
// Submit POLA test answers
const submitPolaTest = async (testId, answers) => {
  const response = await fetch('/api/results/pola', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      test_id: testId,
      answers: answers
    })
  });
  const data = await response.json();
  return data;
};

// Submit GAYA test answers
const submitGayaTest = async (testId, answers) => {
  const response = await fetch('/api/results/gaya', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      test_id: testId,
      answers: answers
    })
  });
  const data = await response.json();
  return data;
};

// Get test history
const getTestHistory = async () => {
  const response = await fetch('/api/results/history', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  return data;
};

// Get specific test result
const getTestResult = async (resultId) => {
  const response = await fetch(`/api/results/${resultId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  return data;
};

// Example usage
const answers = [
  { soal_id: 1, pilihan_id: 3 },
  { soal_id: 2, pilihan_id: 7 }
];

const result = await submitPolaTest(1, answers);
console.log('Learning pattern:', result.data.learning_pattern);

const history = await getTestHistory();
console.log('Test history:', history.data);

const detailedResult = await getTestResult(15);
console.log('Detailed result:', detailedResult.data);
```

### Result Processing and Learning Assessment

#### POLA Test Results
When POLA test answers are submitted:
- Each answer choice has weighted scores for four learning pattern dimensions:
  - **consistent** - Structured, methodical learning approach
  - **fast** - Quick, immediate learning approach  
  - **reflective** - Thoughtful, analytical learning approach
  - **balanced** - Flexible, adaptive learning approach
- The system calculates total weights for each dimension
- The user's learning pattern is updated to the dimension with the highest total weight
- Results include the calculated learning pattern and weight totals

#### GAYA Test Results
When GAYA test answers are submitted:
- Each answer choice has weighted scores for three learning style dimensions:
  - **visual** - Learning through seeing (charts, diagrams, images)
  - **auditori** - Learning through hearing (listening, discussion)
  - **kinestetik** - Learning through doing (hands-on, movement)
- The system calculates total weights for each dimension
- The user's learning style is updated to the dimension with the highest total weight
- Results include the calculated learning style and weight totals

### Notes

- All results endpoints require JWT authentication
- Test answers are validated against existing questions and choices before submission
- Answer submission uses database transactions to ensure data consistency
- Users can only access their own test results (authorization enforced)
- Learning patterns and styles are automatically updated in the user profile upon test completion
- Test history is ordered by timestamp (most recent first)
- Detailed results include the full question text and selected answer text for review

## Insights

The insights endpoints provide access to personalized learning insights and recommendations. Users can retrieve their insights, while administrators can create insights for any user.

### Get User Insights

**GET** `/insights`

**Authentication Required:** Yes (JWT Token)

Retrieves all insights for the authenticated user. Insights are personalized recommendations or observations about the user's learning patterns and styles.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 123,
      "insight": "Based on your reflective learning pattern, you benefit from taking time to analyze information before making decisions. Consider using mind maps and concept diagrams to organize your thoughts."
    },
    {
      "id": 2,
      "user_id": 123,
      "insight": "Your auditory learning style suggests you learn best through discussion and verbal explanation. Try joining study groups or explaining concepts out loud to reinforce learning."
    }
  ]
}
```

**Response (200 OK - No Insights):**
```json
{
  "success": true,
  "data": []
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

### Create Insight (Admin Only)

**POST** `/insights`

**Authentication Required:** Yes (JWT Token + Admin Role)

Creates a new insight for a specified user. This endpoint is restricted to administrators only.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 123,
  "insight": "Based on your recent test results showing a balanced learning pattern, you have the flexibility to adapt your learning approach based on the subject matter. For complex topics, try the reflective approach, and for practical skills, use the fast-paced method."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "user_id": 123,
    "insight": "Based on your recent test results showing a balanced learning pattern, you have the flexibility to adapt your learning approach based on the subject matter. For complex topics, try the reflective approach, and for practical skills, use the fast-paced method."
  }
}
```

**Error Response (400 Bad Request - Missing Fields):**
```json
{
  "success": false,
  "error": "user_id and insight are required",
  "details": [
    "user_id is required",
    "insight is required"
  ]
}
```

**Error Response (404 Not Found - Invalid User):**
```json
{
  "success": false,
  "error": "User not found"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**Error Response (403 Forbidden - Not Admin):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### Insight Structure and Examples

#### Insight Data Model
Each insight contains:
- **id** (integer) - Unique identifier for the insight
- **user_id** (integer) - ID of the user the insight belongs to
- **insight** (string) - The insight text content

#### Common Insight Types

**Learning Pattern Insights:**
- Recommendations based on consistent, fast, reflective, or balanced learning patterns
- Suggestions for study techniques that match the user's pattern
- Advice on when to use different learning approaches

**Learning Style Insights:**
- Recommendations based on visual, auditory, or kinesthetic learning preferences
- Suggestions for learning materials and methods
- Tips for optimizing learning based on sensory preferences

**Personalized Recommendations:**
- Study schedule suggestions based on learning patterns
- Resource recommendations (books, tools, techniques)
- Behavioral insights and improvement suggestions

### Insights Usage Examples

#### Get User's Insights
```bash
curl -X GET http://localhost:3000/api/insights \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Create Insight for User (Admin Only)
```bash
curl -X POST http://localhost:3000/api/insights \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "insight": "Your visual learning style combined with a reflective pattern suggests you would benefit from creating detailed visual summaries after each study session."
  }'
```

#### JavaScript/Fetch Examples

```javascript
// Get user insights
const getUserInsights = async () => {
  const response = await fetch('/api/insights', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  return data;
};

// Create insight for user (admin only)
const createInsight = async (userId, insightText) => {
  const response = await fetch('/api/insights', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId,
      insight: insightText
    })
  });
  const data = await response.json();
  return data;
};

// Example usage
const insights = await getUserInsights();
console.log('User insights:', insights.data);

// Admin creating insight
const newInsight = await createInsight(
  123, 
  "Consider using spaced repetition techniques to improve retention based on your learning pattern."
);
console.log('Created insight:', newInsight.data);
```

### Notes

- Only authenticated users can access insights endpoints
- Users can only retrieve their own insights
- Creating insights requires admin role privileges
- Insights are typically generated based on test results and learning assessments
- The insight text can contain personalized recommendations, study tips, or learning observations
- There is no limit on the number of insights a user can have
- Insights are stored permanently and can be used to track learning progress over time

## Admin

The admin endpoints provide administrative functions for managing test content. These endpoints are restricted to users with admin role and require both JWT authentication and admin privileges.

### Create POLA Question

**POST** `/admin/soal-pola`

**Authentication Required:** Yes (JWT Token + Admin Role)

Creates a new question for a POLA (learning pattern) test. This endpoint allows administrators to add questions to existing POLA tests.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "test_id": 1,
  "question": "Bagaimana Anda biasanya memulai belajar hal baru?"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "test_id": 1,
    "question": "Bagaimana Anda biasanya memulai belajar hal baru?"
  }
}
```

**Error Response (400 Bad Request - Missing Fields):**
```json
{
  "success": false,
  "error": "test_id and question are required",
  "details": [
    "test_id is required",
    "question is required"
  ]
}
```

**Error Response (404 Not Found - Invalid Test):**
```json
{
  "success": false,
  "error": "Test not found"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**Error Response (403 Forbidden - Not Admin):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### Create POLA Choice

**POST** `/admin/pilihan-pola`

**Authentication Required:** Yes (JWT Token + Admin Role)

Creates a new answer choice for a POLA question. Each choice includes weighted scores for the four learning pattern dimensions.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "soal_id": 15,
  "option_text": "Mulai dengan merencanakan langkah-langkah belajar",
  "bobot_consistent": 5,
  "bobot_fast": 1,
  "bobot_reflective": 3,
  "bobot_balanced": 4
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 45,
    "soal_id": 15,
    "option_text": "Mulai dengan merencanakan langkah-langkah belajar",
    "bobot_consistent": 5,
    "bobot_fast": 1,
    "bobot_reflective": 3,
    "bobot_balanced": 4
  }
}
```

**Error Response (400 Bad Request - Missing Fields):**
```json
{
  "success": false,
  "error": "soal_id, option_text, and all bobot values are required",
  "details": [
    "soal_id is required",
    "option_text is required",
    "bobot_consistent is required",
    "bobot_fast is required",
    "bobot_reflective is required",
    "bobot_balanced is required"
  ]
}
```

**Error Response (404 Not Found - Invalid Question):**
```json
{
  "success": false,
  "error": "Question not found"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**Error Response (403 Forbidden - Not Admin):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### Create GAYA Question

**POST** `/admin/soal-gaya`

**Authentication Required:** Yes (JWT Token + Admin Role)

Creates a new question for a GAYA (learning style) test. This endpoint allows administrators to add questions to existing GAYA tests.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "test_id": 1,
  "question": "Saat belajar, Anda paling terbantu oleh apa?"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 20,
    "test_id": 1,
    "question": "Saat belajar, Anda paling terbantu oleh apa?"
  }
}
```

**Error Response (400 Bad Request - Missing Fields):**
```json
{
  "success": false,
  "error": "test_id and question are required",
  "details": [
    "test_id is required",
    "question is required"
  ]
}
```

**Error Response (404 Not Found - Invalid Test):**
```json
{
  "success": false,
  "error": "Test not found"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**Error Response (403 Forbidden - Not Admin):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### Create GAYA Choice

**POST** `/admin/pilihan-gaya`

**Authentication Required:** Yes (JWT Token + Admin Role)

Creates a new answer choice for a GAYA question. Each choice includes weighted scores for the three learning style dimensions.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "soal_id": 20,
  "option_text": "Melihat gambar atau diagram",
  "bobot_visual": 5,
  "bobot_auditori": 1,
  "bobot_kinestetik": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 60,
    "soal_id": 20,
    "option_text": "Melihat gambar atau diagram",
    "bobot_visual": 5,
    "bobot_auditori": 1,
    "bobot_kinestetik": 1
  }
}
```

**Error Response (400 Bad Request - Missing Fields):**
```json
{
  "success": false,
  "error": "soal_id, option_text, and all bobot values are required",
  "details": [
    "soal_id is required",
    "option_text is required",
    "bobot_visual is required",
    "bobot_auditori is required",
    "bobot_kinestetik is required"
  ]
}
```

**Error Response (404 Not Found - Invalid Question):**
```json
{
  "success": false,
  "error": "Question not found"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**Error Response (403 Forbidden - Not Admin):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### Admin Test Management Examples

#### Complete Test Creation Flow

1. **Create a POLA question:**
```bash
curl -X POST http://localhost:3000/api/admin/soal-pola \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "test_id": 1,
    "question": "Bagaimana Anda biasanya memulai belajar hal baru?"
  }'
```

2. **Create choices for the POLA question:**
```bash
curl -X POST http://localhost:3000/api/admin/pilihan-pola \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "soal_id": 15,
    "option_text": "Mulai dengan merencanakan langkah-langkah belajar",
    "bobot_consistent": 5,
    "bobot_fast": 1,
    "bobot_reflective": 3,
    "bobot_balanced": 4
  }'
```

3. **Create a GAYA question:**
```bash
curl -X POST http://localhost:3000/api/admin/soal-gaya \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "test_id": 1,
    "question": "Saat belajar, Anda paling terbantu oleh apa?"
  }'
```

4. **Create choices for the GAYA question:**
```bash
curl -X POST http://localhost:3000/api/admin/pilihan-gaya \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "soal_id": 20,
    "option_text": "Melihat gambar atau diagram",
    "bobot_visual": 5,
    "bobot_auditori": 1,
    "bobot_kinestetik": 1
  }'
```

#### JavaScript/Fetch Examples

```javascript
// Create POLA question
const createPolaQuestion = async (testId, questionText) => {
  const response = await fetch('/api/admin/soal-pola', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      test_id: testId,
      question: questionText
    })
  });
  const data = await response.json();
  return data;
};

// Create POLA choice
const createPolaChoice = async (soalId, optionText, weights) => {
  const response = await fetch('/api/admin/pilihan-pola', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      soal_id: soalId,
      option_text: optionText,
      bobot_consistent: weights.consistent,
      bobot_fast: weights.fast,
      bobot_reflective: weights.reflective,
      bobot_balanced: weights.balanced
    })
  });
  const data = await response.json();
  return data;
};

// Create GAYA question
const createGayaQuestion = async (testId, questionText) => {
  const response = await fetch('/api/admin/soal-gaya', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      test_id: testId,
      question: questionText
    })
  });
  const data = await response.json();
  return data;
};

// Create GAYA choice
const createGayaChoice = async (soalId, optionText, weights) => {
  const response = await fetch('/api/admin/pilihan-gaya', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      soal_id: soalId,
      option_text: optionText,
      bobot_visual: weights.visual,
      bobot_auditori: weights.auditori,
      bobot_kinestetik: weights.kinestetik
    })
  });
  const data = await response.json();
  return data;
};

// Example usage
const question = await createPolaQuestion(1, "Bagaimana Anda biasanya memulai belajar hal baru?");
console.log('Created question:', question.data);

const choice = await createPolaChoice(
  question.data.id,
  "Mulai dengan merencanakan langkah-langkah belajar",
  {
    consistent: 5,
    fast: 1,
    reflective: 3,
    balanced: 4
  }
);
console.log('Created choice:', choice.data);
```

### Admin Content Management

#### POLA Test Content Management
Administrators can create questions and choices for POLA tests to assess learning patterns:
- **Questions** define the assessment scenarios or situations
- **Choices** provide response options with weighted scores for four learning pattern dimensions:
  - **bobot_consistent** - Weight for consistent/structured learning pattern
  - **bobot_fast** - Weight for fast-paced learning pattern
  - **bobot_reflective** - Weight for reflective/analytical learning pattern
  - **bobot_balanced** - Weight for balanced/flexible learning pattern

#### GAYA Test Content Management
Administrators can create questions and choices for GAYA tests to assess learning styles:
- **Questions** define learning scenarios or preferences
- **Choices** provide response options with weighted scores for three learning style dimensions:
  - **bobot_visual** - Weight for visual learning preference
  - **bobot_auditori** - Weight for auditory learning preference
  - **bobot_kinestetik** - Weight for kinesthetic/hands-on learning preference

#### Weight Scoring Guidelines
- Weights typically range from 1-5, where 5 indicates strong alignment with that learning dimension
- Each choice should have weights for all applicable dimensions
- The sum of weights across dimensions doesn't need to be equal, allowing for nuanced scoring
- Higher weights contribute more to the final learning assessment calculation

### Notes

- All admin endpoints require both JWT authentication and admin role privileges
- Questions must be associated with existing test IDs (test_pola or test_gaya)
- Choices must be associated with existing question IDs (soal_pola or soal_gaya)
- Weight values are required for all applicable learning dimensions
- Created questions and choices are immediately available for use in tests
- Admin endpoints use database transactions to ensure data consistency
- Input validation ensures all required fields are provided before database operations

## MOTD (Message of the Day)

The MOTD endpoints provide functionality for managing Message of the Day entries. These messages can be used to display announcements, updates, or important information to users. All authenticated users can retrieve MOTD entries, while only administrators can create, update, and delete them.

### Get All MOTD Entries

**GET** `/motd`

**Authentication Required:** Yes (JWT Token)

Retrieves all Message of the Day entries. This endpoint is accessible to all authenticated users.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "motd_id": 1,
      "message": "Welcome to the Learning Assessment Platform! Complete your learning style assessment to get personalized insights."
    },
    {
      "motd_id": 2,
      "message": "New POLA test questions have been added. Check out the updated learning pattern assessment."
    }
  ]
}
```

**Response (200 OK - No MOTD Entries):**
```json
{
  "success": true,
  "data": []
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

### Create MOTD Entry

**POST** `/motd`

**Authentication Required:** Yes (JWT Token + Admin Role)

Creates a new Message of the Day entry. This endpoint is restricted to administrators only.

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "System maintenance scheduled for tonight from 2 AM to 4 AM. Please save your progress before then."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "motd_id": 3,
    "message": "System maintenance scheduled for tonight from 2 AM to 4 AM. Please save your progress before then."
  }
}
```

**Error Response (400 Bad Request - Missing Message):**
```json
{
  "success": false,
  "error": "Message is required and cannot be empty or contain only whitespace"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**Error Response (403 Forbidden - Not Admin):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### Get MOTD Entry by ID

**GET** `/motd/:id`

**Authentication Required:** Yes (JWT Token + Admin Role)

Retrieves a specific Message of the Day entry by its ID. This endpoint is restricted to administrators only.

**Request Parameters:**
- `id` (integer) - The ID of the MOTD entry

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "motd_id": 1,
    "message": "Welcome to the Learning Assessment Platform! Complete your learning style assessment to get personalized insights."
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "MOTD entry not found"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**Error Response (403 Forbidden - Not Admin):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### Update MOTD Entry

**PUT** `/motd/:id`

**Authentication Required:** Yes (JWT Token + Admin Role)

Updates an existing Message of the Day entry. This endpoint is restricted to administrators only.

**Request Parameters:**
- `id` (integer) - The ID of the MOTD entry to update

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Updated: System maintenance has been rescheduled to tomorrow night from 2 AM to 4 AM."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "motd_id": 3,
    "message": "Updated: System maintenance has been rescheduled to tomorrow night from 2 AM to 4 AM."
  }
}
```

**Error Response (400 Bad Request - Missing Message):**
```json
{
  "success": false,
  "error": "Message is required and cannot be empty or contain only whitespace"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "MOTD entry not found"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**Error Response (403 Forbidden - Not Admin):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### Delete MOTD Entry

**DELETE** `/motd/:id`

**Authentication Required:** Yes (JWT Token + Admin Role)

Deletes a Message of the Day entry. This endpoint is restricted to administrators only.

**Request Parameters:**
- `id` (integer) - The ID of the MOTD entry to delete

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "MOTD deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "MOTD entry not found"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**Error Response (403 Forbidden - Not Admin):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### MOTD Management Examples

#### Complete MOTD Management Flow

1. **Get all MOTD entries (any authenticated user):**
```bash
curl -X GET http://localhost:3000/api/motd \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

2. **Create a new MOTD entry (admin only):**
```bash
curl -X POST http://localhost:3000/api/motd \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Welcome to our new learning assessment features!"
  }'
```

3. **Get specific MOTD entry by ID (admin only):**
```bash
curl -X GET http://localhost:3000/api/motd/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

4. **Update an existing MOTD entry (admin only):**
```bash
curl -X PUT http://localhost:3000/api/motd/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Updated welcome message with new features and improvements!"
  }'
```

5. **Delete an MOTD entry (admin only):**
```bash
curl -X DELETE http://localhost:3000/api/motd/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### JavaScript/Fetch Examples

```javascript
// Get all MOTD entries (any authenticated user)
const getAllMotd = async () => {
  const response = await fetch('/api/motd', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  return data;
};

// Create new MOTD entry (admin only)
const createMotd = async (message) => {
  const response = await fetch('/api/motd', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });
  const data = await response.json();
  return data;
};

// Get specific MOTD entry by ID (admin only)
const getMotdById = async (id) => {
  const response = await fetch(`/api/motd/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  return data;
};

// Update MOTD entry (admin only)
const updateMotd = async (id, message) => {
  const response = await fetch(`/api/motd/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });
  const data = await response.json();
  return data;
};

// Delete MOTD entry (admin only)
const deleteMotd = async (id) => {
  const response = await fetch(`/api/motd/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  return data;
};

// Example usage
const motdEntries = await getAllMotd();
console.log('All MOTD entries:', motdEntries.data);

// Admin creating new MOTD
const newMotd = await createMotd("Welcome to our updated learning platform!");
console.log('Created MOTD:', newMotd.data);

// Admin updating MOTD
const updatedMotd = await updateMotd(1, "Updated welcome message!");
console.log('Updated MOTD:', updatedMotd.data);

// Admin deleting MOTD
const deleteResult = await deleteMotd(1);
console.log('Delete result:', deleteResult.message);
```

### MOTD Data Structure

#### MOTD Entry Format
Each MOTD entry contains:
- **motd_id** (integer) - Unique identifier for the MOTD entry
- **message** (string) - The message content to be displayed

#### Message Validation
- Messages cannot be empty or contain only whitespace
- Messages are stored as provided (no automatic formatting or truncation)
- There is no explicit length limit, but reasonable message lengths are recommended for display purposes

### Common Use Cases

#### Announcements and Updates
- System maintenance notifications
- New feature announcements
- Important policy updates
- Seasonal greetings or motivational messages

#### User Communication
- Welcome messages for new users
- Instructions for using new features
- Reminders about important deadlines
- Tips for better learning assessment results

#### Administrative Messages
- Temporary service disruptions
- Contact information updates
- Support availability changes
- Platform usage guidelines

### Notes

- All MOTD endpoints require JWT authentication
- Only the GET `/motd` endpoint is accessible to regular users
- All other MOTD endpoints (POST, GET by ID, PUT, DELETE) require admin role privileges
- MOTD entries are returned in the order they exist in the database
- Messages are validated to prevent empty or whitespace-only content
- MOTD entries can be used by frontend applications to display dynamic announcements
- There is no built-in expiration mechanism for MOTD entries - they persist until manually deleted
- Consider implementing a frontend caching strategy for MOTD entries to improve performance

## Error Handling

The Learning Assessment API uses standard HTTP status codes to indicate the success or failure of requests. All error responses follow a consistent format to provide clear information about what went wrong.

### HTTP Status Codes

The API uses the following HTTP status codes:

| Status Code | Description | When Used |
|-------------|-------------|-----------|
| **200** | OK | Successful GET, PUT, DELETE requests |
| **201** | Created | Successful POST requests that create new resources |
| **400** | Bad Request | Invalid request data, missing required fields, validation errors |
| **401** | Unauthorized | Missing or invalid authentication token |
| **403** | Forbidden | Valid token but insufficient permissions (e.g., admin role required) |
| **404** | Not Found | Requested resource does not exist |
| **500** | Internal Server Error | Unexpected server errors, database connection issues |

### Error Response Format

All error responses follow this consistent structure:

```json
{
  "success": false,
  "error": "Primary error message",
  "details": ["Optional array of detailed error messages"]
}
```

#### Error Response Fields

- **success** (boolean) - Always `false` for error responses
- **error** (string) - Primary error message describing what went wrong
- **details** (array, optional) - Additional detailed error messages, typically used for validation errors

### Authentication Errors

#### Missing Token (401 Unauthorized)
When no JWT token is provided in the Authorization header:

**Request:**
```bash
curl -X GET http://localhost:3000/api/users/profile
```

**Response (401):**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

#### Invalid Token (401 Unauthorized)
When an invalid or expired JWT token is provided:

**Request:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer invalid_token_here"
```

**Response (401):**
```json
{
  "success": false,
  "error": "Invalid token."
}
```

#### Insufficient Permissions (403 Forbidden)
When a valid token is provided but the user lacks required permissions:

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/soal-pola \
  -H "Authorization: Bearer valid_user_token_but_not_admin" \
  -H "Content-Type: application/json" \
  -d '{"test_id": 1, "question": "Test question"}'
```

**Response (403):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### Validation Errors

#### Missing Required Fields (400 Bad Request)
When required fields are missing from the request:

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Response (400):**
```json
{
  "success": false,
  "error": "Email, username, and password are required",
  "details": [
    "Username is required",
    "Password is required"
  ]
}
```

#### Invalid Data Format (400 Bad Request)
When provided data doesn't meet validation requirements:

**Request:**
```bash
curl -X POST http://localhost:3000/api/results/pola \
  -H "Authorization: Bearer valid_token" \
  -H "Content-Type: application/json" \
  -d '{"test_id": "invalid", "answers": "not_an_array"}'
```

**Response (400):**
```json
{
  "success": false,
  "error": "test_id and answers array are required",
  "details": [
    "test_id must be a number",
    "answers must be an array"
  ]
}
```

#### Duplicate Resource (400 Bad Request)
When attempting to create a resource that already exists:

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing@example.com",
    "username": "newuser",
    "password": "password123"
  }'
```

**Response (400):**
```json
{
  "success": false,
  "error": "Email already registered"
}
```

### Resource Not Found Errors

#### Invalid Resource ID (404 Not Found)
When requesting a resource that doesn't exist:

**Request:**
```bash
curl -X GET http://localhost:3000/api/tests/pola/999
```

**Response (404):**
```json
{
  "success": false,
  "error": "Test not found"
}
```

#### User-Specific Resource Access (404 Not Found)
When a user tries to access a resource that doesn't belong to them:

**Request:**
```bash
curl -X GET http://localhost:3000/api/results/999 \
  -H "Authorization: Bearer valid_token"
```

**Response (404):**
```json
{
  "success": false,
  "error": "Test result not found"
}
```

### File Upload Errors

#### File Size Limit Exceeded (400 Bad Request)
When uploaded file exceeds the size limit:

**Request:**
```bash
curl -X POST http://localhost:3000/api/users/profile/picture \
  -H "Authorization: Bearer valid_token" \
  -F "profilePicture=@large_file.jpg"
```

**Response (400):**
```json
{
  "success": false,
  "error": "File size exceeds 5MB limit"
}
```

#### Invalid File Type (400 Bad Request)
When uploaded file type is not supported:

**Request:**
```bash
curl -X POST http://localhost:3000/api/users/profile/picture \
  -H "Authorization: Bearer valid_token" \
  -F "profilePicture=@document.pdf"
```

**Response (400):**
```json
{
  "success": false,
  "error": "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed"
}
```

### Server Errors

#### Database Connection Error (500 Internal Server Error)
When the server cannot connect to the database:

**Response (500):**
```json
{
  "success": false,
  "error": "Database connection failed"
}
```

#### File System Error (500 Internal Server Error)
When file operations fail on the server:

**Response (500):**
```json
{
  "success": false,
  "error": "Failed to upload image"
}
```

### Error Handling Best Practices

#### Client-Side Error Handling
When consuming the API, always check the `success` field in responses:

```javascript
const response = await fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();

if (!data.success) {
  // Handle error
  console.error('API Error:', data.error);
  if (data.details) {
    console.error('Details:', data.details);
  }
  
  // Handle specific error types
  if (response.status === 401) {
    // Redirect to login
    window.location.href = '/login';
  } else if (response.status === 403) {
    // Show permission denied message
    alert('You do not have permission to perform this action');
  }
} else {
  // Handle successful response
  console.log('Success:', data.data);
}
```

#### Common Error Scenarios

1. **Token Expiration**: JWT tokens expire after 24 hours. Implement token refresh or redirect to login.

2. **Network Issues**: Handle network connectivity problems with appropriate retry logic.

3. **Validation Errors**: Display field-specific error messages to help users correct their input.

4. **Permission Errors**: Provide clear feedback when users lack necessary permissions.

5. **Resource Not Found**: Handle cases where requested resources don't exist or have been deleted.

#### Error Response Examples by Endpoint

**Authentication Endpoints:**
- `400` - Missing email/password, invalid credentials format
- `401` - Invalid login credentials
- `409` - Email already registered (treated as 400 in current implementation)

**User Management Endpoints:**
- `401` - Missing or invalid token
- `404` - User not found, profile picture not found
- `400` - Invalid file upload, missing required fields

**Test Endpoints:**
- `404` - Test not found
- `400` - Invalid test type parameter

**Results Endpoints:**
- `401` - Missing or invalid token
- `400` - Invalid answer format, missing required fields
- `404` - Test result not found
- `403` - Accessing another user's results

**Admin Endpoints:**
- `401` - Missing or invalid token
- `403` - Non-admin user attempting admin operations
- `400` - Missing required fields, invalid data format
- `404` - Referenced resources not found

**MOTD Endpoints:**
- `401` - Missing or invalid token
- `403` - Non-admin user attempting admin operations (except GET /motd)
- `400` - Empty or whitespace-only message
- `404` - MOTD entry not found

### Notes

- All endpoints return JSON responses, even for errors
- Error messages are designed to be user-friendly while providing sufficient detail for debugging
- The `details` array is primarily used for validation errors to specify which fields are problematic
- Server errors (5xx) typically indicate issues that should be reported to system administrators
- Client errors (4xx) indicate issues with the request that the client can potentially fix

---

*This documentation covers all available endpoints with detailed examples and usage instructions. Each section provides comprehensive information about request/response formats, authentication requirements, and example usage.*