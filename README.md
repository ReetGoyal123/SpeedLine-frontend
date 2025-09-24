# SpeedLine Train Traffic Management System

🚄 **Real-time Train Traffic Monitoring with AI-Driven Optimization**

A comprehensive Next.js dashboard for monitoring railway operations, featuring live train tracking, disruption management, and AI-powered optimization recommendations.

## 🌟 Features

### 🎛️ **Real-time Dashboard**
- Live train positions with interactive visualizations
- Section occupancy and capacity utilization
- Train status indicators (On Time, Delayed, Waiting, Arrived, Cancelled)
- Real-time updates every 10-20 seconds

### 🤖 **AI Optimization**
- Smart routing recommendations (proceed, hold, reroute)
- Automated traffic management suggestions
- Priority-based decision making
- No frontend polling (backend auto-updates every 20s)

### 🚨 **Disruption Management**
- Real-time disruption alerts and monitoring
- Severity levels (Low, Medium, High)
- Impact analysis on affected trains
- Recovery progress tracking

### 📊 **Performance Analytics**
- KPI tracking and trend analysis
- System health monitoring
- Network availability metrics
- Operational efficiency insights

### 🎨 **Modern UI/UX**
- Responsive Tailwind CSS design
- ShadCN UI components
- Dark/Light theme support
- Interactive visualizations with Recharts

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **Charts**: Recharts for data visualization
- **Data Fetching**: SWR with automatic polling
- **API Client**: Axios with interceptors
- **State Management**: React hooks + SWR caching

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Backend running on `https://sih-backend-1-x9tg.onrender.com` (optional - has mock data fallback)

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd train-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### 📁 Project Structure

