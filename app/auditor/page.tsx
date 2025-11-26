"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PioneerBadge } from "@/components/pioneer-badge"
import { Search, AlertTriangle, CheckCircle, XCircle, ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import type { TreasuryState, CivicShare } from "@/lib/types"

interface IncidentLog {
  id: string
  type: "outage" | "discrepancy" | "security" | "other"
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "investigating" | "resolved"
  reportedBy: string
  reportedAt: Date
  resolvedAt?: Date
}

export default function AuditorDashboard() {
  const [treasuryState, setTreasuryState] = useState<TreasuryState | null>(null)
  const [civicShares, setCivicShares] = useState<CivicShare[]>([])
  const [incidents, setIncidents] = useState<IncidentLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [treasuryRes, sharesRes] = await Promise.all([fetch("/api/treasury/state"), fetch("/api/treasury/shares")])

      const treasuryData = await treasuryRes.json()
      const sharesData = await sharesRes.json()

      setTreasuryState(treasuryData)
      setCivicShares(sharesData)

      // Mock incidents
      setIncidents([
        {
          id: "INC-001",
          type: "security",
          title: "Unauthorized access attempt detected",
          description: "Multiple failed login attempts from unknown IP address",
          severity: "high",
          status: "resolved",
          reportedBy: "System Monitor",
          reportedAt: new Date("2025-01-20"),
          resolvedAt: new Date("2025-01-20"),
        },
      ])
    } catch (error) {
      console.log("[v0] Error fetching auditor data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading auditor dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm">
        <div className="container mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-bold">Auditor Dashboard</h1>
              <p className="text-xs text-muted-foreground">Treasury Oversight & Compliance</p>
            </div>
            <PioneerBadge type="auditor" />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-6">
        <Tabs defaultValue="treasury" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="treasury">Treasury</TabsTrigger>
            <TabsTrigger value="shares">Shares</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
          </TabsList>

          <TabsContent value="treasury" className="space-y-4">
            {treasuryState && (
              <>
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">Treasury Audit</h3>
                  </div>

                  <div className="space-y-3">
                    <AuditRow label="Total Pi Balance" value={treasuryState.totalPi.toLocaleString()} verified />
                    <AuditRow
                      label="Signing Fees Collected"
                      value={treasuryState.signingFees.toLocaleString()}
                      verified
                    />
                    <AuditRow label="Contributions" value={treasuryState.contributions.toLocaleString()} verified />
                    <AuditRow label="Total Pioneers" value={treasuryState.totalPioneers.toString()} verified />
                    <AuditRow label="Total Shares Issued" value={treasuryState.totalShares.toLocaleString()} verified />
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-4">Financial Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Land Value (110 acres)</span>
                      <span className="font-medium">$267M - $445M</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Construction Cost</span>
                      <span className="font-medium">$511M - $580M</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Total Project Cost</span>
                      <span className="font-medium font-bold">$800M - $1B</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-4">Compliance Status</h3>
                  <div className="space-y-2">
                    <ComplianceItem label="Treasury Transparency" status="compliant" />
                    <ComplianceItem label="Petition-First Governance" status="compliant" />
                    <ComplianceItem label="Pi-Only Settlement" status="compliant" />
                    <ComplianceItem label="Badge-Gated Access" status="compliant" />
                    <ComplianceItem label="Egyptian Law Compliance" status="compliant" />
                  </div>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="shares" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Civic Share Registry</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{civicShares.length} total certificates issued</p>
            </Card>

            {civicShares.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No civic shares issued yet</p>
              </Card>
            ) : (
              civicShares.map((share) => (
                <Card key={share.certificateId} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono text-sm text-primary">{share.certificateId}</div>
                      <div className="text-xs text-muted-foreground">Pioneer: {share.pioneerId}</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <div className="text-muted-foreground text-xs">Contribution</div>
                      <div className="font-medium">{share.amount.toLocaleString()} Pi</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Shares</div>
                      <div className="font-medium">{share.shares}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Region</div>
                      <div className="font-medium capitalize">{share.region.replace("-", " ")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Date</div>
                      <div className="font-medium">{new Date(share.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground font-mono truncate">Hash: {share.receiptHash}</div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Incident Registry</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Public logging of outages, discrepancies, and security events
              </p>
            </Card>

            {incidents.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-muted-foreground">No incidents reported</p>
              </Card>
            ) : (
              incidents.map((incident) => (
                <Card key={incident.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm">{incident.id}</span>
                        <SeverityBadge severity={incident.severity} />
                        <StatusBadge status={incident.status} />
                      </div>
                      <h4 className="font-semibold mb-1">{incident.title}</h4>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    <div>
                      Reported by {incident.reportedBy} on {new Date(incident.reportedAt).toLocaleDateString()}
                    </div>
                    {incident.resolvedAt && <div>Resolved on {new Date(incident.resolvedAt).toLocaleDateString()}</div>}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function AuditRow({ label, value, verified }: { label: string; value: string; verified: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium">{value}</span>
        {verified && <CheckCircle className="w-4 h-4 text-green-600" />}
      </div>
    </div>
  )
}

function ComplianceItem({ label, status }: { label: string; status: "compliant" | "warning" | "violation" }) {
  const icons = {
    compliant: <CheckCircle className="w-4 h-4 text-green-600" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
    violation: <XCircle className="w-4 h-4 text-red-600" />,
  }

  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span>{label}</span>
      {icons[status]}
    </div>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors = {
    low: "bg-blue-500/10 text-blue-700 border-blue-200",
    medium: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    high: "bg-orange-500/10 text-orange-700 border-orange-200",
    critical: "bg-red-500/10 text-red-700 border-red-200",
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[severity as keyof typeof colors]}`}>
      {severity.toUpperCase()}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    open: "bg-red-500/10 text-red-700 border-red-200",
    investigating: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    resolved: "bg-green-500/10 text-green-700 border-green-200",
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[status as keyof typeof colors]}`}>{status}</span>
  )
}
