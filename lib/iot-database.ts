// IoT Database Service - Handles sensor telemetry and badge operations
// Connects to PostgreSQL with schema.sql structure

import { PiAIService } from "./pi-ai-service"

interface User {
  id: string
  pi_user_id: string
  username: string
  role: string
  kyc_verified: boolean
}

interface BadgeDefinition {
  id: string
  name: string
  icon: string
  description: string
  category: string
  ai_threshold_type: string
  ai_threshold_value: number
  ai_duration_hours: number
  auto_award: boolean
}

interface EarnedBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: Date
  ai_evaluated: boolean
  ai_score: number
  telemetry_snapshot: any
}

export class IoTDatabaseService {
  /**
   * Insert sensor telemetry with AI classification
   */
  static async insertTelemetry(reading: {
    sensorId: string
    sensorType: string
    value: number
    unit: string
    locationName?: string
    locationLat?: number
    locationLng?: number
  }) {
    const classification = PiAIService.classifySensorReading({
      ...reading,
      timestamp: new Date(),
    })

    // In production, this would execute SQL INSERT
    const telemetryRecord = {
      id: crypto.randomUUID(),
      sensor_id: reading.sensorId,
      sensor_type: reading.sensorType,
      location_lat: reading.locationLat,
      location_lng: reading.locationLng,
      location_name: reading.locationName,
      value: reading.value,
      unit: reading.unit,
      timestamp: new Date(),
      ai_classification: classification.classification,
      ai_anomaly_detected: classification.anomalyDetected,
      metadata: { recommendations: classification.recommendations },
    }

    console.log("[v0] Inserted telemetry:", telemetryRecord)
    return telemetryRecord
  }

  /**
   * Check and award badges automatically
   */
  static async evaluateAndAwardBadges(userId: string) {
    // Fetch badge definitions that support auto_award
    const badgeDefinitions = await this.getAutoAwardBadges()

    const awardedBadges: EarnedBadge[] = []

    for (const badge of badgeDefinitions) {
      // Fetch telemetry data for evaluation period
      const telemetryData = await this.getTelemetryForEvaluation(badge.ai_threshold_type, badge.ai_duration_hours)

      // Evaluate eligibility
      const evaluation = await PiAIService.evaluateBadgeEligibility(userId, badge, telemetryData)

      if (evaluation.eligible) {
        // Check if badge already earned
        const alreadyEarned = await this.hasEarnedBadge(userId, badge.id)

        if (!alreadyEarned) {
          const earnedBadge = await this.awardBadge(userId, badge.id, evaluation.aiScore, evaluation.telemetrySnapshot)
          awardedBadges.push(earnedBadge)
        }
      }
    }

    return awardedBadges
  }

  /**
   * Get badges eligible for auto-award
   */
  static async getAutoAwardBadges(): Promise<BadgeDefinition[]> {
    // Mock data - in production, query database
    return [
      {
        id: "1",
        name: "Clean Air Advocate",
        icon: "🌿",
        description: "Maintained PM2.5 levels below 25 μg/m³ for 7 consecutive days",
        category: "environmental",
        ai_threshold_type: "pm25",
        ai_threshold_value: 25,
        ai_duration_hours: 168,
        auto_award: true,
      },
    ]
  }

  /**
   * Get telemetry data for evaluation
   */
  static async getTelemetryForEvaluation(sensorType: string, durationHours: number) {
    // Mock data - in production, query database with time window
    const now = new Date()
    const startTime = new Date(now.getTime() - durationHours * 60 * 60 * 1000)

    // Return mock telemetry readings
    return [
      {
        sensorId: "sensor-001",
        sensorType,
        value: 22,
        unit: sensorType === "pm25" ? "μg/m³" : "dB",
        timestamp: new Date(),
      },
    ]
  }

  /**
   * Check if user has earned badge
   */
  static async hasEarnedBadge(userId: string, badgeId: string): Promise<boolean> {
    // Mock check - in production, query earned_badges table
    return false
  }

  /**
   * Award badge to user
   */
  static async awardBadge(
    userId: string,
    badgeId: string,
    aiScore: number,
    telemetrySnapshot: any,
  ): Promise<EarnedBadge> {
    const earnedBadge: EarnedBadge = {
      id: crypto.randomUUID(),
      user_id: userId,
      badge_id: badgeId,
      earned_at: new Date(),
      ai_evaluated: true,
      ai_score: aiScore,
      telemetry_snapshot: telemetrySnapshot,
    }

    console.log("[v0] Awarded badge:", earnedBadge)
    return earnedBadge
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    return {
      totalSensors: 5000,
      activeBadges: 7,
      badgesAwarded: 342,
      avgAirQuality: "Good",
      avgNoiseLevel: "58 dB",
      trafficStatus: "Moderate",
    }
  }
}
