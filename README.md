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

## Firebase configuration

The Firebase web app settings are stored in `src/firebase-config.js` and imported by the client. Firebase web configuration (including the API key) identifies the project; it is not a service-account credential. Never add service-account JSON, private keys, or server secrets to this repository.

Before launch:
1. In Firebase Console → Authentication → Sign-in method, confirm Google is enabled and a support email is selected.
2. In Authentication → Settings → Authorized domains, confirm the deployed `web.app` and `firebaseapp.com` domains are authorized.
3. In Firestore → Rules, publish the rules in `firestore.rules`. They restrict each signed-in user to their own user document and tasks subcollection.
4. In Google Cloud Console, restrict the Firebase API key to the APIs and web referrers required by this app once the production domain is known.

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
