from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import logging
import copy
from fastapi import APIRouter
import asyncio
from fastapi import Request

app = FastAPI()

# Add CORS middleware for cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



# Base template for train data generation
TRAIN_DATA_TEMPLATE = {
    "type": "train_snapshot",
    "timestamp": "",
    "payload": []
}

# Station and section configurations - EXTENDED with branch lines
STATIONS = ["STN_A", "STN_B", "STN_C", "STN_D", "STN_E", "STN_F"]
SECTIONS = [
    {"id": "SEC_1", "start": "STN_A", "end": "STN_B", "length_km": 8.5, "capacity": 2, "max_speed_kmh": 120, "track_type": "double"},
    {"id": "SEC_2", "start": "STN_B", "end": "STN_C", "length_km": 6.2, "capacity": 1, "max_speed_kmh": 100, "track_type": "single"},
    {"id": "SEC_3", "start": "STN_C", "end": "STN_D", "length_km": 7.8, "capacity": 2, "max_speed_kmh": 140, "track_type": "double"},
    {"id": "SEC_4", "start": "STN_D", "end": "STN_E", "length_km": 5.3, "capacity": 1, "max_speed_kmh": 110, "track_type": "single"},
    {"id": "SEC_5", "start": "STN_E", "end": "STN_F", "length_km": 9.1, "capacity": 3, "max_speed_kmh": 160, "track_type": "double"},
    # Branch line for alternate routing
    {"id": "SEC_6", "start": "STN_B", "end": "STN_E", "length_km": 12.0, "capacity": 1, "max_speed_kmh": 90, "track_type": "single"}
]

TRAIN_TYPES = [
    {"name": "Express", "priority": 5, "speed_range": (140, 160)},
    {"name": "Freight", "priority": 2, "speed_range": (80, 100)},
    {"name": "Local", "priority": 3, "speed_range": (100, 120)},
    {"name": "High-Speed", "priority": 5, "speed_range": (160, 180)}
]

# Global train state management
class TrainState:
    def __init__(self):
        self.trains: Dict[str, Dict[str, Any]] = {}
        self.section_disruptions: Dict[str, Dict[str, Any]] = {}
        self.occupied_sections: Dict[str, List[str]] = {}  # section_id -> [train_ids]
        self.initialized = False
        self.start_time = datetime.now()
        self.last_update = datetime.now()

train_state = TrainState()

# Pydantic models for request/response validation
class TrainSnapshotResponse(BaseModel):
    type: str
    timestamp: str
    payload: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    total_trains: int
    active_trains: int
    active_disruptions: int
    disrupted_sections: List[str]

def get_section_by_id(section_id: str) -> Optional[Dict[str, Any]]:
    """Get section data by ID"""
    for section in SECTIONS:
        if section["id"] == section_id:
            return section
    return None

def get_station_connections(station: str) -> List[str]:
    """Get all sections connected to a station"""
    connections = []
    for section in SECTIONS:
        if section["start"] == station:
            connections.append(section["id"])
        elif section["end"] == station:
            connections.append(section["id"])
    return connections

def find_route_to_destination(current_section_id: str, target_station: str, direction: str) -> List[str]:
    """Find route from current section to target station"""
    current_section = get_section_by_id(current_section_id)
    if not current_section:
        return []
    
    # Simple routing logic - can be enhanced with pathfinding
    route = []
    current_station = current_section["end"] if direction == "forward" else current_section["start"]
    
    # If we're at the target station, we're done
    if current_station == target_station:
        return []
    
    # Find next sections based on direction and destination
    for section in SECTIONS:
        if direction == "forward":
            if section["start"] == current_station:
                route.append(section["id"])
                break
        else:
            if section["end"] == current_station:
                route.append(section["id"])
                break
    
    return route

def get_next_section_towards_destination(current_section_id: str, target_station: str, direction: str) -> Optional[str]:
    """Get the next section towards destination, considering disruptions"""
    current_section = get_section_by_id(current_section_id)
    if not current_section:
        return None
    
    current_station = current_section["end"] if direction == "forward" else current_section["start"]
    
    # If we're at destination, no next section
    if current_station == target_station:
        return None
    
    # Find potential next sections
    candidates = []
    for section in SECTIONS:
        if direction == "forward" and section["start"] == current_station:
            candidates.append(section["id"])
        elif direction == "backward" and section["end"] == current_station:
            candidates.append(section["id"])
    
    # Filter out disrupted sections and choose best available
    available_sections = []
    for section_id in candidates:
        if not is_section_disrupted(section_id) and not is_section_at_capacity(section_id):
            available_sections.append(section_id)
    
    if available_sections:
        # Prefer main route, fall back to alternatives
        main_route_sections = ["SEC_1", "SEC_2", "SEC_3", "SEC_4", "SEC_5"]
        for section_id in available_sections:
            if section_id in main_route_sections:
                return section_id
        return available_sections[0]  # Use any available alternative
    
    return candidates[0] if candidates else None  # Return even if disrupted (train will wait)

def is_section_disrupted(section_id: str) -> bool:
    """Check if section has active disruptions"""
    disruption = train_state.section_disruptions.get(section_id)
    if not disruption:
        return False
    
    # Check if disruption is still active
    end_time = datetime.fromisoformat(disruption["end_time"])
    return datetime.now() < end_time

def is_section_at_capacity(section_id: str) -> bool:
    """Check if section is at capacity"""
    section = get_section_by_id(section_id)
    if not section:
        return True
    
    occupied_trains = train_state.occupied_sections.get(section_id, [])
    return len(occupied_trains) >= section["capacity"]

