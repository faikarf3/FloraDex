# Firebase Authentication Setup

This project includes a simple login page and dashboard for testing Firebase authentication.

## Setup Instructions

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication in the Firebase console

2. **Configure Firebase**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Add a new app (Web app)
   - Copy the Firebase configuration object

3. **Update Firebase Config**
   - Open `config/firebase.ts`
   - Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyBthQKqbpFXwNbNV-OEwYCVbZN0703JWec",
  authDomain: "floradex-1d428.firebaseapp.com",
  projectId: "floradex-1d428",
  storageBucket: "floradex-1d428.firebasestorage.app",
  messagingSenderId: "927875530261",
  appId: "1:927875530261:web:a4688b260c9c51df19d81c",
  measurementId: "G-KFFFK7NZF5"
};
```

4. **Enable Email/Password Authentication**
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Save the changes

5. **Test the App**
   - Run `npm start` or `expo start`
   - Try creating a new account with email/password
   - Test logging in and out

## Features

- **Login Screen**: Email/password authentication with sign up and sign in
- **Dashboard Screen**: Shows user information and basic app features
- **Authentication Context**: Manages auth state across the app
- **Persistent Login**: Users stay logged in between app sessions

## File Structure

```
FloraDex/
├── config/
│   └── firebase.ts          # Firebase configuration
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── components/
│   ├── AuthWrapper.tsx      # Main auth wrapper component
│   ├── LoginScreen.tsx      # Login/signup screen
│   └── DashboardScreen.tsx  # Dashboard screen
└── app/(tabs)/
    └── index.tsx            # Main app entry point
```

## Next Steps

Once authentication is working, you can:
- Add more user profile fields
- Implement password reset functionality
- Add social authentication (Google, Facebook, etc.)
- Create more dashboard features
- Add protected routes
