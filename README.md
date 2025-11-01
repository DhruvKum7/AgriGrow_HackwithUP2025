# AgriGrow 🌾 — Voice-first, Bilingual AgTech Super-app

<!-- 3D ANIMATED HERO -->
<p align="center">
  <img src="assets/agrigrow-hero.gif" width="100%" alt="AgriGrow 3D Animated Banner">
</p>

<!-- If you don't have a GIF yet, export a short orbit from Blender/Spline, or use the SVG below as a fallback. -->
<!-- <img src="assets/agrigrow-hero.svg" width="100%" alt="AgriGrow 3D Banner (SVG Fallback)"> -->

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=222" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=fff" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=fff" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwindcss&logoColor=fff" /></a>
  <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Framer%20Motion-🎞️-000" /></a>
  <a href="https://lumi.new/"><img src="https://img.shields.io/badge/Lumi%20SDK-0.2.1-6A5ACD" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>
</p>

AgriGrow unifies **Mandi Prices**, **Weather-aware advisory**, **AI “Agricultural Doctor”**, **Grain Buy/Sell**, and **Pesticide e-commerce** into one bilingual (Hindi + English), **voice-first** app.

---

## ✨ Why AgriGrow

- **Bilingual voice UX (hi-IN + en-US)** — hands-free STT/TTS for queries and replies.  
- **Actionable, not just info** — price + weather → spray windows, dosage, payment terms.  
- **Trust signals** — quality grades, moisture %, harvest date, verified sellers.  
- **All-in-one** — know (prices/weather) → decide (advisory) → act (buy/sell/checkout).

---

## 👥 Team & Hackathon

- **Leader:** Akash Chaudhary  
- **Members:** Dhruv Kumar, Arpit Dubey, Varsha Katiyaar  
- **Hackathon:** *HackWithUttarPradesh 2025* (IEDC Chandigarh University)  
  

---

## 🧱 Modules

- **Auth & Language** — `AuthProvider`, `LanguageContext`  
- **Grain Marketplace** — list, filter, order (buyers & farmers)  
- **Mandi Prices** — searchable, state filters, trend tags  
- **Medical Chatbot (Agri Doctor)** — rule-based demo + voice in/out, consultation history  
- **Pesticide E-Commerce** — catalog/cart/payments ready design

---

## 🧩 Tech Stack → Purpose

| Layer | What we use | Why |
|---|---|---|
| UI | **React 18 + TypeScript**, **TailwindCSS** | Fast, typed DX; utility-first styling |
| Animations | **Framer Motion**, **lucide-react** | Delightful micro-interactions & icons |
| Build | **Vite** | Lightning dev + prod builds |
| Routing | **react-router-dom** | Simple routes `/marketplace`, `/prices`, `/doctor` |
| Notifications | **react-hot-toast** | Clear success/error feedback |
| Backend-as-Service | **@lumi.new/sdk** | Auth + Entities (CRUD) |
| Voice | **Web Speech API** hooks | STT/TTS for Hindi/English (no server key) |

---

## 🔌 APIs / Domains Mapped

| Domain | API / Library | Notes |
|---|---|---|
| Auth + DB | **Lumi SDK** | `lumi.auth.*`, `lumi.entities.*` (list/create/update) |
| Voice (STT/TTS) | **Web Speech API** | `SpeechRecognition` (hi-IN, en-US), `speechSynthesis` |
| Weather | (plug) Open-Meteo / IMD | Use daily forecast → spray windows |
| Mandi Prices | (plug) Agri-market feed / custom ETL | Store as `mandi_prices` |
| Vision (disease) | **FastAPI service** (below) | A1/A2/A3 approaches |
| Payments | (plug) Razorpay/Stripe | For pesticide e-commerce |

---

## 🗂️ Data Entities (Lumi)

- `grain_listings` — seller listings with quality, moisture, harvest date, location, images  
- `grain_orders` — buyer orders, payment terms, delivery details  
- `mandi_prices` — cropName, marketName, min/max/avg, trend, state/district, date  
- `medical_consultations` — query, analysis, treatments, confidence, voice flags

<details>
<summary>Sample JSON</summary>

```jsonc
{
  "grain_listings": {
    "seller_id": "user_123",
    "grain_type": "wheat",
    "quantity": 1200,
    "price_per_kg": 24.5,
    "quality_grade": "A",
    "location": { "state": "UP", "district": "Kanpur", "village": "XYZ", "pincode": "208001" },
    "contact_info": { "name": "Raj", "phone": "98xxxxxx" },
    "harvest_date": "2025-10-15",
    "organic_certified": true,
    "moisture_content": 12.5,
    "status": "available",
    "images": ["https://…/wheat.jpg"],
    "description": "Clean, machine-dried wheat",
    "created_at": "2025-11-02T08:00:00Z"
  }
}