def update_section_occupancy():
    """Update which trains occupy which sections"""
    train_state.occupied_sections.clear()
    
    for train_id, train_data in train_state.trains.items():
        if train_data["status"] not in ["Arrived", "Cancelled"]:
            section_id = train_data["current_location"]["section_id"]
            if section_id not in train_state.occupied_sections:
                train_state.occupied_sections[section_id] = []
            train_state.occupied_sections[section_id].append(train_id)

def generate_section_disruptions():
    """Randomly generate section disruptions"""
    # 15% chance of new disruption per update
    if random.random() < 0.15:
        available_sections = [s["id"] for s in SECTIONS if s["id"] not in train_state.section_disruptions]
        if available_sections:
            section_id = random.choice(available_sections)
            disruption_types = ["maintenance", "signal_failure", "track_work", "emergency"]
            disruption_type = random.choice(disruption_types)
            
            duration_minutes = random.randint(10, 60)
            start_time = datetime.now()
            end_time = start_time + timedelta(minutes=duration_minutes)
            
            train_state.section_disruptions[section_id] = {
                "type": disruption_type,
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat(),
                "duration_minutes": duration_minutes,
                "severity": random.choice(["low", "medium", "high"])
            }
            
            logger.info(f"New disruption in {section_id}: {disruption_type} for {duration_minutes} minutes")
    
    # Remove expired disruptions
    expired_sections = []
    for section_id, disruption in train_state.section_disruptions.items():
        end_time = datetime.fromisoformat(disruption["end_time"])
        if datetime.now() >= end_time:
            expired_sections.append(section_id)
    
    for section_id in expired_sections:
        del train_state.section_disruptions[section_id]
        logger.info(f"Disruption cleared in {section_id}")

def calculate_position_progress(train_data: Dict[str, Any], time_elapsed_min: float) -> Dict[str, Any]:
    """Calculate train position based on time elapsed and speed"""
    current_section = get_section_by_id(train_data["current_location"]["section_id"])
    if not current_section:
        return train_data
    
    # Check for stochastic delays (breakdowns, signal stops)
    if random.random() < 0.05:  # 5% chance per update
        train_data["breakdown_until"] = (datetime.now() + timedelta(minutes=random.randint(5, 20))).isoformat()
        logger.info(f"Train {train_data['train_id']} breakdown for emergency stop")
    
    # Check if train is in breakdown
    if train_data.get("breakdown_until"):
        breakdown_end = datetime.fromisoformat(train_data["breakdown_until"])
        if datetime.now() < breakdown_end:
            return train_data  # No movement during breakdown
        else:
            del train_data["breakdown_until"]  # Clear breakdown
    
    # Check if section is disrupted - trains must wait
    if is_section_disrupted(current_section["id"]):
        train_data["status"] = "Waiting - Section Disrupted"
        return train_data
    
    # Check capacity constraints for single-track sections
    if current_section["capacity"] == 1:
        occupied_trains = train_state.occupied_sections.get(current_section["id"], [])
        if len(occupied_trains) > 1 and train_data["train_id"] not in occupied_trains[:1]:
            train_data["status"] = "Waiting - Traffic"
            return train_data
    
    # Base speed calculation with priority considerations
    train_type_data = next((t for t in TRAIN_TYPES if t["name"] == train_data["type"]), TRAIN_TYPES[0])
    base_speed = train_data["max_speed_kmh"]
    
    # Apply speed modifiers
    speed_modifier = 1.0
    if train_data["status"] in ["Delayed", "Waiting - Section Disrupted", "Waiting - Traffic"]:
        speed_modifier = 0.7
    elif train_data["status"] == "Cancelled":
        speed_modifier = 0.0
    
    # Section-specific speed restrictions
    section_disruption = train_state.section_disruptions.get(current_section["id"])
    if section_disruption and section_disruption["severity"] == "high":
        speed_modifier *= 0.4
    elif train_data.get("restricted_speed", False):
        speed_modifier *= 0.6
    
    effective_speed_kmh = min(base_speed * speed_modifier, current_section["max_speed_kmh"])
    
    # Calculate movement
    distance_traveled_km = (effective_speed_kmh / 60) * time_elapsed_min
    distance_traveled_m = distance_traveled_km * 1000
    
    current_position_m = train_data["current_location"]["position_m"]
    section_length_m = current_section["length_km"] * 1000
    new_position_m = current_position_m + distance_traveled_m
    
    # Check if train completed current section
    if new_position_m >= section_length_m:
        next_section_id = get_next_section_towards_destination(
            current_section["id"], 
            train_data["destination_station"],
            train_data["direction"]
        )
        
        if next_section_id:
            train_data["current_location"]["section_id"] = next_section_id
            train_data["current_location"]["position_m"] = new_position_m - section_length_m
            train_data["status"] = "On time"
        else:
            # Check if we're at destination
            current_station = current_section["end"] if train_data["direction"] == "forward" else current_section["start"]
            if current_station == train_data["destination_station"]:
                train_data["current_location"]["position_m"] = section_length_m
                train_data["status"] = "Arrived"
                train_data["actual_arrival"] = datetime.now().isoformat()
                logger.info(f"Train {train_data['train_id']} arrived at {train_data['destination_station']} (journey #{train_data.get('journey_count', 1)})")
            else:
                # No route available - train must wait
                train_data["current_location"]["position_m"] = section_length_m
                train_data["status"] = "Waiting - No Route"
    else:
        train_data["current_location"]["position_m"] = new_position_m
        if train_data["status"] in ["Waiting - Traffic", "Waiting - Section Disrupted"]:
            train_data["status"] = "On time"
    
    return train_data

