AgriFuel Nexus - Mobile App

The AgriFuel Nexus Mobile App brings the power of our platform directly to the farmer's pocket. It features offline support, an AI field scanner using the native camera, a secure B2B marketplace, and full multilingual support (English, Hindi, Bengali, Marathi, Punjabi, Haryanvi).
🛠 Tech Stack

    Framework: React Native

    Toolkit: Expo (Expo Router for navigation)

    Styling: TailwindCSS (via NativeWind) / StyleSheet

    Icons: Lucide React Native

    Storage: AsyncStorage

    Hardware Access: expo-camera, expo-location, expo-speech

⚙️ Prerequisites

    Node.js (v18 or higher)

    Expo CLI (npm install -g expo-cli)

    Expo Go app installed on your physical iOS/Android device, or an iOS Simulator / Android Emulator running on your machine.

🚀 Local Setup Instructions

    Navigate to the mobile-app directory:
    Bash

    cd mobile-app

    Install dependencies:
    Bash

    npm install

    Configure Environment Variables:
    Create a .env file in the root of the mobile-app folder. Note: To test on a physical device, you must use your computer's local IP address instead of localhost.
    Code snippet

    EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:8000
    EXPO_PUBLIC_AI_URL=http://<YOUR_LOCAL_IP>:5000

    Start the Expo Development Server:
    Bash

    npx expo start -c

    (The -c flag clears the cache, which is highly recommended when adding new files or updating routes).

    Run on Device:

        Scan the QR code shown in your terminal using the Expo Go app on your phone.

        Press a to open in Android Emulator, or i to open in iOS Simulator.