export interface TrainBundle {
  train: {
    train_id: string;
    type: "Express" | "Freight" | "Local" | "High-Speed";
    priority: number;
    max_speed_kmh: number;
    length_m: number;
    direction: "forward" | "backward";
    destination_station: string;
    current_location: { 
      section_id: string; 
      position_m: number; 
    };
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

export interface HealthResponse {
  status: string;
  timestamp: string;
  total_trains: number;
  active_trains: number;
  active_disruptions: number;
  disrupted_sections: string[];
}

export interface TrainState {
  train_id: string;
  status: "On time" | "Delayed" | "Waiting" | "Arrived" | "Cancelled";
  current_section: string;
  position_percent: number;
  speed_kmh: number;
  delay_minutes: number;
}

export interface Disruption {
  section_id: string;
  type: "maintenance" | "signal_failure" | "track_work" | "emergency";
  severity: "low" | "medium" | "high";
  start_time: string;
  estimated_end_time: string;
  description: string;
  affected_trains: string[];
}

export interface OptimizationResult {
  train_id: string;
  action: "proceed" | "hold_until_TIMESTAMP" | "reroute";
  timestamp?: string;
  new_route?: string[];
  reason: string;
  priority_score: number;
}

export interface SummaryStats {
  total_trains: number;
  active_trains: number;
  on_time_trains: number;
  delayed_trains: number;
  average_speed: number;
  average_delay: number;
  sections_disrupted: number;
}

export interface Section {
  section_id: string;
  start_station: string;
  end_station: string;
  length_km: number;
  capacity: number;
  max_speed_kmh: number;
  track_type: "single" | "double";
  is_disrupted: boolean;
  occupancy_count: number;
  utilization_percent: number;
}

export interface TrainVisualization {
  train_id: string;
  type: "Express" | "Freight" | "Local" | "High-Speed";
  section_id: string;
  position_percent: number;
  direction: "forward" | "backward";
  priority: number;
  speed_kmh: number;
  status: string;
}

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  status: "success" | "error";
  message?: string;
}