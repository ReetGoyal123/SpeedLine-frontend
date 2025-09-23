import { TrainBundle, HealthResponse, Disruption, OptimizationResult, SummaryStats } from '@/types';

// Mock data for when backend is not available
export const mockTrainData: TrainBundle[] = [
  {
    train: {
      train_id: "TR001",
      type: "Express",
      priority: 5,
      max_speed_kmh: 160,
      length_m: 200,
      direction: "forward",
      destination_station: "STN_F",
      current_location: { section_id: "SEC_1", position_m: 2500 },
      status: "On time",
      actual_departure: "2025-09-23T08:00:00Z",
      actual_arrival: null,
      journey_count: 1
    },
    section: {
      section_id: "SEC_1",
      start_station: "STN_A",
      end_station: "STN_B", 
      length_km: 8.5,
      capacity: 2,
      max_speed_kmh: 120,
      track_type: "double",
      is_disrupted: false,
      occupancy_count: 1
    },
    signal: {
      block_id: "BLK_1",
      section_id: "SEC_1",
      occupancy_status: "occupied",
      occupying_trains: 1,
      signal_type: "automatic",
      headway_time_s: 120,
      priority_override: false
    },
    event: {
      event_type: "departure",
      train_id: "TR001",
      section_id: "SEC_1",
      timestamp: "2025-09-23T08:00:00Z",
      disruption_details: null,
      delay_duration_min: 0
    }
  },
  {
    train: {
      train_id: "TR002",
      type: "Freight",
      priority: 2,
      max_speed_kmh: 100,
      length_m: 500,
      direction: "forward",
      destination_station: "STN_E",
      current_location: { section_id: "SEC_2", position_m: 3100 },
      status: "Delayed",
      actual_departure: "2025-09-23T07:45:00Z",
      actual_arrival: null,
      journey_count: 1
    },
    section: {
      section_id: "SEC_2",
      start_station: "STN_B",
      end_station: "STN_C",
      length_km: 6.2,
      capacity: 1,
      max_speed_kmh: 100,
      track_type: "single",
      is_disrupted: true,
      occupancy_count: 1
    },
    signal: {
      block_id: "BLK_2",
      section_id: "SEC_2",
      occupancy_status: "occupied",
      occupying_trains: 1,
      signal_type: "manual",
      headway_time_s: 180,
      priority_override: true
    },
    event: {
      event_type: "delay",
      train_id: "TR002",
      section_id: "SEC_2",
      timestamp: "2025-09-23T08:15:00Z",
      disruption_details: { reason: "signal_failure" },
      delay_duration_min: 15
    }
  },
  {
    train: {
      train_id: "TR003",
      type: "Local",
      priority: 3,
      max_speed_kmh: 120,
      length_m: 180,
      direction: "backward",
      destination_station: "STN_A",
      current_location: { section_id: "SEC_3", position_m: 4200 },
      status: "On time",
      actual_departure: "2025-09-23T08:30:00Z",
      actual_arrival: null,
      journey_count: 1
    },
    section: {
      section_id: "SEC_3",
      start_station: "STN_C",
      end_station: "STN_D",
      length_km: 7.8,
      capacity: 2,
      max_speed_kmh: 140,
      track_type: "double",
      is_disrupted: false,
      occupancy_count: 1
    },
    signal: {
      block_id: "BLK_3",
      section_id: "SEC_3",
      occupancy_status: "occupied",
      occupying_trains: 1,
      signal_type: "automatic",
      headway_time_s: 90,
      priority_override: false
    },
    event: {
      event_type: "in_transit",
      train_id: "TR003",
      section_id: "SEC_3",
      timestamp: "2025-09-23T08:45:00Z",
      disruption_details: null,
      delay_duration_min: 0
    }
  },
  {
    train: {
      train_id: "TR004",
      type: "High-Speed",
      priority: 5,
      max_speed_kmh: 180,
      length_m: 250,
      direction: "forward",
      destination_station: "STN_F",
      current_location: { section_id: "SEC_5", position_m: 1800 },
      status: "On time",
      actual_departure: "2025-09-23T09:00:00Z",
      actual_arrival: null,
      journey_count: 1
    },
    section: {
      section_id: "SEC_5",
      start_station: "STN_E",
      end_station: "STN_F",
      length_km: 9.1,
      capacity: 3,
      max_speed_kmh: 160,
      track_type: "double",
      is_disrupted: false,
      occupancy_count: 1
    },
    signal: {
      block_id: "BLK_5",
      section_id: "SEC_5",
      occupancy_status: "occupied",
      occupying_trains: 1,
      signal_type: "automatic",
      headway_time_s: 60,
      priority_override: false
    },
    event: {
      event_type: "in_transit",
      train_id: "TR004",
      section_id: "SEC_5",
      timestamp: "2025-09-23T09:15:00Z",
      disruption_details: null,
      delay_duration_min: 0
    }
  }
];

