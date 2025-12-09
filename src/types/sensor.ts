export interface SensorReading {
  id: string;
  device_id: string;
  humidity: number;
  temperature: number;
  soil_humidity: number;
  ph_level: number;
  composter_rotation: number;
  reservoir_rotation: number;
  capacity_status: string;
  recorded_at: string;
}

export interface DeviceSettings {
  id: string;
  user_id: string;
  device_id: string;
  notifications_enabled: boolean;
}

export interface Event {
  id: string;
  event_type: string;
  description: string;
  event_date: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  device_id: string | null;
  username: string | null;
}