def initialize_train(train_id: str) -> Dict[str, Any]:
    """Initialize a new train with random destination and direction"""
    now = datetime.now()
    train_type_data = random.choice(TRAIN_TYPES)
    
    # Random destination (not origin station)
    all_destinations = STATIONS[1:]  # Exclude STN_A as destination
    destination = random.choice(all_destinations)
    
    # Random direction
    direction = random.choice(["forward", "backward"])
    
    # Set starting position based on direction
    if direction == "forward":
        starting_section = "SEC_1"
        starting_position = random.randint(0, 500)
    else:
        starting_section = "SEC_5"  # Start from end for backward trains
        starting_position = random.randint(8600, 9100)  # Near end of section
        destination = random.choice(["STN_A", "STN_B", "STN_C"])  # Backward destinations
    
    train_data = {
        "train_id": train_id,
        "type": train_type_data["name"],
        "priority": train_type_data["priority"],
        "max_speed_kmh": random.randint(*train_type_data["speed_range"]),
        "length_m": random.randint(150, 400),
        "direction": direction,
        "destination_station": destination,
        "current_location": {
            "section_id": starting_section,
            "position_m": starting_position
        },
        "status": "On time",
        "actual_departure": (now - timedelta(minutes=random.randint(15, 45))).isoformat(),
        "actual_arrival": None,
        "restricted_speed": random.choice([True, False]) if random.random() < 0.2 else False,
        "journey_count": 1
    }
    
    return train_data

def reset_train_for_new_journey(train_data: Dict[str, Any]) -> Dict[str, Any]:
    """Reset an arrived train for a new journey"""
    now = datetime.now()
    train_type_data = random.choice(TRAIN_TYPES)
    
    # Random new destination and direction
    direction = random.choice(["forward", "backward"])
    
    if direction == "forward":
        starting_section = "SEC_1"
        starting_position = 0.0
        destinations = STATIONS[1:]  # B, C, D, E, F
    else:
        starting_section = "SEC_5"
        starting_position = 0.0
        destinations = ["STN_A", "STN_B", "STN_C"]  # Backward destinations
    
    destination = random.choice(destinations)
    
    logger.info(f"Train {train_data['train_id']} starting new {direction} journey to {destination}")
    
    return {
        "train_id": train_data["train_id"],
        "type": train_type_data["name"],
        "priority": train_type_data["priority"],
        "max_speed_kmh": random.randint(*train_type_data["speed_range"]),
        "length_m": random.randint(150, 400),
        "direction": direction,
        "destination_station": destination,
        "current_location": {
            "section_id": starting_section,
            "position_m": starting_position
        },
        "status": "On time",
        "actual_departure": now.isoformat(),
        "actual_arrival": None,
        "restricted_speed": random.choice([True, False]) if random.random() < 0.2 else False,
        "journey_count": train_data.get("journey_count", 0) + 1
    }

def update_train_data(train_data: Dict[str, Any], time_elapsed_min: float) -> Dict[str, Any]:
    """Update train data for the current time step"""
    if train_data["status"] == "Arrived":
        return reset_train_for_new_journey(train_data)
    
    train_data = calculate_position_progress(train_data, time_elapsed_min)
    
    # Dynamic status updates based on priority conflicts
    if random.random() < 0.2:
        current_section = get_section_by_id(train_data["current_location"]["section_id"])
        if current_section and current_section["capacity"] == 1:
            # Check for priority conflicts
            occupied_trains = train_state.occupied_sections.get(current_section["id"], [])
            if len(occupied_trains) > 1:
                train_priorities = [(tid, train_state.trains[tid]["priority"]) for tid in occupied_trains if tid in train_state.trains]
                train_priorities.sort(key=lambda x: x[1], reverse=True)  # Highest priority first
                
                # Lower priority trains get delayed
                for i, (tid, priority) in enumerate(train_priorities[1:], 1):
                    if tid == train_data["train_id"]:
                        train_data["status"] = "Delayed"
    
    # Random speed restrictions
    if random.random() < 0.1:
        train_data["restricted_speed"] = not train_data.get("restricted_speed", False)
    
    return train_data

