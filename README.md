# NEXORA

A mobile-first personal action workspace. The first MVP lets a user sign in with Google and create, complete, filter, and delete personal tasks that sync through Firebase Cloud Firestore.

## Stack

- Vite + vanilla JavaScript
- Firebase Authentication (Google provider)
- Cloud Firestore
- Firebase Hosting

## Firebase setup

In Firebase Console, open project **nexora-514918**.

1. Go to Project settings → General → Your apps → NEXORA Web.
2. Copy the web app configuration values.
3. In Authentication → Sign-in method, ensure Google is enabled and a support email is selected.
4. In Authentication → Settings → Authorized domains, add the hosting domain if it is not already listed.
5. In Firestore → Rules, publish the rules in `firestore.rules`. They restrict each signed-in user to their own `users/{uid}` document and subcollections.

## Configure environment

Copy `.env.example` to `.env.local` and replace placeholders with values from the Firebase web app config:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

Do not commit `.env.local`. Firebase web configuration is designed to be used by client apps; security is enforced by Firebase Security Rules. Never put service-account keys or private server secrets in Vite variables.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev -- --host 0.0.0.0
```

## Build and deploy

```bash
npm run build
npm install -g firebase-tools
firebase login
firebase use nexora-514918
firebase deploy --only hosting
```

Firebase Hosting prints the public URL after deployment.

## MVP scope

- Google sign-in
- Private per-user task list
- Add, complete, filter, and delete tasks
- Responsive mobile-first interface

AI features, payments, public profiles, and collaboration are intentionally not included in this first milestone. Validate the core workflow with users before expanding.
