<!-- PROJECT SHIELDS -->
<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)]()
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)

</div>

# ✦ nx.ai — AI Sales Assistant

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

**nx.ai** is not just a call recorder. It is a live, real-time AI sales partner designed for high-pressure environments. By listening to client interactions continuously, nx.ai analyzes sentiment, detects key objections (pricing, competitors, timelines), and surfaces the most effective counter-responses instantly. 

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
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Hero.jsx            // Landing page hero with scratch canvas and GSAP
│       │   ├── HowItWorks.jsx      // Interactive scratch-reveal mechanism
│       │   ├── Pricing.jsx         // 3-Column pricing with Matter.js physics
│       │   ├── ObjectionHandling.jsx // Real-time detection visualization
│       │   ├── Testimonials.jsx    // Masonry grid with scroll parallax
│       │   ├── Integrations.jsx    // SVG snake animations for integrations
│       │   ├── Loader.jsx          // Custom conversation-reveal loader
│       │   ├── Navbar.jsx          // Floating pill frosted glass navigation
│       │   └── ...
│       ├── App.jsx                 // Main routing and layout wrapper
│       ├── main.jsx                // Application entry point
│       └── index.css               // Global styles and design tokens
└── README.md                       // You are here
```

## Contact

**Harshit (glitchX-Harshit)**  
Project Link: [https://github.com/glitchX-Harshit/sales-XAM-](https://github.com/glitchX-Harshit/sales-XAM-)
