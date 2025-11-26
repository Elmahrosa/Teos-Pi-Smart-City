"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PioneerBadge } from "@/components/pioneer-badge"
import { Crown, TrendingUp, MapPin, ArrowLeft, Target, Building2 } from "lucide-react"
import Link from "next/link"
import type { TreasuryState } from "@/lib/types"

type Region = "alexandria" | "borg-el-arab" | "new-alexandria" | "nac"

export default function FounderDashboard() {
  const [treasuryState, setTreasuryState] = useState<TreasuryState | null>(null)
  const [currentRegion, setCurrentRegion] = useState<Region>("alexandria")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch("/api/treasury/state")
      const data = await res.json()
      setTreasuryState(data)
    } catch (error) {
      console.log("[v0] Error fetching founder data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading founder dashboard...</p>
        </div>
      </div>
    )
  }

  const progressPercentage = treasuryState ? (treasuryState.totalPi / treasuryState.target) * 100 : 0

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-900 to-amber-700 text-white border-b border-amber-600 backdrop-blur-sm">
        <div className="container mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Founder Dashboard
              </h1>
              <p className="text-xs text-amber-100">Ayman Seif - Elmahrosa International</p>
            </div>
            <PioneerBadge type="founder" />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-6">
        {/* Founder Declaration */}
        <Card className="p-6 mb-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3 mb-3">
            <Crown className="w-6 h-6 text-amber-700 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-lg mb-2">Founder Declaration</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Owner & Founder: <span className="font-semibold text-foreground">Ayman Seif</span>
                <br />
                Entity: <span className="font-semibold text-foreground">Elmahrosa International (Est. 2007)</span>
                <br />
                <br />
                Teos&Pi Smart City Elmahrosa is the proprietary civic-first project anchored in TEOS Egypt. All
                governance, treasury, and operations are under founder authority.
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="targets">Targets</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {treasuryState && (
              <>
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">Treasury Overview</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-primary">{treasuryState.totalPi.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Pi</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-primary">{progressPercentage.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Progress</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-primary">
                        {treasuryState.totalPioneers.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Pioneers</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-primary">
                        {treasuryState.totalShares.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Shares</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Signing Fees</span>
                      <span className="font-medium">{treasuryState.signingFees.toLocaleString()} Pi</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Contributions</span>
                      <span className="font-medium">{treasuryState.contributions.toLocaleString()} Pi</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-4">Project Financials</h3>
                  <div className="space-y-3">
                    <FinancialRow label="Land Value (110 acres, 445,000 m²)" value="$267M - $445M" />
                    <FinancialRow label="Construction Cost" value="$511M - $580M" />
                    <FinancialRow label="Total Project Cost" value="$800M - $1B" highlight />
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-4">Project Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <TimelineRow phase="Land Acquisition" duration="6-12 months" />
                    <TimelineRow phase="Design + Permits" duration="12-18 months" />
                    <TimelineRow phase="Construction" duration="5-7 years" />
                    <TimelineRow phase="Pilot Operational" duration="12-24 months" />
                  </div>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="targets" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Treasury Targets</h3>
              </div>

              <div className="space-y-4">
                <TargetCard
                  title="Primary Target"
                  target="10,000,000 Pi"
                  description="10,000 pioneers × 1,000 Pi minimum stake"
                  current={treasuryState?.totalPi || 0}
                  goal={10_000_000}
                />

                <TargetCard
                  title="Pioneer Participation"
                  target="10,000 Pioneers"
                  description="Active governance participants"
                  current={treasuryState?.totalPioneers || 0}
                  goal={10_000}
                />

                <TargetCard
                  title="Civic Shares Issued"
                  target="10,000 Shares"
                  description="1 share per 1,000 Pi contribution"
                  current={treasuryState?.totalShares || 0}
                  goal={10_000}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="regions" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Dynamic Area Clause</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                If Alexandria land changes hands, shares automatically pivot to alternative locations. Founder authority
                to manage area transitions.
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Alexandria Downtown</span>
                </div>
                {currentRegion === "alexandria" && (
                  <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full border border-green-200">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">110 acres (445,000 m²) - Primary location</p>
              <Button
                variant="outline"
                size="sm"
                disabled={currentRegion === "alexandria"}
                className="w-full bg-transparent"
              >
                Set as Active Region
              </Button>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">Borg El Arab</span>
                </div>
                {currentRegion === "borg-el-arab" && (
                  <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full border border-green-200">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">Alternative location - Industrial zone</p>
              <Button
                variant="outline"
                size="sm"
                disabled={currentRegion === "borg-el-arab"}
                className="w-full bg-transparent"
              >
                Set as Active Region
              </Button>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">New Alexandria</span>
                </div>
                {currentRegion === "new-alexandria" && (
                  <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full border border-green-200">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">Alternative location - Coastal development</p>
              <Button
                variant="outline"
                size="sm"
                disabled={currentRegion === "new-alexandria"}
                className="w-full bg-transparent"
              >
                Set as Active Region
              </Button>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">New Administrative Capital (NAC)</span>
                </div>
                {currentRegion === "nac" && (
                  <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full border border-green-200">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">Alternative location - Government district</p>
              <Button variant="outline" size="sm" disabled={currentRegion === "nac"} className="w-full bg-transparent">
                Set as Active Region
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function FinancialRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between py-2 border-b border-border ${highlight ? "font-bold" : ""}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}

function TimelineRow({ phase, duration }: { phase: string; duration: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border">
      <span className="text-muted-foreground">{phase}</span>
      <span className="font-medium">{duration}</span>
    </div>
  )
}

function TargetCard({
  title,
  target,
  description,
  current,
  goal,
}: {
  title: string
  target: string
  description: string
  current: number
  goal: number
}) {
  const percentage = (current / goal) * 100

  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <span className="text-lg font-bold text-primary">{target}</span>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Current: {current.toLocaleString()}</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
