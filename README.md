<!-- PROJECT SHIELDS -->
<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)]()
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)

</div>

# ✦ klyro.ai — AI Sales Assistant

<p align="center">
  <strong>An intelligent, real-time AI agent that handles clients on your behalf, detecting objections and providing high-accuracy reasoning to close deals.</strong>
</p>

<p align="center">
  <a href="#about-the-project">About the Project</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a>
</p>

---

## About the Project

**klyro.ai** is not just a call recorder. It is a live, real-time AI sales partner designed for high-pressure environments. By listening to client interactions continuously, klyro.ai analyzes sentiment, detects key objections (pricing, competitors, timelines), and surfaces the most effective counter-responses instantly. 

Designed with an "Awwwards-winning" aesthetic, the application features an engaging, minimal, and premium UI with seamless animations and interactive elements.

## Key Features

- **Live Objection Detection:** Instantly flags pricing concerns, competitor mentions, and hesitation.
- **Real-Time Reasoning:** Processes conversation context to suggest high-converting responses with a 94% success rate.
- **Premium User Experience:** Built with a sophisticated `cream` and `dark` mode aesthetic, featuring fluid scrub animations, magnetic buttons, and "scratch-to-reveal" interactions.
- **Interactive Data Visualization:** Implements physics-based (Matter.js) layout elements and GSAP-powered parallax scrolling.
- **Seamless Integrations:** Works across your existing CRM and communication platforms (Salesforce, HubSpot, Zoom, Slack).

## Tech Stack

The application relies on a modern, high-performance frontend architecture:

* **Framework:** [React](https://reactjs.org/) (via Vite)
* **Animation & Interactions:**
  * [GSAP](https://greensock.com/gsap/) (ScrollTrigger, Timelines)
  * [Matter.js](https://brm.io/matter-js/) (2D Physics Engine)
* **Styling Tools:** Custom CSS with modern properties (Backdrop filters, clip-paths, grid)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Typography:** `Plus Jakarta Sans`, `Cormorant Garamond`, and `Caveat` (for hand-drawn annotations).

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/glitchX-Harshit/sales-XAM-.git
   ```
2. Navigate to the frontend directory:
   ```sh
   cd sales-XAM-/frontend
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open your browser and navigate to the address shown in your terminal (usually `http://localhost:5173`).

## Project Structure

```text
sales-XAM-/
├── backend/
│   ├── main.py              // FastAPI application entry point
│   ├── services/
│   │   ├── sales_ai_engine.py      // Core AI orchestrator
│   │   ├── persuasion_engine.py    // AI Persuasion Strategy engine
│   │   ├── conversation_analyzer.py // Intent & Topic detection
│   │   ├── suggestion_manager.py   // Suggestion history & deduplication
│   │   ├── deepgram_stream.py      // Real-time audio transcription
│   │   └── websocket_service.py    // Live WebSocket management
│   ├── data/                   // Strategy playbooks and JSON data
│   └── routers/                // API route definitions
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Dashboard.jsx       // Real-time AI sales dashboard
│       │   ├── Hero.jsx            // Landing page hero with scratch canvas
│       │   ├── ObjectionHandling.jsx // Objection detection visualization
│       │   ├── ResponseSuggestion.jsx // AI-generated response interface
│       │   └── ...
│       ├── App.jsx                 // Global layout and view management
│       └── main.jsx                // React entry point
└── README.md                       
```

## AI Pipeline & Persuasion Engine

The backend features a sophisticated AI pipeline that processes live conversations:

1.  **Transcription**: Uses **Deepgram** for ultra-low latency, real-time audio-to-text conversion.
2.  **Analysis**: The `conversation_analyzer` detects the prospect's **Intent** and **Topic** using custom LLM prompts.
3.  **Strategy Selection**: The `persuasion_engine` rotates between 7 high-level sales strategies (e.g., *Future Pacing*, *The Social Proof Push*, *The Scarcity Lever*) to keep the conversation dynamic.
4.  **Generation**: Suggests verbatim responses and "Next Best Questions" for the salesperson, optimized for closing deals.
5.  **Deduplication**: The `suggestion_manager` ensures the AI never repeats the same advice twice during a call.

## Contact

**Harshit (glitchX-Harshit)**  
Project Link: [https://github.com/glitchX-Harshit/sales-XAM-](https://github.com/glitchX-Harshit/sales-XAM-)


ux funnel done