```
train-dashboard/
├── pages/                    # Next.js pages
│   ├── index.tsx            # Landing page
│   ├── dashboard.tsx        # Main dashboard
│   ├── disruptions.tsx      # Disruption management
│   ├── optimization.tsx     # AI optimization results
│   └── health.tsx           # System health monitoring
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── StatsCard.tsx   # KPI display cards
│   │   ├── TrainVisualization.tsx  # Train tracking visual
│   │   ├── ControlPanel.tsx        # System controls
│   │   ├── Legend.tsx              # Color/symbol legend
│   │   ├── Notifications.tsx       # Alert system
│   │   └── SettingsDrawer.tsx      # Configuration panel
│   ├── hooks/               # Custom React hooks
│   │   ├── useTrainData.ts  # Train data fetching
│   │   ├── useHealthData.ts # System health data
│   │   ├── useDisruptions.ts # Disruption data
│   │   └── useOptimization.ts # AI optimization data
│   ├── lib/                 # Utilities and configuration
│   │   ├── api.ts          # Axios configuration
│   │   ├── mockData.ts     # Fallback mock data
│   │   └── utils.ts        # Helper functions
│   ├── types/               # TypeScript definitions
│   │   └── index.ts        # Type interfaces
│   └── styles/
│       └── globals.css     # Global styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🔗 API Endpoints

The frontend connects to these backend endpoints:

| Endpoint | Method | Description | Polling |
|----------|---------|-------------|---------|
| `/api/train-data` | GET | Live train snapshots | ✅ 15s |
| `/health` | GET | System health status | ✅ 20s |
| `/trains` | GET | Train states summary | ✅ 15s |
| `/api/train-data/summary` | GET | Summary statistics | ✅ 15s |
| `/api/disruptions` | GET | Active disruptions | ✅ 15s |
| `/api/optimization/results` | GET | AI recommendations | ❌ Backend auto-updates |
| `/reset` | POST | Reset simulation | Manual |

> **Note**: The optimization endpoint is NOT polled by the frontend as it auto-updates from the backend every 20 seconds.

## 📊 Data Models

### TrainBundle Interface
```typescript
interface TrainBundle {
  train: {
    train_id: string;
    type: "Express" | "Freight" | "Local" | "High-Speed";
    priority: number;
    max_speed_kmh: number;
    length_m: number;
    direction: "forward" | "backward";
    destination_station: string;
    current_location: { section_id: string; position_m: number; };
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

## 🎯 Key Components

### 🎛️ Dashboard Features
- **Real-time Train Tracking**: Visual representation of train positions on track sections
- **Section Monitoring**: Track occupancy, capacity utilization, and speed limits
- **Status Indicators**: Color-coded train status (On Time, Delayed, Waiting, etc.)
- **Performance Metrics**: KPI cards with trends and system statistics

### 🔧 Control Panel
- **Simulation Reset**: POST request to `/reset` endpoint
- **Auto-refresh Toggle**: Pause/resume real-time updates
- **Theme Toggle**: Dark/Light mode switching (demo)

### 📈 Statistics Cards
- Total Trains Running
- Average Speed across network
- On Time Performance percentage
- Average Delay duration

### 🎨 Legend & Visual Guide
- Train type color coding (Express: Red, Local: Blue, Freight: Green, High-Speed: Purple)
- Track type indicators (Single/Double track)
- Disruption severity levels
- Status indicator meanings

### 🔔 Notifications System
- Real-time alerts for delays and disruptions
- Sample notifications with timestamps
- Severity-based color coding
- Auto-clearing functionality

### ⚙️ Settings Panel
- Display options (show/hide disruptions, AI optimizer)
- Data refresh configuration
- Notification preferences
- Theme selection

## 🛡️ Error Handling

The application includes comprehensive error handling:

- **Network timeouts**: Graceful fallback to mock data
- **API failures**: Automatic retry with exponential backoff
- **Invalid responses**: Data validation and sanitization
- **Empty states**: User-friendly empty state messages
- **Loading states**: Skeleton screens and loading indicators

## 🎨 Styling & Theme

- **Tailwind CSS**: Utility-first styling approach
- **ShadCN UI**: High-quality, accessible component library
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Custom Train Colors**: Type-specific color coding for easy identification
- **Consistent Icons**: Emoji-based icons for universal readability

## 🔄 Real-time Updates

The system uses different polling strategies:

- **Train Data**: Updates every 15 seconds
- **Health Data**: Updates every 20 seconds  
- **Disruptions**: Updates every 15 seconds
- **Optimization**: No polling (backend pushes updates every 20s)

Updates can be paused via the Control Panel for testing or maintenance.

## 🧪 Mock Data Support

When the backend is unavailable, the application seamlessly falls back to comprehensive mock data:

- Sample train movements across 6 sections
- Realistic disruption scenarios
- AI optimization recommendations
- Complete system health metrics

This ensures the application is fully functional for demonstration purposes even without a live backend.

## 🚀 Deployment

### Development
```bash
npm run dev     # Start development server on :3000
```

### Production
```bash
npm run build   # Build for production
npm start       # Start production server
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://sih-backend-1-x9tg.onrender.com  # Backend API URL
```

## 🔮 Future Enhancements

- **Historical Analytics**: Trend analysis and performance history
- **Advanced AI Insights**: Predictive analytics and pattern recognition
- **Mobile App**: React Native companion app
- **Real-time Collaboration**: Multi-user dashboard with live cursors
- **Advanced Filtering**: Custom views and saved dashboard configurations
- **Export Functionality**: PDF reports and data export capabilities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is created for SIH 2025 - Smart India Hackathon.

## 🎯 SIH 2025 Project Goals

SpeedLine addresses critical challenges in railway traffic management:

- **Real-time Monitoring**: Live visibility into train operations
- **AI-Driven Optimization**: Smart routing and traffic management
- **Proactive Disruption Management**: Early warning and impact analysis
- **Operational Efficiency**: Data-driven insights for better decision making
- **Scalable Architecture**: Modern web technologies for future growth

---

**Built with ❤️ for SIH 2025 - Making Railway Operations Smarter**