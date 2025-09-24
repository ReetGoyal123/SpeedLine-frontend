
# SpeedLine Train Traffic Management System

**Real-time Train Traffic Monitoring with AI-Driven Optimization**

[🌐 Live Demo](https://speed-line-frontend.vercel.app/)

A comprehensive **Next.js dashboard** for monitoring railway operations, featuring live train tracking, disruption management, and AI-powered optimization recommendations.

---

## Features

### Real-time Dashboard

* Live train positions with interactive visualizations
* Section occupancy and capacity utilization
* Train status indicators (On Time, Delayed, Waiting, Arrived, Cancelled)
* Real-time updates every 10–20 seconds

### AI Optimization

* Smart routing recommendations (proceed, hold, reroute)
* Automated traffic management suggestions
* Priority-based decision making
* Backend-driven updates every 20 seconds (no frontend polling)

### Disruption Management

* Real-time disruption alerts and monitoring
* Severity levels (Low, Medium, High)
* Impact analysis on affected trains
* Recovery progress tracking

### Performance Analytics

* KPI tracking and trend analysis
* System health monitoring
* Network availability metrics
* Operational efficiency insights

### Modern UI/UX

* Responsive design with Tailwind CSS
* ShadCN UI components
* Dark/Light theme support
* Interactive visualizations with Recharts

---

## Tech Stack

* **Frontend**: Next.js 14, React 18, TypeScript
* **Styling**: Tailwind CSS, ShadCN UI
* **Charts**: Recharts
* **Data Fetching**: SWR with automatic polling
* **API Client**: Axios with interceptors
* **State Management**: React hooks + SWR caching

---

## Quick Start

### Prerequisites

* Node.js 16+ and npm
* Backend running on `https://sih-backend-1-x9tg.onrender.com` (optional – mock data fallback included)

### Installation

```bash
# Clone and navigate to project
cd train-dashboard  

# Install dependencies
npm install  

# Start development server
npm run dev  
```

Open your browser at: [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
train-dashboard/
├── pages/                    # Next.js pages
│   ├── index.tsx             # Landing page
│   ├── dashboard.tsx         # Main dashboard
│   ├── disruptions.tsx       # Disruption management
│   ├── optimization.tsx      # AI optimization results
│   └── health.tsx            # System health monitoring
├── src/
│   ├── components/           # React components
│   │   ├── ui/               # ShadCN UI components
│   │   ├── StatsCard.tsx     # KPI display cards
│   │   ├── TrainVisualization.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── Legend.tsx
│   │   ├── Notifications.tsx
│   │   └── SettingsDrawer.tsx
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities and configuration
│   ├── types/                # TypeScript definitions
│   └── styles/               # Global styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## API Endpoints

| Endpoint                    | Method | Description          | Polling                |
| --------------------------- | ------ | -------------------- | ---------------------- |
| `/api/train-data`           | GET    | Live train snapshots | ✅ 15s                  |
| `/health`                   | GET    | System health status | ✅ 20s                  |
| `/trains`                   | GET    | Train states summary | ✅ 15s                  |
| `/api/train-data/summary`   | GET    | Summary statistics   | ✅ 15s                  |
| `/api/disruptions`          | GET    | Active disruptions   | ✅ 15s                  |
| `/api/optimization/results` | GET    | AI recommendations   | ❌ backend auto-updates |
| `/reset`                    | POST   | Reset simulation     | Manual                 |

---

## Data Models

Example: **TrainBundle Interface**

```ts
interface TrainBundle {
  train: {
    train_id: string;
    type: "Express" | "Freight" | "Local" | "High-Speed";
    priority: number;
    max_speed_kmh: number;
    length_m: number;
    direction: "forward" | "backward";
    destination_station: string;
    current_location: { section_id: string; position_m: number };
    status: string;
    actual_departure: string;
    actual_arrival: string | null;
    journey_count: number;
  };
  section: {
    section_id: string;
    start_station: string;
    end_station: string;
    length_km: number;
    capacity: number;
    max_speed_kmh: number;
    track_type: "single" | "double";
    is_disrupted: boolean;
    occupancy_count: number;
  };
  signal: {
    block_id: string;
    section_id: string;
    occupancy_status: "occupied" | "free";
    occupying_trains: number;
    signal_type: "automatic" | "manual";
    headway_time_s: number;
    priority_override: boolean;
  };
  event: {
    event_type: string;
    train_id: string;
    section_id: string;
    timestamp: string | null;
    disruption_details: object | null;
    delay_duration_min: number;
  };
}
```

---

## Key Components

* **Dashboard Features**: Real-time train tracking, section monitoring, status indicators, KPI metrics
* **Control Panel**: Simulation reset, auto-refresh toggle, theme switching
* **Statistics Cards**: Total trains, average speed, on-time performance, delay metrics
* **Legend & Visual Guide**: Train types, track indicators, disruption severity levels
* **Notifications System**: Real-time alerts with severity-based categorization
* **Settings Panel**: Customization of display, refresh rates, and preferences
* **Error Handling**: Fallbacks, retries, validation, and user-friendly empty states

---

## Deployment

**Development**

```bash
npm run dev
```

**Production**

```bash
npm run build
npm start
```

**Environment Variables**

```
NEXT_PUBLIC_API_URL=https://sih-backend-1-x9tg.onrender.com
```

---

## Future Enhancements

* Historical analytics and trend reports
* Predictive AI insights and anomaly detection
* React Native companion app
* Multi-user collaboration support
* Advanced filtering and saved dashboard views
* Export functionality (PDF, CSV)

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project was created for **SIH 2025 – Smart India Hackathon** by Team **Swift_Rail**.

---

## SIH 2025 Project Goals

* Real-time monitoring of train operations
* AI-driven optimization for traffic management
* Proactive disruption management with impact analysis
* Improved operational efficiency through data insights
* Scalable architecture using modern web technologies



