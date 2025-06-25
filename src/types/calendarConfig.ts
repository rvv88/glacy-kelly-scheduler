
export interface CalendarConfig {
  is_open: boolean;
  start_time: string;
  end_time: string;
  interval_minutes: number;
  blocked_times: string[];
}

export interface CalendarConfigState {
  selectedClinicId: string;
  selectedDate: Date | undefined;
  isMonthlyConfig: boolean;
  isLoading: boolean;
  monthlyConfig: CalendarConfig;
  dailyConfig: CalendarConfig;
}
