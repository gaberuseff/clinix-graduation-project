# Clinix Project: Comprehensive Technical Specification & Book Generator Prompt

This document provides a highly detailed, structured, and comprehensive overview of the **Clinix** project. It details the core concepts, technical architecture, database schema, page routing, and key features. You can feed this file directly as a prompt to any Large Language Model (such as Gemini, Claude, or ChatGPT) to generate a complete academic book, thesis, or technical documentation report.

---

## 1. Project Vision & Core Concept

**Clinix** is a modern, multi-tenant Software-as-a-Service (SaaS) Clinic Management System designed to streamline daily healthcare operations. It optimizes workflows for clinic staff and improves the patient care experience by structuring collaboration between doctors and assistants.

The system is built on an **Offline-First architecture** to guarantee service continuity in areas with unstable internet connectivity. Additionally, it implements advanced authentication mechanisms using biometric **Passkeys (WebAuthn)** alongside classic credentials.

### Role-Based Access Control (RBAC):

The system defines two main roles, isolated under a unique tenant identifier (`clinic_id`):

1. **Doctor (Admin / Clinic Owner):** Holds complete authority over the clinic. The doctor can manage secretaries (create accounts, block/unblock), view advanced financial analytics, manage the patient directory, write Electronic Medical Records (EMRs) with electronic prescriptions, and modify clinic-wide settings.
2. **Secretary (Assistant / Front Desk):** Focuses on administrative operations. The secretary manages the daily queue, registers new patients, books/updates appointments, and monitors basic daily stats.

---

## 2. Technical Stack & Software Architecture

The application leverages modern, production-grade technologies to ensure high performance, security, and offline resilience:

### Frontend Layer:

- **React 19 & Vite:** The core framework and build tool, offering fast Hot Module Replacement (HMR) and optimized build times.
- **Tailwind CSS v4:** A utility-first CSS framework configured with custom modern CSS variables for fluid typography, dark mode, and micro-animations.
- **Radix UI & Shadcn UI:** Headless components used to build accessible UI primitives (e.g., Drawers, Dialogs, Sidebars, Tooltips).
- **React Router 7:** Manages routing and client-side page transitions, utilizing lazy loading (code-splitting) to optimize initial page loading.
- **TanStack Query (React Query) v5:** Manages server state, client caching, automated refetching, and offline cache hydration.
- **IndexedDB (via `idb-keyval`):** A lightweight, asynchronous key-value store used to hold the offline mutation queue and cache critical settings, avoiding the storage limits and performance blocking of `localStorage`.

### Backend & Database Layer:

- **Supabase (BaaS):** Provides backend services:
  - **PostgreSQL Database:** Relational database storage.
  - **Supabase Auth:** Handles secure user onboarding and sessions.
  - **Row Level Security (RLS):** Secures all tables at the database level by comparing the user's JWT metadata (`clinic_id`) with the target row.
  - **Supabase Edge Functions:** Serverless JavaScript/TypeScript functions (e.g., `manage-secretaries`) to perform admin actions securely.
  - **Stored Procedures / SQL RPCs:** Database-level functions (like `get_doctor_dashboard_stats`) that execute complex queries and aggregations directly on PostgreSQL for maximum efficiency.

---

## 3. Features Breakdown

### A. Authentication & Security (Passkeys & RLS)

1.  **Classic Registration:** Doctors sign up using email and password. Upon sign-up, a unique UUID `clinic_id` is generated and attached to the doctor's `user_metadata`.
2.  **Biometric Passkeys (WebAuthn):**
    - Users can register their device credentials (face recognition, fingerprint, or PIN).
    - Enables passwordless, secure login with a single click using Supabase's `signInWithPasskey()` API.
3.  **Multi-Tenant Isolation:** Clinic isolation is enforced in every database transaction via Row Level Security (RLS) policies. One clinic can never read or write data belonging to another clinic.

### B. Doctor Portal

1.  **Doctor Analytics Dashboard:**
    - Displays real-time KPIs: Today's Total Bookings, Pending Bookings, Completed Bookings, and Cancelled Bookings.
    - Interactive charts (recharts) rendering daily booking volume and completion trends over customizable timeframes (7 days, 30 days, etc.), calculated via the `get_doctor_dashboard_stats` database function.
    - Visualized financial revenue tracking.
2.  **Patient Management:**
    - Unified directory of all patients with instant search (by name or phone).
    - Supports patient creation, details updating, and soft deletion (`is_active = false`) to preserve historical medical histories.
3.  **Electronic Medical Records (EMR) & Visits:**
    - Detailed visit logs detailing consultation history.
    - **New Visit Entry:** Log visit type (`checkup` or `follow_up`), diagnosis, and detailed notes.
    - **Structured Prescriptions:** A JSONB array storing prescribed medications (medication name, strength, frequency, duration).
4.  **Secretary Management:**
    - Creation of secretary accounts under the doctor's `clinic_id`.
    - One-click block/unblock actions to instantly revoke a secretary's access.
    - Protected by a Supabase Edge Function (`manage-secretaries`) to prevent direct database updates from unauthorized frontends.
5.  **Financial Dashboard:**
    - Comprehensive breakdown of clinic revenues powered by the PostgreSQL function `get_clinic_financial_stats`.
    - Detailed transaction table displaying patient payments, visit types, and dates.
6.  **Clinic Settings & Preferences:**
    - Configure clinic profile data (Name, Address, Specialty, Working Hours).
    - Toggle app theme (Dark/Light mode) and interface language (Arabic/English).

### C. Secretary Portal

1.  **Secretary Dashboard:**
    - Displays daily KPIs (Today's bookings, today's revenues, and total active patients in the clinic).
    - Real-time queue tracking showing today's appointments ordered chronologically.
    - Quick links to the 5 most recently registered patients.
