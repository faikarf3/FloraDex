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

3. **Populate Environment Variables**
   - Duplicate `.env` to `.env.local` (already gitignored) and update the values there
   - Paste the Firebase config values into the matching `EXPO_PUBLIC_FIREBASE_*` keys
   - Share the `.env.local` contents securely with the team (never commit it)

4. **Enable Email/Password Authentication**
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Save the changes

5. **Enable Google Authentication**
   - In the same Sign-in method screen, enable the **Google** provider
   - Complete the OAuth consent screen (name, support email, scopes) and add everyone’s Google account under **Test users** until you publish
   - In Google Cloud Console > Credentials, edit the **Web** client and add these:
     - Authorized JavaScript origins: your Expo web URL (e.g. `http://localhost:19006`) and any deployed domains
     - Authorized redirect URIs: `https://floradex-1d428.firebaseapp.com/__/auth/handler` and `https://auth.expo.io/FloraDex/FloraDex`
   - Create native iOS / Android OAuth clients if you want to avoid the Expo proxy and drop the IDs into:
     - `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` (Optional for now)
     - `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` ((Optional for now))
   - Always keep `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` populated; it is required on every platform

   > Replace `YOUR_EXPO_USERNAME` with the Expo account/slug defined in `app.json` under `expo.slug`.

6. **Install Dependencies & Test the App**
   - Run `npm install` (first time only) and then `npm start` or `expo start`
   - Test email/password sign up + sign in, and verify Google Sign-In on the platforms you target

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
