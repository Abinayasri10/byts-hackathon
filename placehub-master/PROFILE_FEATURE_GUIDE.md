# Profile Feature Implementation Guide

## Overview
Complete profile management system with full CRUD operations, validation, and backend persistence to MongoDB.

## Architecture

### Frontend Components

#### 1. ProfilePage.jsx
- **Purpose**: Display user's complete read-only profile
- **Route**: `/profile`
- **Features**:
  - Avatar with first-letter display and theme colors
  - Conditional rendering (shows "+Add" buttons when data is missing)
  - Edit button to navigate to `/edit-profile`
  - Profile sections: Personal Info, Academic Details, Current Work, Skills, Social Links
  - Loading and error states
  - Auto-fetches from `/api/profile` endpoint

#### 2. EditProfilePage.jsx
- **Purpose**: Allow users to edit all profile fields
- **Route**: `/edit-profile`
- **Features**:
  - Form validation on frontend (email, phone, URL, name length, batch year, skills count)
  - Skills tag management (add on Enter, remove with X button)
  - Mentor preference toggle switch
  - Loading state while fetching current profile
  - Saving state while submitting changes
  - Error display with field-specific validation messages
  - Success notification with 2-second delay before redirect
  - Auto-fetches current profile data on load
  - Submits via PUT to `/api/profile`
  - Updates localStorage with new profile data for Navbar sync

#### 3. Navbar.jsx
- **Feature**: Displays work status from localStorage
- **Display**: Shows "Working at [Company]" if role and company exist
- **Updates**: Immediately reflects changes when localStorage is updated

### Backend Components

#### 1. profileController.js
- **Validation System**:
  - Email: Regex pattern validation
  - Phone: 10-digit validation
  - URLs: URL constructor validation
  - Full Name: 2-100 characters
  - Roll Number: Minimum 3 characters
  - Batch Year: 2000 to (currentYear + 10)
  - Skills: 1-20 items array

- **Endpoints**:
  - `POST /api/profile` - Create profile (requires: fullName, rollNumber, collegeEmail, branch, year, batch)
  - `GET /api/profile` - Retrieve current user's profile
  - `PUT /api/profile` - Update profile with validation

- **Error Handling**:
  - Returns 400 with `{ success: false, errors: { field: message } }` on validation failure
  - Returns 404 if profile not found
  - Returns 500 on server errors

#### 2. Profile.js (MongoDB Schema)
- **Fields**:
  - userId (required, unique reference to User)
  - fullName, rollNumber, collegeEmail, whatsappNumber
  - year, branch, batch
  - skills (array)
  - linkedinUrl, githubUrl, profilePicture
  - placementStatus (enum: 'placed', 'not-placed')
  - company, role
  - internshipType (enum: 'internship', 'full-time')
  - willingToMentor (boolean)
  - createdAt, updatedAt (timestamps)

#### 3. profileRoutes.js
```javascript
router.post('/', authenticate, createProfile)   // Create
router.get('/', authenticate, getProfile)       // Read
router.put('/', authenticate, updateProfile)    // Update
```

## Data Flow

### Edit Profile Workflow
1. **Load Page**
   - User navigates to `/edit-profile`
   - EditProfilePage fetches current profile via GET `/api/profile`
   - Form fields populated with current data
   - Loading spinner shows until data arrives

2. **User Edits**
   - Form updates state in real-time
   - No validation until submit
   - Skills can be added/removed individually
   - Mentor toggle works independently

3. **Submit Form**
   - Frontend validates all fields
   - Sends PUT request with formData to `/api/profile`
   - Includes Bearer token in Authorization header

4. **Backend Processing**
   - authMiddleware validates JWT token
   - profileController validates each field
   - If validation fails: returns 400 with field-specific errors
   - If validation passes: updates MongoDB Profile document
   - Returns 200 with updated profile object

5. **Frontend Response**
   - If error: displays field-specific error messages
   - If success:
     - Updates localStorage with new profile data (fullName, role, company)
     - Shows success notification
     - After 2 seconds, redirects to `/profile`
     - Navbar automatically updates with new work status