2.  **Appointment Booking & Management:**
    - Book new appointments for patients (Checkup or Follow-up), setting prices, dates, and times.
    - Update appointment status (`pending`, `completed`, `cancelled`).
    - Filter appointments by date (Today, Tomorrow, Day After Tomorrow, All) to organize clinical flow.
3.  **Patient Registration:**
    - Register new patients and modify basic contact info.

### D. Offline-First CRUD System (Resilient Operations)

This architecture ensures the clinic continues to run seamlessly even during internet blackouts:

1.  **Offline Mutation Queue:**
    - If a doctor or secretary performs a CRUD operation (e.g., adding/updating a patient) while offline, the HTTP request is intercepted.
    - The app generates a client-side temporary ID starting with `temp-` (e.g. `temp-12345`).
    - The mutation payload is queued inside IndexedDB under the key `offlinePatientActions`.
2.  **Smart Synchronization Algorithm:**
    - The network listener hook (`useOfflineSync`) detects when the device comes back online.
    - It triggers `syncOfflineActions` to process queued actions sequentially (First-In, First-Out).
    - **ID Resolution Mechanism:** If a patient was created offline (`temp-123`) and subsequently updated while offline, the sync engine first posts the creation to Supabase. Supabase responds with a database-generated UUID (e.g. `uuid-999`). The sync engine intercepts this, saves the mapping `{ "temp-123": "uuid-999" }`, and automatically replaces the temporary ID with the real UUID in any subsequent queued updates (like updating patient records or scheduling appointments) before sending them to the server.
3.  **Local Storage Caching:**
    - Critical clinic settings are cached in IndexedDB (`clinic_settings_cache_<clinicId>`). If a user opens the app while offline, settings are loaded directly from the local store instead of causing a loading failure.

### E. Localization & Responsive UX

- **Bilingual System (i18next):** Fully translated in Arabic and English.
- **RTL / LTR Dynamic Layouts:** The entire interface dynamically flips from Right-to-Left (for Arabic) to Left-to-Right (for English) layout structures.
- **Responsive Adaptation:** Fully optimized for desktop monitors, clinic reception tablets, and mobile phones.

---

## 4. Database Schema Design

### 1. Users Metadata (`users` table linked with `auth.users`):

- `id` (UUID - Primary Key)
- `email` (Text)
- `role` (Text - "doctor" | "secretary")
- `clinic_id` (UUID)
- `full_name` (Text)
- `phone` (Text)

### 2. Patients Table (`patients`):

- `id` (UUID - Primary Key)
- `clinic_id` (UUID - Tenant Key)
- `name` (Text)
- `phone` (Text)
- `gender` (Text)
- `date_of_birth` (Date)
- `is_active` (Boolean - Default true, set to false for soft delete)
- `created_at` (Timestamptz)

### 3. Appointments Table (`appointments`):

- `id` (UUID - Primary Key)
- `clinic_id` (UUID)
- `patient_id` (UUID - References patients.id)
- `name` (Text - Patient's name)
- `phone` (Text - Patient's phone)
- `date` (Timestamptz - Date and time of appointment)
- `type` (Text - 'checkup' | 'follow_up')
- `status` (Text - 'pending' | 'completed' | 'cancelled')
- `price` (Numeric)
- `created_at` (Timestamptz)

### 4. Medical Records Table (`medical_records`):

- `id` (UUID - Primary Key)
- `clinic_id` (UUID)
- `patient_id` (UUID - References patients.id)
- `appointment_id` (UUID - References appointments.id)
- `patient_name` (Text)
- `patient_phone` (Text)
- `visit_type` (Text - 'checkup' | 'follow_up')
- `diagnosis` (Text)
- `prescription` (JSONB - Medication array: `[{ id, medication, strength, frequency, duration }]`)
- `doctor_notes` (Text)
- `created_at` (Timestamptz)

### 5. Clinic Settings Table (`clinic_settings`):

- `clinic_id` (UUID - Primary Key)
- `clinic_name` (Text)
- `clinic_address` (Text)
- `clinic_specialty` (Text)
- `updated_at` (Timestamptz)

---

## 5. Suggested Book Structure for the AI Book Generator

If you want the AI to write a comprehensive report or thesis, instruct it to expand on the following chapters using the technical data detailed above:

- **Introduction & System Requirements:** Elaborate on current clinic management bottlenecks, the importance of offline resiliency in local clinics, and system objectives.
- **Chapter 1: Literature Review & Competitor Analysis:** Analyze legacy desktop medical software vs. cloud-based SaaS, highlighting the advantages of hybrid offline-first web technologies.
- **Chapter 2: Architecture & Database Design:** Detail the database entities, relational constraints, security architecture (Supabase RLS policies), and multi-tenant isolation logic.
- **Chapter 3: Frontend Implementation & Responsive UI/UX:** Document the use of React 19, Tailwind CSS v4 variables, responsive layout design, dynamic RTL/LTR flipping, and local preferences management.
- **Chapter 4: Offline-First Synchronizer Engine (Technical Depth):** Write a detailed chapter describing React Query caching mechanisms, the IndexedDB transaction queue, the conflict resolution algorithm, and the ID resolution flow (`temp-ID` to `real-UUID`).
- **Chapter 5: Biometric Passkey Integration & Edge Functions:** Elaborate on the WebAuthn standard, the step-by-step registration and login flows of Passkeys using Supabase, and how serverless Edge Functions handle sensitive tasks like user lifecycle operations safely.
- **Chapter 6: System Testing, Performance Evaluation, and Future Work:** Describe test cases for offline operations, network reconnections, performance diagnostics via Sentry, and potential feature additions (e.g., AI-powered prescription parsing or predictive scheduling).