def generate_train_bundle(train_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate enhanced train data bundle with disruption info"""
    current_section = get_section_by_id(train_data["current_location"]["section_id"])
    
    section_data = {
        "section_id": current_section["id"],
        "start_station": current_section["start"],
        "end_station": current_section["end"],
        "length_km": current_section["length_km"],
        "capacity": current_section["capacity"],
        "max_speed_kmh": current_section["max_speed_kmh"],
        "track_type": current_section["track_type"],
        "is_disrupted": is_section_disrupted(current_section["id"]),
        "occupancy_count": len(train_state.occupied_sections.get(current_section["id"], []))
    }
    
    # Enhanced signal data with priority handling
    occupied_trains = train_state.occupied_sections.get(current_section["id"], [])
    signal_data = {
        "block_id": f"BLK_{current_section['id'][4:]}01",
        "section_id": current_section["id"],
        "occupancy_status": "occupied" if occupied_trains else "free",
        "occupying_trains": len(occupied_trains),
        "signal_type": "automatic" if current_section["capacity"] > 1 else "manual",
        "headway_time_s": random.randint(60, 300),
        "priority_override": any(train_state.trains.get(tid, {}).get("priority", 1) >= 5 for tid in occupied_trains)
    }
    
    # Enhanced event data
    disruption = train_state.section_disruptions.get(current_section["id"])
    has_disruption = disruption is not None
    has_breakdown = train_data.get("breakdown_until") is not None
    
    event_data = {
        "event_type": "Section Disruption" if has_disruption else "Breakdown" if has_breakdown else 
                     "Delay" if train_data["status"] == "Delayed" else "Restriction" if train_data.get("restricted_speed") else "None",
        "train_id": train_data["train_id"],
        "section_id": current_section["id"],
        "timestamp": datetime.now().isoformat() if (has_disruption or has_breakdown or 
                    train_data["status"] == "Delayed" or train_data.get("restricted_speed")) else None,
        "disruption_details": disruption if has_disruption else None,
        "delay_duration_min": random.randint(5, 60) if train_data["status"] == "Delayed" else 0
    }
    
    return {
        "train": train_data,
        "section": section_data,
        "signal": signal_data,
        "event": event_data
    }

def update_train_state():
    """Update the global train state based on elapsed time"""
    global train_state
    
    current_time = datetime.now()
    time_since_last_update = (current_time - train_state.last_update).total_seconds() / 60
    
    if not train_state.initialized:
        logger.info("Initializing 10 trains (TR001-TR010) with random destinations and directions")
        for i in range(1, 11):
            train_id = f"TR{str(i).zfill(3)}"
            train_data = initialize_train(train_id)
            train_state.trains[train_id] = train_data
        train_state.initialized = True
        train_state.last_update = current_time
    else:
        # Generate section disruptions
        generate_section_disruptions()
        
        # Update section occupancy
        update_section_occupancy()
        
        # Update all trains
        for train_id, train_data in train_state.trains.items():
            train_state.trains[train_id] = update_train_data(train_data, time_since_last_update)
        
        train_state.last_update = current_time

def generate_train_snapshot():
    """Generate complete train snapshot with enhanced traffic management"""
    update_train_state()
    
    current_time = datetime.now()
    snapshot = copy.deepcopy(TRAIN_DATA_TEMPLATE)
    snapshot["timestamp"] = current_time.isoformat()
    snapshot["payload"] = []
    
    # Add system status
    snapshot["system_status"] = {
        "active_disruptions": len(train_state.section_disruptions),
        "disrupted_sections": list(train_state.section_disruptions.keys()),
        "section_occupancy": {k: len(v) for k, v in train_state.occupied_sections.items()}
    }
    
    # Generate bundles for all trains
    for train_id in sorted(train_state.trains.keys()):
        train_data = train_state.trains[train_id]
        bundle = generate_train_bundle(train_data)
        snapshot["payload"].append(bundle)
    
    return snapshot

# API Endpoints

@app.get("/")
async def get():
    return {
        "message": "Enhanced Traffic Management API",
        "endpoints": {
            "train_data": "/api/train-data",
            "health": "/health",
            "trains": "/trains",
            "reset": "/reset",
            "summary": "/api/train-data/summary",
            "disruptions": "/api/disruptions",
            "schedule": "/api/schedule",
            "optimization_results": "/api/optimization/results"
        },
        "features": [
            "Random destinations and bidirectional traffic",
            "Real-time section disruptions and maintenance",
            "Priority-based routing and conflict resolution",
            "Stochastic delays and breakdowns",
            "Dynamic rerouting with alternate paths",
            "Section capacity management"
        ]
    }

@app.get("/api/train-data", response_model=TrainSnapshotResponse)
async def get_train_data():
    """Get current train data snapshot - enhanced with traffic management"""
    try:
        train_data = generate_train_snapshot()
        return train_data
    except Exception as e:
        logger.error(f"Error generating train data: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate train data")

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint with enhanced statistics"""
    update_train_state()
    
    active_trains = sum(1 for train in train_state.trains.values() 
                       if train["status"] not in ["Arrived", "Cancelled"])
    
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "total_trains": len(train_state.trains),
        "active_trains": active_trains,
        "active_disruptions": len(train_state.section_disruptions),
        "disrupted_sections": list(train_state.section_disruptions.keys())
    }
    



@app.get("/trains")
async def get_current_trains():
    """Get current state of all trains with routing info"""
    update_train_state()
    return {
        "trains": train_state.trains, 
        "section_occupancy": train_state.occupied_sections,
        "disruptions": train_state.section_disruptions,
        "initialized": train_state.initialized,
        "last_update": train_state.last_update.isoformat()
    }

