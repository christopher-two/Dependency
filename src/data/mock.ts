import type { MatrixData } from '../types';

export const MOCK_DATA: MatrixData = {
    metadata: {
        lastUpdated: "2024-05-20",
        kotlinVersion: "1.9.23"
    },
    categories: [
        { id: "ui", name: "UI & Design System" },
        { id: "nav", name: "Navigation & Architecture" },
        { id: "data", name: "Data, Network & Auth" },
        { id: "di", name: "Dependency Injection" },
        { id: "google", name: "Google & Firebase" },
        { id: "core", name: "Core & Kotlin X" }
    ],
    artifacts: [
        // --- UI & DESIGN SYSTEM ---
        {
            id: "coil-compose",
            name: "Coil 3 (Compose)",
            category: "ui",
            version: "3.3.0",
            coordinates: { group: "io.coil-kt.coil3", artifact: "coil-compose" },
            type: "library"
        },
        {
            id: "coil-network",
            name: "Coil 3 (OkHttp)",
            category: "ui",
            version: "3.3.0",
            coordinates: { group: "io.coil-kt.coil3", artifact: "coil-network-okhttp" },
            type: "library"
        },
        {
            id: "material-kolor",
            name: "Material Kolor (Dynamic Theme)",
            category: "ui",
            version: "4.0.4",
            coordinates: { group: "com.materialkolor", artifact: "material-kolor" },
            type: "library"
        },
        {
            id: "compose-icons-fa",
            name: "Compose Icons (FontAwesome)",
            category: "ui",
            version: "1.1.1",
            coordinates: { group: "br.com.devsrsouza.compose.icons", artifact: "font-awesome" },
            type: "library"
        },
        {
            id: "material-icons-ext",
            name: "Material Icons Extended",
            category: "ui",
            version: "1.7.8",
            coordinates: { group: "androidx.compose.material", artifact: "material-icons-extended" },
            type: "library"
        },
        {
            id: "core-splashscreen",
            name: "Core Splashscreen",
            category: "ui",
            version: "1.2.0",
            coordinates: { group: "androidx.core", artifact: "core-splashscreen" },
            type: "library"
        },
        {
            id: "qrose",
            name: "QRose (QR Scanner)",
            category: "ui",
            version: "1.0.1",
            coordinates: { group: "io.github.alexzhirkevich", artifact: "qrose" },
            type: "library"
        },
        {
            id: "richtext-ui",
            name: "Compose RichText UI",
            category: "ui",
            version: "1.0.0-alpha03",
            coordinates: { group: "com.halilibo.compose-richtext", artifact: "richtext-ui" },
            type: "library"
        },
        {
            id: "richtext-ui-m3",
            name: "Compose RichText M3",
            category: "ui",
            version: "0.20.0",
            coordinates: { group: "com.halilibo.compose-richtext", artifact: "richtext-ui-material3" },
            type: "library"
        },
        {
            id: "compose-qr-code",
            name: "Compose QR Code",
            category: "ui",
            version: "1.0.1",
            coordinates: { group: "com.lightspark", artifact: "compose-qr-code" },
            type: "library"
        },
        {
            id: "accompanist-permissions",
            name: "Accompanist Permissions",
            category: "ui",
            version: "0.37.3",
            coordinates: { group: "com.google.accompanist", artifact: "accompanist-permissions" },
            type: "library"
        },

        // --- NAVIGATION & ARCH ---
        {
            id: "nav-compose",
            name: "Navigation Compose",
            category: "nav",
            version: "2.9.6",
            coordinates: { group: "androidx.navigation", artifact: "navigation-compose" },
            type: "library"
        },

        // --- DI (Koin) ---
        {
            id: "koin-bom",
            name: "Koin BOM",
            category: "di",
            version: "4.1.1",
            coordinates: { group: "io.insert-koin", artifact: "koin-bom" },
            type: "library"
        },
        {
            id: "koin-android",
            name: "Koin Android",
            category: "di",
            version: "4.1.1",
            coordinates: { group: "io.insert-koin", artifact: "koin-android" },
            type: "library",
            bomRef: "koin-bom"
        },
        {
            id: "koin-compose",
            name: "Koin Compose",
            category: "di",
            version: "4.1.1",
            coordinates: { group: "io.insert-koin", artifact: "koin-androidx-compose" },
            type: "library",
            bomRef: "koin-bom"
        },

        // --- GOOGLE & FIREBASE ---
        {
            id: "firebase-bom",
            name: "Firebase BOM",
            category: "google",
            version: "34.6.0",
            coordinates: { group: "com.google.firebase", artifact: "firebase-bom" },
            type: "library"
        },
        {
            id: "firebase-auth",
            name: "Firebase Auth",
            category: "google",
            version: "34.6.0",
            coordinates: { group: "com.google.firebase", artifact: "firebase-auth" },
            type: "library",
            bomRef: "firebase-bom"
        },
        {
            id: "firebase-firestore",
            name: "Firebase Firestore",
            category: "google",
            version: "34.6.0",
            coordinates: { group: "com.google.firebase", artifact: "firebase-firestore" },
            type: "library",
            bomRef: "firebase-bom"
        },
        {
            id: "firebase-ai",
            name: "Firebase AI",
            category: "google",
            version: "34.6.0",
            coordinates: { group: "com.google.firebase", artifact: "firebase-ai" },
            type: "library",
            bomRef: "firebase-bom"
        },
        {
            id: "gms-auth",
            name: "Play Services Auth",
            category: "google",
            version: "21.4.0",
            coordinates: { group: "com.google.android.gms", artifact: "play-services-auth" },
            type: "library"
        },
        {
            id: "cred-play-services",
            name: "Credentials (Play Services)",
            category: "google",
            version: "1.5.0",
            coordinates: { group: "androidx.credentials", artifact: "credentials-play-services-auth" },
            type: "library"
        },
        {
            id: "credentials",
            name: "Credentials API",
            category: "google",
            version: "1.5.0",
            coordinates: { group: "androidx.credentials", artifact: "credentials" },
            type: "library"
        },
        {
            id: "gms-plugin",
            name: "Google Services Plugin",
            category: "google",
            version: "4.4.4",
            coordinates: { group: "com.google.gms", artifact: "google-services" },
            type: "plugin"
        },

        // --- CORE & DATA ---
        {
            id: "datastore-pref",
            name: "DataStore Preferences",
            category: "data",
            version: "1.2.0",
            coordinates: { group: "androidx.datastore", artifact: "datastore-preferences" },
            type: "library"
        },
        {
            id: "datastore-pref-core",
            name: "DataStore Preferences Core",
            category: "data",
            version: "1.2.0",
            coordinates: { group: "androidx.datastore", artifact: "datastore-preferences-core" },
            type: "library"
        },
        {
            id: "kotlinx-datetime",
            name: "KotlinX DateTime",
            category: "core",
            version: "0.7.1",
            coordinates: { group: "org.jetbrains.kotlinx", artifact: "kotlinx-datetime" },
            type: "library"
        },
        {
            id: "kotlinx-serialization",
            name: "KotlinX Serialization JSON",
            category: "core",
            version: "1.9.0", // Versión de la librería
            coordinates: { group: "org.jetbrains.kotlinx", artifact: "kotlinx-serialization-json" },
            type: "library"
        },
        {
            id: "kotlinx-coroutines-play",
            name: "Coroutines Play Services",
            category: "core",
            version: "1.10.2", // Normalmente sigue la versión de coroutines-core, pero especificaste esta
            coordinates: { group: "org.jetbrains.kotlinx", artifact: "kotlinx-coroutines-play-services" },
            type: "library"
        }
    ]
};