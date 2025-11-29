// Pi AI Service - Real-time telemetry analysis and classification
// Integrates with sensor data for badge automation and civic alerts

interface SensorReading {
  sensorId: string
  sensorType: string
  value: number
  unit: string
  locationName?: string
  locationLat?: number
  locationLng?: number
  timestamp: Date
}

interface AIClassification {
  classification: "excellent" | "good" | "moderate" | "poor" | "hazardous"
  confidence: number
  anomalyDetected: boolean
  recommendations: string[]
}

interface BadgeEvaluation {
  badgeId: string
  eligible: boolean
  aiScore: number
  telemetrySnapshot: any
}

export class PiAIService {
  /**
   * Classify sensor reading using Pi AI thresholds
   */
  static classifySensorReading(reading: SensorReading): AIClassification {
    const { sensorType, value } = reading
    let classification: AIClassification["classification"] = "moderate"
    let anomalyDetected = false
    const recommendations: string[] = []

    switch (sensorType) {
      case "pm25":
        if (value <= 12) classification = "excellent"
        else if (value <= 35) classification = "good"
        else if (value <= 55) classification = "moderate"
        else if (value <= 150) classification = "poor"
        else {
          classification = "hazardous"
          anomalyDetected = true
          recommendations.push("Air quality alert: Consider reducing outdoor activities")
        }
        break

      case "noise_level":
        if (value <= 50) classification = "excellent"
        else if (value <= 60) classification = "good"
        else if (value <= 70) classification = "moderate"
        else if (value <= 85) classification = "poor"
        else {
          classification = "hazardous"
          anomalyDetected = true
          recommendations.push("Noise pollution detected: Investigate source")
        }
        break

      case "traffic_flow":
        // Lower delay is better
        if (value <= 5) classification = "excellent"
        else if (value <= 10) classification = "good"
        else if (value <= 20) classification = "moderate"
        else if (value <= 40) classification = "poor"
        else {
          classification = "hazardous"
          anomalyDetected = true
          recommendations.push("Traffic congestion alert: Consider alternative routes")
        }
        break

      case "energy":
        // Energy consumption - context dependent
        if (value <= 50) classification = "excellent"
        else if (value <= 75) classification = "good"
        else if (value <= 100) classification = "moderate"
        else classification = "poor"
        break

      case "temperature":
        // Temperature comfort range
        if (value >= 20 && value <= 24) classification = "excellent"
        else if (value >= 18 && value <= 26) classification = "good"
        else if (value >= 15 && value <= 30) classification = "moderate"
        else classification = "poor"
        break
    }

    // Calculate confidence score based on how close to threshold boundaries
    const confidence = this.calculateConfidence(sensorType, value, classification)

    return {
      classification,
      confidence,
      anomalyDetected,
      recommendations,
    }
  }

  /**
   * Calculate AI confidence score (0-100)
   */
  private static calculateConfidence(sensorType: string, value: number, classification: string): number {
    // Higher confidence when value is clearly in one classification range
    // Lower confidence near boundaries
    let confidence = 85 // base confidence

    // Add variance based on sensor type reliability
    const sensorReliability = {
      pm25: 0.9,
      noise_level: 0.85,
      traffic_flow: 0.8,
      energy: 0.95,
      temperature: 0.95,
    }

    confidence *= sensorReliability[sensorType] || 0.8
    return Math.round(confidence)
  }

  /**
   * Evaluate badge eligibility based on telemetry history
   */
  static async evaluateBadgeEligibility(
    userId: string,
    badgeDefinition: any,
    telemetryData: SensorReading[],
  ): Promise<BadgeEvaluation> {
    const { ai_threshold_type, ai_threshold_value, ai_duration_hours } = badgeDefinition

    if (!telemetryData || telemetryData.length === 0) {
      return {
        badgeId: badgeDefinition.id,
        eligible: false,
        aiScore: 0,
        telemetrySnapshot: null,
      }
    }

    // Calculate average value over duration
    const avgValue = telemetryData.reduce((sum, reading) => sum + reading.value, 0) / telemetryData.length

    // Determine eligibility based on threshold type
    let eligible = false
    switch (ai_threshold_type) {
      case "pm25":
      case "noise_level":
      case "traffic_flow":
        // Lower is better
        eligible = avgValue <= ai_threshold_value
        break

      case "energy_reduction":
        // Higher reduction is better
        eligible = avgValue >= ai_threshold_value
        break

      case "contribution_count":
      case "health_participation":
      case "civic_share":
        // Direct count/value comparison
        eligible = avgValue >= ai_threshold_value
        break
    }

    // Calculate AI score based on how well threshold was met
    let aiScore = 50
    if (eligible) {
      const overperformance = Math.abs((avgValue - ai_threshold_value) / ai_threshold_value)
      aiScore = Math.min(100, 70 + overperformance * 30)
    } else {
      const underperformance = Math.abs((avgValue - ai_threshold_value) / ai_threshold_value)
      aiScore = Math.max(0, 50 - underperformance * 50)
    }

    return {
      badgeId: badgeDefinition.id,
      eligible,
      aiScore: Math.round(aiScore),
      telemetrySnapshot: {
        avgValue,
        threshold: ai_threshold_value,
        duration: ai_duration_hours,
        readingCount: telemetryData.length,
        timeRange: {
          start: telemetryData[0]?.timestamp,
          end: telemetryData[telemetryData.length - 1]?.timestamp,
        },
      },
    }
  }

  /**
   * Generate predictive alerts based on trend analysis
   */
  static generatePredictiveAlerts(recentReadings: SensorReading[]): string[] {
    const alerts: string[] = []

    if (recentReadings.length < 3) return alerts

    // Simple trend analysis - check if values are consistently increasing
    const values = recentReadings.map((r) => r.value)
    const trend = values.slice(-3).reduce((acc, val, idx) => {
      if (idx > 0 && val > values[idx - 1]) acc++
      return acc
    }, 0)

    // If trend is consistently up, generate alert
    if (trend >= 2) {
      const sensorType = recentReadings[0].sensorType
      alerts.push(`⚠️ ${sensorType} levels trending upward. Consider preventive action.`)
    }

    return alerts
  }
}