export const mockHealthData: HealthResponse = {
  status: "healthy",
  timestamp: new Date().toISOString(),
  total_trains: 4,
  active_trains: 4,
  active_disruptions: 1,
  disrupted_sections: ["SEC_2"]
};

export const mockDisruptions: Disruption[] = [
  {
    section_id: "SEC_2",
    type: "signal_failure",
    severity: "high",
    start_time: "2025-09-23T08:00:00Z",
    estimated_end_time: "2025-09-23T10:00:00Z",
    description: "Signal equipment malfunction causing delays",
    affected_trains: ["TR002"]
  },
  {
    section_id: "SEC_4",
    type: "maintenance",
    severity: "medium",
    start_time: "2025-09-23T06:00:00Z",
    estimated_end_time: "2025-09-23T12:00:00Z",
    description: "Scheduled track maintenance",
    affected_trains: []
  }
];

export const mockOptimizationResults: OptimizationResult[] = [
  {
    train_id: "TR002",
    action: "hold_until_TIMESTAMP",
    timestamp: "2025-09-23T09:30:00Z",
    reason: "Waiting for signal repair completion",
    priority_score: 3.2
  },
  {
    train_id: "TR005",
    action: "reroute",
    new_route: ["SEC_6", "SEC_5"],
    reason: "Avoiding disrupted section SEC_2",
    priority_score: 4.1
  },
  {
    train_id: "TR001",
    action: "proceed",
    reason: "Clear path ahead",
    priority_score: 4.8
  }
];

export const mockSummaryStats: SummaryStats = {
  total_trains: 4,
  active_trains: 4,
  on_time_trains: 3,
  delayed_trains: 1,
  average_speed: 125.5,
  average_delay: 3.75,
  sections_disrupted: 1
};

export const mockSections = [
  {
    section_id: "SEC_1",
    start_station: "STN_A",
    end_station: "STN_B",
    length_km: 8.5,
    capacity: 2,
    max_speed_kmh: 120,
    track_type: "double" as const,
    is_disrupted: false,
    occupancy_count: 1,
    utilization_percent: 50
  },
  {
    section_id: "SEC_2",
    start_station: "STN_B",
    end_station: "STN_C",
    length_km: 6.2,
    capacity: 1,
    max_speed_kmh: 100,
    track_type: "single" as const,
    is_disrupted: true,
    occupancy_count: 1,
    utilization_percent: 100
  },
  {
    section_id: "SEC_3",
    start_station: "STN_C",
    end_station: "STN_D",
    length_km: 7.8,
    capacity: 2,
    max_speed_kmh: 140,
    track_type: "double" as const,
    is_disrupted: false,
    occupancy_count: 1,
    utilization_percent: 50
  },
  {
    section_id: "SEC_4",
    start_station: "STN_D",
    end_station: "STN_E",
    length_km: 5.3,
    capacity: 1,
    max_speed_kmh: 110,
    track_type: "single" as const,
    is_disrupted: false,
    occupancy_count: 0,
    utilization_percent: 0
  },
  {
    section_id: "SEC_5",
    start_station: "STN_E",
    end_station: "STN_F",
    length_km: 9.1,
    capacity: 3,
    max_speed_kmh: 160,
    track_type: "double" as const,
    is_disrupted: false,
    occupancy_count: 1,
    utilization_percent: 33
  },
  {
    section_id: "SEC_6",
    start_station: "STN_B",
    end_station: "STN_E",
    length_km: 12.0,
    capacity: 1,
    max_speed_kmh: 90,
    track_type: "single" as const,
    is_disrupted: false,
    occupancy_count: 0,
    utilization_percent: 0
  }
];