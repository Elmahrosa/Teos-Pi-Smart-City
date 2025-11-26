"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PioneerBadge } from "@/components/pioneer-badge"
import { Wallet, FileText, Shield, ArrowLeft, PiggyBank, Scroll, Infinity } from "lucide-react"
import Link from "next/link"
import type { TreasuryState, Petition, Pioneer } from "@/lib/types"

export default function CitizenDashboard() {
  const [treasuryState, setTreasuryState] = useState<TreasuryState | null>(null)
  const [petitions, setPetitions] = useState<Petition[]>([])
  const [pioneer, setPioneer] = useState<Pioneer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [treasuryRes, petitionsRes] = await Promise.all([fetch("/api/treasury/state"), fetch("/api/petitions")])

      const treasuryData = await treasuryRes.json()
      const petitionsData = await petitionsRes.json()

      setTreasuryState(treasuryData)
      setPetitions(petitionsData)

      // Mock pioneer data
      setPioneer({
        id: "pioneer-001",
        username: "Pioneer User",
        piId: "pi-user-001",
        badges: ["citizen"],
        joinedAt: new Date(),
        signedGovernance: true,
        signingFeePaid: true,
      })
    } catch (error) {
      console.log("[v0] Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = treasuryState?.target ? (treasuryState.totalPi / treasuryState.target) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm">
        <div className="container mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-bold">Citizen Dashboard</h1>
              <p className="text-xs text-muted-foreground">Teos&Pi Smart City</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-6">
        {/* Pioneer Profile */}
        {pioneer && (
          <Card className="p-4 mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-bold text-lg">{pioneer.username}</h2>
                <p className="text-sm text-muted-foreground">{pioneer.piId}</p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                {pioneer.badges.map((badge) => (
                  <PioneerBadge key={badge} type={badge} />
                ))}
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Joined</div>
                <div className="font-medium">{pioneer.joinedAt.toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Governance</div>
                <div className="font-medium">{pioneer.signedGovernance ? "✓ Signed" : "✗ Not Signed"}</div>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="treasury" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="treasury">Treasury</TabsTrigger>
            <TabsTrigger value="petitions">Petitions</TabsTrigger>
          </TabsList>

          <TabsContent value="treasury" className="space-y-4">
            {/* Treasury Overview */}
            {treasuryState && (
              <>
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PiggyBank className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">Treasury Status</h3>
                  </div>

                  <div className="space-y-4">
                    {treasuryState.isTargetOpen || !treasuryState.target ? (
                      <div className="bg-muted/50 p-4 rounded-lg text-center">
                        <Infinity className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="font-semibold text-sm">Open Target</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          No fixed limit - contributions welcome from all pioneers
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress to Target</span>
                          <span className="font-medium">{progressPercentage.toFixed(2)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-3" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-primary">{treasuryState.totalPi.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Total Pi</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {treasuryState.totalPioneers.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Pioneers</div>
                      </div>
                    </div>

                    {treasuryState.target && !treasuryState.isTargetOpen && (
                      <div className="pt-4 border-t border-border">
                        <div className="text-sm text-muted-foreground mb-1">Target</div>
                        <div className="text-lg font-bold">{treasuryState.target.toLocaleString()} Pi</div>
                        {treasuryState.pioneerTarget && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {treasuryState.pioneerTarget.toLocaleString()} pioneers ×{" "}
                            {(treasuryState.target / treasuryState.pioneerTarget).toLocaleString()} Pi minimum stake
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Wallet className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">Contribute to Treasury</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Minimum Stake</span>
                        <span className="font-medium">1,000 Pi</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Signing Fee</span>
                        <span className="font-medium">5 Pi</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Region</span>
                        <span className="font-medium">Alexandria Downtown</span>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      <Wallet className="w-4 h-4 mr-2" />
                      Contribute Pi
                    </Button>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Contributions grant you civic shares (1 share per 1,000 Pi). Shares are non-transferable outside
                      Pi Network and remain valid under the Dynamic Area Clause.
                    </p>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">Project Timeline</h3>
                  </div>

                  <div className="space-y-3">
                    <TimelineItem phase="Phase 1" title="Land Acquisition" duration="6-12 months" status="planning" />
                    <TimelineItem phase="Phase 2" title="Design & Permits" duration="12-18 months" status="upcoming" />
                    <TimelineItem phase="Phase 3" title="Construction" duration="5-7 years" status="upcoming" />
                    <TimelineItem phase="Phase 4" title="Completion" duration="Full operational" status="upcoming" />
                  </div>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="petitions" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Scroll className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Governance Petitions</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                All major decisions require pioneer signatures. Sign petitions to participate in governance.
              </p>
            </Card>

            {petitions.length === 0 ? (
              <Card className="p-8 text-center">
                <Scroll className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No active petitions</p>
              </Card>
            ) : (
              petitions.map((petition) => (
                <Card key={petition.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 text-balance">{petition.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{petition.description}</p>
                    </div>
                    <StatusBadge status={petition.status} />
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Signatures</span>
                      <span className="font-medium">
                        {petition.signatures.length} / {petition.requiredSignatures}
                      </span>
                    </div>
                    <Progress
                      value={(petition.signatures.length / petition.requiredSignatures) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" disabled={petition.status !== "open"}>
                      <Shield className="w-3 h-3 mr-1" />
                      Sign Petition (5 Pi)
                    </Button>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    Created {new Date(petition.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function TimelineItem({
  phase,
  title,
  duration,
  status,
}: {
  phase: string
  title: string
  duration: string
  status: "planning" | "upcoming" | "active" | "complete"
}) {
  const statusColors = {
    planning: "bg-blue-500",
    upcoming: "bg-muted",
    active: "bg-green-500",
    complete: "bg-primary",
  }

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
        <div className="w-px h-full bg-border" />
      </div>
      <div className="flex-1 pb-3">
        <div className="font-medium text-sm">
          {phase}: {title}
        </div>
        <div className="text-xs text-muted-foreground">{duration}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    open: { label: "Open", className: "bg-green-500/10 text-green-700 border-green-200" },
    closed: { label: "Closed", className: "bg-gray-500/10 text-gray-700 border-gray-200" },
    approved: { label: "Approved", className: "bg-blue-500/10 text-blue-700 border-blue-200" },
    rejected: { label: "Rejected", className: "bg-red-500/10 text-red-700 border-red-200" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open

  return <span className={`text-xs font-medium px-2 py-1 rounded-full border ${config.className}`}>{config.label}</span>
}