@app.get("/api/disruptions")
async def get_disruptions():
    """Get current section disruptions"""
    update_train_state()
    return {
        "active_disruptions": train_state.section_disruptions,
        "affected_sections": len(train_state.section_disruptions),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/reset")
async def reset_simulation():
    """Reset the simulation"""
    global train_state
    train_state = TrainState()
    return {"message": "Enhanced simulation reset", "timestamp": datetime.now().isoformat()}

latest_optimization_result = {}

@app.get("/api/optimization/results")
def get_optimization_results():
    """Get the latest optimization results"""
    if not latest_optimization_result:
        return {"message": "No optimization results available yet", "data": {}}
    
    return {
        "message": "Latest optimization results",
        "timestamp": latest_optimization_result.get("timestamp", ""),
        "data": latest_optimization_result
    }

@app.post("/api/optimization/results")
def update_optimization_results(data: dict):
    """Update optimization results from external optimizer"""
    global latest_optimization_result
    latest_optimization_result = {
        **data,
        "timestamp": datetime.now().isoformat(),
        "received_at": datetime.now().isoformat()
    }
    return {"message": "Optimization results updated successfully"}


@app.get("/api/train-data/summary")
async def get_train_summary():
    """Get enhanced summary of train operations"""
    update_train_state()
    
    status_counts = {}
    train_types = {}
    direction_counts = {"forward": 0, "backward": 0}
    destination_counts = {}
    
    for train in train_state.trains.values():
        # Count by status
        status = train["status"]
        status_counts[status] = status_counts.get(status, 0) + 1
        
        # Count by type
        train_type = train["type"]
        train_types[train_type] = train_types.get(train_type, 0) + 1
        
        # Count by direction
        direction = train.get("direction", "forward")
        direction_counts[direction] = direction_counts.get(direction, 0) + 1
        
        # Count by destination
        destination = train.get("destination_station", "Unknown")
        destination_counts[destination] = destination_counts.get(destination, 0) + 1
    
    return {
        "total_trains": len(train_state.trains),
        "status_breakdown": status_counts,
        "type_breakdown": train_types,
        "direction_breakdown": direction_counts,
        "destination_breakdown": destination_counts,
        "active_disruptions": len(train_state.section_disruptions),
        "section_occupancy": {k: len(v) for k, v in train_state.occupied_sections.items()},
        "timestamp": datetime.now().isoformat(),
        "system_uptime_minutes": (datetime.now() - train_state.start_time).total_seconds() / 60
    }

# ===== SIMULATION ENDPOINTS =====

import httpx

class SimulationRequest(BaseModel):
    scenario_type: str  # 'delay', 'disruption', 'maintenance', 'weather'
    parameters: Dict[str, Any]
    use_real_time_data: bool = True

class SimulationResult(BaseModel):
    simulation_id: str
    timestamp: str
    input_data: Dict[str, Any]
    projected_impact: Dict[str, Any]
    recommendations: List[Dict[str, Any]]

async def fetch_real_time_data() -> Dict[str, Any]:
    """Fetch real-time data from existing backend endpoints"""
    base_url = "http://127.0.0.1:8000"
    
    try:
        async with httpx.AsyncClient() as client:
            # Fetch all required data concurrently
            train_data_response = await client.get(f"{base_url}/api/train-data")
            trains_response = await client.get(f"{base_url}/trains")
            disruptions_response = await client.get(f"{base_url}/api/disruptions")
            health_response = await client.get(f"{base_url}/health")
            
            # Parse responses
            train_data = train_data_response.json() if train_data_response.status_code == 200 else {}
            trains_data = trains_response.json() if trains_response.status_code == 200 else {}
            disruptions_data = disruptions_response.json() if disruptions_response.status_code == 200 else {}
            health_data = health_response.json() if health_response.status_code == 200 else {}
            
            # Try to fetch schedule and optimization results (may not always be available)
            try:
                schedule_response = await client.get(f"{base_url}/api/schedule")
                schedule_data = schedule_response.json() if schedule_response.status_code == 200 else {}
            except:
                schedule_data = {}
            
            try:
                optimization_response = await client.get(f"{base_url}/api/optimization/results")
                optimization_data = optimization_response.json() if optimization_response.status_code == 200 else {}
            except:
                optimization_data = {}
            
            return {
                "train_data": train_data,
                "trains": trains_data,
                "disruptions": disruptions_data,
                "health": health_data,
                "schedule": schedule_data,
                "optimization": optimization_data
            }
    except Exception as e:
        logger.error(f"Error fetching real-time data: {e}")
        # Return current state as fallback
        return {
            "train_data": generate_train_snapshot(),
            "trains": {
                "trains": train_state.trains,
                "section_occupancy": train_state.occupied_sections,
                "disruptions": train_state.section_disruptions,
                "initialized": train_state.initialized
            },
            "disruptions": {"active_disruptions": train_state.section_disruptions},
            "health": {
                "status": "healthy",
                "total_trains": len(train_state.trains),
                "active_trains": len([t for t in train_state.trains.values() if t["status"] not in ["Arrived", "Cancelled"]]),
                "active_disruptions": len(train_state.section_disruptions)
            },
            "schedule": {},
            "optimization": {}
        }

def extract_trains_from_real_data(real_data: Dict) -> List[Dict]:
    """Extract train information from real-time data"""
    trains = []
    
    # Try to get trains from train_data payload first
    if "train_data" in real_data and "payload" in real_data["train_data"]:
        for bundle in real_data["train_data"]["payload"]:
            if "train" in bundle:
                train = bundle["train"]
                trains.append({
                    "train_id": train.get("train_id"),
                    "type": train.get("type"),
                    "priority": train.get("priority", 3),
                    "current_section_id": train.get("current_location", {}).get("section_id"),
                    "status": train.get("status"),
                    "destination_station": train.get("destination_station"),
                    "max_speed_kmh": train.get("max_speed_kmh", 120),
                    "direction": train.get("direction", "forward")
                })
    
    # Fallback to trains endpoint data
    elif "trains" in real_data and "trains" in real_data["trains"]:
        for train_id, train in real_data["trains"]["trains"].items():
            trains.append({
                "train_id": train_id,
                "type": train.get("type"),
                "priority": train.get("priority", 3),
                "current_section_id": train.get("current_location", {}).get("section_id"),
                "status": train.get("status"),
                "destination_station": train.get("destination_station"),
                "max_speed_kmh": train.get("max_speed_kmh", 120),
                "direction": train.get("direction", "forward")
            })
    
    return trains

def extract_sections_from_real_data(real_data: Dict) -> List[Dict]:
    """Extract section information from real-time data"""
    sections = []
    
    # Try to get sections from train_data payload
    if "train_data" in real_data and "payload" in real_data["train_data"]:
        seen_sections = set()
        for bundle in real_data["train_data"]["payload"]:
            if "section" in bundle:
                section = bundle["section"]
                section_id = section.get("section_id")
                if section_id and section_id not in seen_sections:
                    sections.append({
                        "id": section_id,
                        "start": section.get("start_station"),
                        "end": section.get("end_station"),
                        "length_km": section.get("length_km", 10),
                        "capacity": section.get("capacity", 2),
                        "max_speed_kmh": section.get("max_speed_kmh", 120),
                        "track_type": section.get("track_type", "double"),
                        "occupancy_count": section.get("occupancy_count", 0)
                    })
                    seen_sections.add(section_id)
    
    # Fallback to hardcoded sections if no real data available
    if not sections:
        sections = SECTIONS
    
    return sections

def calculate_system_load_from_real_data(trains: List[Dict], sections: List[Dict]) -> float:
    """Calculate current system utilization percentage from real data"""
    if not sections:
        return 0.0
    
    total_capacity = sum(section.get("capacity", 1) for section in sections)
    active_trains = len([t for t in trains if t.get("status") not in ["Arrived", "Cancelled", "out_of_service"]])
    
    return min(100.0, (active_trains / max(total_capacity, 1)) * 100)

def find_alternative_routes_from_real_data(train: Dict, sections: List[Dict]) -> List[str]:
    """Find alternative routes for a train using real section data"""
    alternatives = []
    current_section = train.get("current_section_id")
    destination = train.get("destination_station")
    
    if current_section and destination:
        # Find alternative sections that connect to destination
        for section in sections:
            if (section.get("id") != current_section and 
                (section.get("end") == destination or section.get("start") == destination)):
                alternatives.append(f"Route via {section.get('id')}")
    
    return alternatives[:3]  # Return max 3 alternatives

def estimate_passenger_count_from_real_data(train: Dict) -> int:
    """Estimate passenger count based on real train data"""
    train_type = train.get("type", "Local")
    current_hour = datetime.now().hour
    
    # Base passenger counts by train type
    base_passengers = {
        "Express": 300,
        "High-Speed": 400,
        "Local": 150,
        "Freight": 0
    }.get(train_type, 150)
    
    # Time-based multipliers (peak hours)
    time_multiplier = 1.2 if 7 <= current_hour <= 9 or 17 <= current_hour <= 19 else 0.8
    
    # Status-based adjustments
    status_multiplier = 0.9 if train.get("status") == "Delayed" else 1.0
    
    return int(base_passengers * time_multiplier * status_multiplier * (0.8 + random.random() * 0.4))

def calculate_projected_delay_from_real_data(train: Dict, parameters: Dict) -> float:
    """Calculate projected delay for a train based on scenario and real data"""
    base_delay = parameters.get("duration_minutes", 30)
    severity_multiplier = {
        "low": 0.3,
        "medium": 0.6,
        "high": 0.9,
        "critical": 1.2
    }.get(parameters.get("severity", "medium"), 0.6)
    
    train_priority = train.get("priority", 3)
    priority_factor = max(0.2, 1.0 - (train_priority - 1) * 0.2)
    
    # Consider current status
    status_factor = 1.5 if train.get("status") == "Delayed" else 1.0
    
    return base_delay * severity_multiplier * priority_factor * status_factor

def should_train_be_affected_by_real_scenario(train: Dict, parameters: Dict) -> bool:
    """Determine if a train should be affected by the scenario using real data"""
    target_train_id = parameters.get("train_id")
    target_section_id = parameters.get("section_id")
    
    # If specific train is targeted
    if target_train_id and train.get("train_id") == target_train_id:
        return True
    
    # If specific section is targeted
    if target_section_id and train.get("current_section_id") == target_section_id:
        return True
    
    # If train is already in problematic state, higher chance of being affected
    if train.get("status") in ["Delayed", "Waiting - Traffic", "Waiting - Section Disrupted"]:
        base_probability = 0.7
    else:
        base_probability = {
            "low": 0.2,
            "medium": 0.4,
            "high": 0.6,
            "critical": 0.8
        }.get(parameters.get("severity", "medium"), 0.4)
    
    return random.random() < base_probability

def calculate_system_metrics_from_real_data(affected_trains: List[Dict], parameters: Dict, all_trains: List[Dict], sections: List[Dict]) -> Dict:
    """Calculate overall system impact metrics using real data"""
    total_delay = sum(train.get("projected_delay", 0) for train in affected_trains)
    total_passengers = sum(train.get("passenger_count", 0) for train in affected_trains)
    
    # Calculate capacity utilization from real data
    total_capacity = sum(section.get("capacity", 1) for section in sections)
    active_trains = len([t for t in all_trains if t.get("status") not in ["Arrived", "Cancelled", "out_of_service"]])
    capacity_utilization = min(100.0, (active_trains / max(total_capacity, 1)) * 100)
    
    # Estimate revenue impact based on real passenger counts
    avg_ticket_price = 25.0  # USD
    refund_rate = 0.15 if parameters.get("severity") in ["high", "critical"] else 0.10
    revenue_impact = total_passengers * avg_ticket_price * refund_rate
    
    return {
        "total_delay_minutes": total_delay,
        "affected_passengers": total_passengers,
        "revenue_impact": revenue_impact,
        "capacity_utilization": capacity_utilization,
        "alternative_routes_needed": len([t for t in affected_trains if t.get("alternative_routes")])
    }

def generate_recommendations_from_real_data(scenario_type: str, current_state: Dict, affected_count: int) -> List[Dict]:
    """Generate recommendations based on scenario type and real system state"""
    recommendations = []
    
    if scenario_type == "delay":
        recommendations = [
            {
                "action": f"Deploy {min(affected_count // 2 + 1, 3)} additional trains on affected routes",
                "priority": "high" if affected_count > 5 else "medium",
                "estimated_benefit": f"Reduce delays by {20 + min(affected_count * 2, 20)}%",
                "implementation_time": 15
            },
            {
                "action": "Activate real-time passenger notification system",
                "priority": "medium",
                "estimated_benefit": "Improve passenger satisfaction by 40%",
                "implementation_time": 2
            },
            {
                "action": "Enable dynamic route optimization",
                "priority": "medium",
                "estimated_benefit": "Distribute load more efficiently",
                "implementation_time": 8
            }
        ]
    elif scenario_type == "disruption":
        recommendations = [
            {
                "action": "Activate emergency response protocols immediately",
                "priority": "critical",
                "estimated_benefit": "Minimize service interruption",
                "implementation_time": 1
            },
            {
                "action": f"Reroute {affected_count} affected trains via alternative tracks",
                "priority": "high",
                "estimated_benefit": "Maintain 65-75% service capacity",
                "implementation_time": 12
            },
            {
                "action": "Deploy emergency shuttle services at affected stations",
                "priority": "high",
                "estimated_benefit": "Cover service gaps for passengers",
                "implementation_time": 25
            }
        ]
    elif scenario_type == "maintenance":
        recommendations = [
            {
                "action": "Optimize maintenance scheduling for off-peak hours",
                "priority": "medium",
                "estimated_benefit": "Reduce passenger impact by 50-70%",
                "implementation_time": 0
            },
            {
                "action": "Increase service frequency on parallel routes",
                "priority": "medium",
                "estimated_benefit": "Maintain overall service quality",
                "implementation_time": 20
            },
            {
                "action": "Implement temporary speed restrictions",
                "priority": "low",
                "estimated_benefit": "Ensure safety during maintenance",
                "implementation_time": 5
            }
        ]
    else:  # weather
        recommendations = [
            {
                "action": "Apply system-wide speed restrictions for safety",
                "priority": "high",
                "estimated_benefit": "Prevent weather-related incidents",
                "implementation_time": 3
            },
            {
                "action": "Increase train separation intervals",
                "priority": "medium",
                "estimated_benefit": "Enhanced safety margins",
                "implementation_time": 8
            },
            {
                "action": "Deploy additional maintenance crews",
                "priority": "medium",
                "estimated_benefit": "Quick response to weather issues",
                "implementation_time": 15
            }
        ]
    
    return recommendations

@app.post("/api/simulate", response_model=SimulationResult)
async def run_simulation(request: SimulationRequest):
    """Run what-if simulation using real-time system data"""
    try:
        # Generate unique simulation ID
        import uuid
        simulation_id = f"sim_{uuid.uuid4().hex[:8]}"
        
        # Fetch real-time data from existing endpoints
        real_data = await fetch_real_time_data()
        
        # Extract structured data
        current_trains = extract_trains_from_real_data(real_data)
        current_sections = extract_sections_from_real_data(real_data)
        current_disruptions = real_data.get("disruptions", {}).get("active_disruptions", {})
        
        # Calculate input data using real-time information
        input_data = {
            "current_trains": len(current_trains),
            "active_sections": len([s for s in current_sections if s.get("id")]),
            "system_load": calculate_system_load_from_real_data(current_trains, current_sections),
            "active_disruptions": len(current_disruptions)
        }
        
        # Analyze impact using real-time data
        affected_trains = []
        for train in current_trains:
            if should_train_be_affected_by_real_scenario(train, request.parameters):
                affected_train = {
                    "train_id": train.get("train_id"),
                    "current_position": train.get("current_section_id"),
                    "projected_delay": calculate_projected_delay_from_real_data(train, request.parameters),
                    "alternative_routes": find_alternative_routes_from_real_data(train, current_sections),
                    "passenger_count": estimate_passenger_count_from_real_data(train)
                }
                affected_trains.append(affected_train)
        
        projected_impact = {
            "affected_trains": affected_trains,
            "system_metrics": calculate_system_metrics_from_real_data(
                affected_trains, request.parameters, current_trains, current_sections
            )
        }
        
        # Generate recommendations based on real scenario impact
        recommendations = generate_recommendations_from_real_data(
            request.scenario_type, real_data, len(affected_trains)
        )
        
        # Create simulation result
        result = SimulationResult(
            simulation_id=simulation_id,
            timestamp=datetime.now().isoformat(),
            input_data=input_data,
            projected_impact=projected_impact,
            recommendations=recommendations
        )
        
        logger.info(f"Simulation {simulation_id} completed using real-time data: {len(affected_trains)} trains affected")
        return result
        
    except Exception as e:
        logger.error(f"Real-time simulation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

async def fetch_dynamic_scenarios() -> List[Dict]:
    """Fetch scenario templates from real-time data or configuration"""
    try:
        # Try to fetch scenarios from optimization endpoint or configuration
        async with httpx.AsyncClient() as client:
            try:
                # Attempt to get scenarios from optimization results
                response = await client.get("http://127.0.0.1:8000/api/optimization/results")
                if response.status_code == 200:
                    data = response.json()
                    if "scenario_templates" in data.get("data", {}):
                        return data["data"]["scenario_templates"]
            except:
                pass
            
            # Try to fetch from health endpoint to understand current system state
            health_response = await client.get("http://127.0.0.1:8000/health")
            health_data = health_response.json() if health_response.status_code == 200 else {}
            
            # Generate dynamic scenarios based on current system health
            scenarios = []
            
            # Base scenarios that adapt to current system state
            active_disruptions = health_data.get("active_disruptions", 0)
            total_trains = health_data.get("total_trains", 10)
            
            # Delay scenario - severity based on current system load
            scenarios.append({
                "id": "adaptive-delay",
                "name": f"Train Delay ({total_trains} trains active)",
                "type": "delay",
                "description": f"Simulate delays affecting up to {min(total_trains // 2, 5)} trains",
                "parameters": {
                    "duration_minutes": 25 + (active_disruptions * 10),
                    "severity": "high" if active_disruptions > 2 else "medium",
                    "train_type": "Express"
                }
            })
            
            # Disruption scenario - adapted to current disruptions
            scenarios.append({
                "id": "system-disruption",
                "name": f"Track Disruption ({'Critical' if active_disruptions > 1 else 'Standard'})",
                "type": "disruption",
                "description": "Complete section blockage requiring immediate rerouting",
                "parameters": {
                    "duration_minutes": 90 + (active_disruptions * 30),
                    "severity": "critical" if active_disruptions > 1 else "high"
                }
            })
            
            # Maintenance scenario
            scenarios.append({
                "id": "scheduled-maintenance",
                "name": "Planned Track Maintenance",
                "type": "maintenance",
                "description": "Scheduled maintenance reducing system capacity",
                "parameters": {
                    "duration_minutes": 180,
                    "severity": "low" if datetime.now().hour < 6 or datetime.now().hour > 22 else "medium"
                }
            })
            
            # Weather scenario - time-sensitive
            current_hour = datetime.now().hour
            weather_severity = "high" if 6 <= current_hour <= 10 or 16 <= current_hour <= 20 else "medium"
            scenarios.append({
                "id": "weather-impact",
                "name": f"Weather Conditions ({'Peak Hours' if weather_severity == 'high' else 'Off-Peak'})",
                "type": "weather",
                "description": "Adverse weather requiring speed restrictions",
                "parameters": {
                    "duration_minutes": 120,
                    "severity": weather_severity
                }
            })
            
            return scenarios
            
    except Exception as e:
        logger.error(f"Error fetching dynamic scenarios: {e}")
        # Return basic fallback scenarios
        return [
            {
                "id": "basic-delay",
                "name": "Express Train Delay",
                "type": "delay",
                "description": "Standard 30-minute delay scenario",
                "parameters": {"duration_minutes": 30, "severity": "medium"}
            },
            {
                "id": "basic-disruption",
                "name": "Track Blockage",
                "type": "disruption",
                "description": "Complete track blockage",
                "parameters": {"duration_minutes": 120, "severity": "critical"}
            }
        ]

@app.get("/api/simulation/scenarios")
async def get_predefined_scenarios():
    """Get list of dynamically generated simulation scenarios"""
    try:
        scenarios = await fetch_dynamic_scenarios()
        return {"scenarios": scenarios}
    except Exception as e:
        logger.error(f"Error getting scenarios: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch simulation scenarios")

@app.get("/api/simulation/system-state")
async def get_current_system_state():
    """Get current system state for simulation using real-time data"""
    try:
        # Fetch real-time data
        real_data = await fetch_real_time_data()
        
        # Extract trains information
        trains_list = extract_trains_from_real_data(real_data)
        available_trains = [
            {
                "train_id": train.get("train_id"),
                "type": train.get("type"),
                "current_section": train.get("current_section_id"),
                "status": train.get("status"),
                "destination": train.get("destination_station")
            }
            for train in trains_list
            if train.get("status") not in ["out_of_service", "Cancelled"]
        ]
        
        # Extract sections information
        sections_list = extract_sections_from_real_data(real_data)
        available_sections = []
        
        # Get occupancy data
        occupancy_data = {}
        if "trains" in real_data and "section_occupancy" in real_data["trains"]:
            occupancy_data = real_data["trains"]["section_occupancy"]
        
        for section in sections_list:
            section_id = section.get("id")
            available_sections.append({
                "section_id": section_id,
                "name": f"{section.get('start', 'Unknown')} - {section.get('end', 'Unknown')}",
                "status": "operational" if not any(
                    section_id in str(disruption) for disruption in 
                    real_data.get("disruptions", {}).get("active_disruptions", {}).values()
                ) else "disrupted",
                "capacity": section.get("capacity", 2),
                "current_occupancy": len(occupancy_data.get(section_id, []))
            })
        
        # Extract disruption information
        disruptions = list(real_data.get("disruptions", {}).get("active_disruptions", {}).values())
        
        return {
            "trains": available_trains,
            "sections": available_sections,
            "disruptions": disruptions,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting system state: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch system state")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)