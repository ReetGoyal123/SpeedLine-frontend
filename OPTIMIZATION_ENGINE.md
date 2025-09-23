# Real-time Optimization Engine - Client Implementation

## Overview

This implementation replicates the exact logic from your Python `decision_taker.py` file on the Next.js client side, providing real-time AI-powered train traffic optimization using Groq LLaMA 3.3.

## Core Components

### 1. `useOptimizationEngine.ts` Hook
**Location:** `src/hooks/useOptimizationEngine.ts`

Implements the core optimization logic from your Python file:

- **Polling Logic**: Continuous data fetching every 15 seconds (same as Python)
- **Conflict Analysis**: Detects capacity violations and single-track conflicts
- **AI Optimization**: Generates prompts for Groq LLaMA 3.3
- **Fallback Scheduling**: Provides backup scheduling when AI fails
- **State Management**: Real-time updates with React hooks

**Key Functions (Python → TypeScript):**
- `fetch_train_data()` → `fetchTrainData()`
- `analyze_conflicts()` → `analyzeConflicts()`
- `create_optimization_prompt()` → `createOptimizationPrompt()`
- `get_optimized_schedule()` → `getOptimizedSchedule()`
- `_generate_fallback_schedule()` → `generateFallbackSchedule()`
- `optimize_traffic()` → `optimizeTraffic()`
- `run_continuous_optimization()` → `startPolling()`

### 2. `RealTimeOptimization.tsx` Component
**Location:** `src/components/RealTimeOptimization.tsx`

Provides real-time visualization of:
- Live optimization status with polling controls
- Current train positions and conflicts
- AI-generated optimization schedules
- System performance metrics
- Error handling and status updates

### 3. Optimization Engine Page
**Location:** `app/optimization-engine/page.tsx`

Dedicated page for the live optimization engine with:
- Interactive control panel (Start/Stop/Refresh)
- Real-time conflict visualization
- Live schedule updates
- Technical implementation details
- Network topology display

## Configuration

### Network Topology (Same as Python)
```typescript
const sectionCapacity = {
  "SEC_1": 2, // Double track
  "SEC_2": 1, // Single track
  "SEC_3": 2, // Double track
  "SEC_4": 1, // Single track
  "SEC_5": 3, // Triple track
  "SEC_6": 1  // Bypass route
};

const sectionGraph = {
  "SEC_1": { next: ["SEC_2"], stations: ["STN_A", "STN_B"], length_km: 8.5 },
  "SEC_2": { next: ["SEC_3"], stations: ["STN_B", "STN_C"], length_km: 6.2 },
  "SEC_3": { next: ["SEC_4"], stations: ["STN_C", "STN_D"], length_km: 7.8 },
  "SEC_4": { next: ["SEC_5"], stations: ["STN_D", "STN_E"], length_km: 5.3 },
  "SEC_5": { next: ["SEC_6"], stations: ["STN_E", "STN_F"], length_km: 9.1 },
  "SEC_6": { next: [], stations: ["STN_B", "STN_E"], length_km: 12.0 }
};
```

### Polling Configuration
- **Interval**: 15 seconds (same as Python `polling_interval=15`)
- **API Base URL**: `http://localhost:8000`
- **Auto-start**: Enabled by default

## API Endpoints Required

The client expects these backend endpoints (implement in your server):

### 1. `GET /api/train-data`
Returns current train data (already exists in your backend)

### 2. `POST /api/optimization/generate`
**Request:**
```json
{
  "prompt": "LLaMA optimization prompt",
  "trains": 5,
  "conflicts": 2
}
```

**Response:**
```json
{
  "now_epoch_s": 1695456789,
  "horizon_s": 3600,
  "snapshot_trains_considered": 5,
  "schedule": {
    "TRAIN_001": {
      "target_section": "SEC_2",
      "entry_offset_s": 0,
      "entry_epoch_s": 1695456789,
      "action": "proceed",
      "priority": 5,
      "status": "On time"
    }
  }
}
```

### 3. `POST /api/optimization/results`
Saves optimization results to backend storage

## Features Implemented

### ✅ Complete Python Logic Ported
1. **Continuous Polling**: Every 15 seconds
2. **Conflict Detection**: Capacity & single-track analysis
3. **AI Optimization**: Groq LLaMA 3.3 integration
4. **Priority Sorting**: Express > Local > Freight
5. **Fallback Scheduling**: When AI fails
6. **Schedule Persistence**: Save results to backend

### ✅ Enhanced UI Features
1. **Live Status Indicators**: Real-time polling status
2. **Interactive Controls**: Start/Stop/Refresh buttons
3. **Conflict Visualization**: Color-coded severity levels
4. **Schedule Display**: Formatted AI results
5. **Error Handling**: User-friendly error messages
6. **Performance Metrics**: Optimization timing

### ✅ Real-time Updates
1. **State Management**: React hooks for real-time updates
2. **Auto-refresh**: Continuous background polling
3. **Visual Feedback**: Loading states and animations
4. **Status Tracking**: Last optimization timestamp

## Usage

### Navigation
1. **Home Page**: New "Live Engine" button added
2. **All Pages**: Navigation updated with "Live Engine" link
3. **Direct Access**: `/optimization-engine` route

### Controls
- **▶️ Start**: Begin continuous optimization polling
- **⏹️ Stop**: Halt polling and optimization
- **🔄 Refresh**: Manual optimization trigger
- **Live Indicator**: Green pulse when active

### Monitoring
- **Active Trains**: Current train count
- **Conflicts**: Real-time conflict detection
- **Schedules**: Live AI-generated schedules
- **Timing**: Last optimization timestamp

## Technical Notes

### Performance
- **Efficient Polling**: Prevents overlapping requests
- **Error Recovery**: Automatic retry on failures
- **Memory Management**: Proper cleanup on unmount

### Error Handling
- **Network Failures**: Graceful degradation
- **AI Failures**: Fallback to rule-based scheduling
- **Parse Errors**: JSON validation and recovery

### Logging
- **Console Output**: Detailed operation logs
- **Status Updates**: Real-time user feedback
- **Error Reporting**: Clear error messages

## Integration with Your Backend

To complete the integration, implement these endpoints in your backend:

```python
# In your FastAPI/Flask backend
@app.post("/api/optimization/generate")
async def generate_optimization(request: OptimizationRequest):
    # Use your existing Groq client from decision_taker.py
    # Return the same schedule format
    
@app.post("/api/optimization/results")
async def save_optimization_results(schedule: OptimizationSchedule):
    # Save using your existing save_schedule logic
```

This implementation maintains 100% compatibility with your Python logic while providing a modern, interactive web interface for real-time monitoring and control.