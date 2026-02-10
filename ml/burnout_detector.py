from datetime import datetime, timedelta
import numpy as np

class BurnoutDetector:
    """Analyze user activity patterns to detect burnout risk"""
    
    def __init__(self, activity_log):
        self.activity_log = activity_log
    
    def analyze(self):
        """Main analysis function"""
        if len(self.activity_log) < 5:
            return {
                "burnoutRisk": 0,
                "stressLevel": 5,
                "activityPattern": {
                    "lateNightSessions": 0,
                    "consecutiveDays": 0,
                    "averageSessionLength": 0,
                    "peakProductivityTime": "unknown",
                },
            }
        
        late_night_count = self._count_late_night_sessions()
        consecutive_days = self._count_consecutive_days()
        avg_session_length = self._calculate_avg_session_length()
        peak_time = self._find_peak_productivity_time()
        
        # Calculate burnout risk (0-100)
        burnout_risk = 0
        
        # Late night sessions increase risk
        if late_night_count > 5:
            burnout_risk += 30
        elif late_night_count > 3:
            burnout_risk += 20
        elif late_night_count > 1:
            burnout_risk += 10
        
        # Consecutive days without break
        if consecutive_days > 10:
            burnout_risk += 40
        elif consecutive_days > 7:
            burnout_risk += 25
        elif consecutive_days > 5:
            burnout_risk += 15
        
        # Long session lengths
        if avg_session_length > 6:
            burnout_risk += 20
        elif avg_session_length > 4:
            burnout_risk += 10
        
        # Cap at 100
        burnout_risk = min(100, burnout_risk)
        
        # Stress level (1-10) correlates with burnout risk
        stress_level = min(10, max(1, int(burnout_risk / 10)))
        
        return {
            "burnoutRisk": burnout_risk,
            "stressLevel": stress_level,
            "activityPattern": {
                "lateNightSessions": late_night_count,
                "consecutiveDays": consecutive_days,
                "averageSessionLength": round(avg_session_length, 2),
                "peakProductivityTime": peak_time,
            },
        }
    
    def _count_late_night_sessions(self):
        """Count sessions after 11 PM"""
        count = 0
        for activity in self.activity_log:
            if activity.get("timeOfDay") == "late-night":
                count += 1
        return count
    
    def _count_consecutive_days(self):
        """Count consecutive days of activity without a break"""
        if not self.activity_log:
            return 0
        
        # Sort by timestamp
        sorted_log = sorted(self.activity_log, key=lambda x: x.get("timestamp", datetime.now()))
        
        max_consecutive = 1
        current_consecutive = 1
        
        for i in range(1, len(sorted_log)):
            prev_date = sorted_log[i-1].get("timestamp", datetime.now())
            curr_date = sorted_log[i].get("timestamp", datetime.now())
            
            # Convert string to datetime if needed
            if isinstance(prev_date, str):
                prev_date = datetime.fromisoformat(prev_date.replace('Z', '+00:00'))
            if isinstance(curr_date, str):
                curr_date = datetime.fromisoformat(curr_date.replace('Z', '+00:00'))
            
            # Check if consecutive days
            if (curr_date.date() - prev_date.date()).days == 1:
                current_consecutive += 1
                max_consecutive = max(max_consecutive, current_consecutive)
            elif (curr_date.date() - prev_date.date()).days > 1:
                current_consecutive = 1
        
        return max_consecutive
    
    def _calculate_avg_session_length(self):
        """Calculate average session duration in hours"""
        total_duration = 0
        count = 0
        
        for activity in self.activity_log:
            duration = activity.get("duration", 0)  # in minutes
            if duration > 0:
                total_duration += duration
                count += 1
        
        if count == 0:
            return 0
        
        avg_minutes = total_duration / count
        return avg_minutes / 60  # Convert to hours
    
    def _find_peak_productivity_time(self):
        """Find the time of day with most activity"""
        time_counts = {
            "morning": 0,
            "afternoon": 0,
            "evening": 0,
            "night": 0,
            "late-night": 0,
        }
        
        for activity in self.activity_log:
            time_of_day = activity.get("timeOfDay", "unknown")
            if time_of_day in time_counts:
                time_counts[time_of_day] += 1
        
        if sum(time_counts.values()) == 0:
            return "unknown"
        
        return max(time_counts, key=time_counts.get)


def detect_burnout(activity_log):
    """Main function to detect burnout from activity log"""
    detector = BurnoutDetector(activity_log)
    return detector.analyze()