## Validation Rules

### Frontend (EditProfilePage.jsx)
- **Email**: Must match pattern `user@domain.com`
- **Phone**: Must be exactly 10 digits
- **URLs**: Must be valid URL format (LinkedIn, GitHub)
- **Full Name**: 2-100 characters, trimmed
- **Batch Year**: Between 2000 and (currentYear + 10)
- **Skills**: 1-20 items, no duplicates

### Backend (profileController.js)
- Same validation rules as frontend
- Additional security: Only allows specific fields to be updated
- Prevents direct modification of userId and timestamps

## localStorage Synchronization

**User Data Structure:**
```javascript
localStorage.setItem('user', JSON.stringify({
  fullName: "User Name",
  role: "Software Engineer",
  company: "Tech Company",
  // ... other user data
}))
```

**When Profile Updates:**
1. EditProfilePage saves changes to backend
2. Backend updates MongoDB
3. Frontend updates localStorage with new profile data
4. Navbar hooks detect localStorage change
5. Navbar re-renders with new work status automatically

## Testing the Workflow

### Prerequisites
- Backend server running on `http://localhost:5000`
- MongoDB connected and configured
- User logged in (authToken in localStorage)

### Manual Test Steps
1. Navigate to `/profile` and view current profile
2. Click "Edit Profile" button
3. Modify any field (e.g., company name, role)
4. Add a new skill by typing and pressing Enter
5. Click "Save Changes"
6. Should see success message
7. Automatically redirected to `/profile`
8. Updated profile should display
9. Check Navbar - work status should update immediately

### Verify Database Changes
```bash
# Check MongoDB
db.profiles.findOne({ userId: ObjectId(...) })
# Should show updated fields
```

## Error Handling Examples

### Invalid Email
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "collegeEmail": "Invalid email format"
  }
}
```

### Multiple Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fullName": "Full name must be between 2 and 100 characters",
    "whatsappNumber": "Phone number must be 10 digits",
    "batch": "Batch year must be between 2000 and 2034"
  }
}
```

### Profile Not Found
```json
{
  "success": false,
  "message": "Profile not found"
}
```

## Security Considerations

1. **Authentication**: All endpoints require valid JWT token
2. **Field Filtering**: Backend only updates allowed fields (prevents userId modification)
3. **Validation**: Backend validates all incoming data (prevents invalid data in DB)
4. **Authorization**: authMiddleware ensures user can only access/modify their own profile
5. **Error Messages**: Specific errors help users but don't leak sensitive information

## Future Enhancements

- [ ] File upload for profile pictures (currently URL-only)
- [ ] Image preview before saving
- [ ] Real-time field validation as user types
- [ ] Profile completion percentage indicator
- [ ] Undo/Reset button functionality
- [ ] Batch edit history/audit trail
- [ ] Profile visibility/privacy settings
- [ ] Export profile as PDF
- [ ] Profile search/discovery by skills
- [ ] Suggested connections based on profile

## File Structure

```
frontend/src/pages/
  ├── ProfilePage.jsx           # Read-only profile display
  └── EditProfilePage.jsx       # Edit profile form

backend/
  ├── controllers/
  │   └── profileController.js  # Validation & CRUD logic
  ├── models/
  │   └── Profile.js           # MongoDB schema
  ├── routes/
  │   └── profileRoutes.js      # API endpoints
  └── server.js                 # Main server file
```

## Quick Reference

### API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/profile` | Yes | Create new profile |
| GET | `/api/profile` | Yes | Get current user's profile |
| PUT | `/api/profile` | Yes | Update current user's profile |

### Form Fields
- fullName, rollNumber, collegeEmail, whatsappNumber
- year, branch, batch
- role, company, internshipType
- linkedinUrl, githubUrl
- skills (array), willingToMentor (boolean)

### Key Functions
- `fetchProfile()` - Load profile from backend
- `handleChange()` - Update form field
- `handleSkillChange()` - Add skill on Enter
- `removeSkill()` - Remove skill by index
- `handleSubmit()` - Submit form to backend
