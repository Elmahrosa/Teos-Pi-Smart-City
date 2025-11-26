import type React from "react"
import { Building2, Users, MapPin, Bell, Shield, TrendingUp, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-2xl">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-base font-bold text-balance">Teos&Pi Smart City</h1>
              <p className="text-xs text-secondary-foreground/70">Elmahrosa</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-secondary-foreground">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <Badge className="mb-4 bg-primary text-primary-foreground">Welcome Pioneers</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Elmahrosa Smart City</h2>
          <p className="text-secondary-foreground/80 leading-relaxed mb-6">
            Egypt's first Pi-powered civic blockchain city. Join with 5 Pi petition fee, contribute 1,000 Pi for civic
            shares, and participate in transparent governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/petition">
              <Button size="lg" variant="outline" className="bg-background text-foreground hover:bg-background/90">
                Sign Egypt Crypto Petition
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Open Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">5 Pi</div>
              <div className="text-xs text-muted-foreground">Petition Fee</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">1,000 Pi</div>
              <div className="text-xs text-muted-foreground">Civic Share</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">$2.2B+</div>
              <div className="text-xs text-muted-foreground">Project Value</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <main className="py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <h3 className="text-xl font-bold mb-6">Platform Features</h3>

          <div className="grid gap-4 mb-8">
            <Link href="/petition">
              <ServiceCard
                icon={<FileText className="w-6 h-6" />}
                title="Egypt Crypto Regulation Petition"
                description="385/500 signatures - Help regulate digital currencies in Egypt"
                color="bg-chart-5/10 text-chart-5"
              />
            </Link>

            <ServiceCard
              icon={<Shield className="w-6 h-6" />}
              title="Governance & Petitions"
              description="Petition-first governance - 5 Pi to sign, pioneer voting rights"
              color="bg-chart-1/10 text-chart-1"
            />

            <ServiceCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Treasury & Shares"
              description="1,000 Pi = 1 civic share with transparent treasury tracking"
              color="bg-chart-2/10 text-chart-2"
            />

            <ServiceCard
              icon={<MapPin className="w-6 h-6" />}
              title="Alexandria Downtown"
              description="110 acres (445,000 m²) - Valued at $2.2B+ downtown location"
              color="bg-chart-3/10 text-chart-3"
            />

            <ServiceCard
              icon={<Users className="w-6 h-6" />}
              title="Pioneer Badges"
              description="Citizen, merchant, auditor, and contributor roles"
              color="bg-chart-4/10 text-chart-4"
            />
          </div>

          {/* CTA Section */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h4 className="font-bold text-lg mb-2">Join with 5 Pi Petition Fee</h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Sign the civic petition for 5 Pi, then contribute 1,000 Pi minimum stake to receive civic shares. All
              contributions are transparent and recorded on the Pi Network ledger.
            </p>
            <Link href="/dashboard">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">View Dashboard</Button>
            </Link>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="container mx-auto max-w-2xl">
          <div className="flex justify-around py-3">
            <NavButton icon={<Building2 className="w-5 h-5" />} label="Home" active href="/" />
            <NavButton icon={<TrendingUp className="w-5 h-5" />} label="Dashboard" href="/dashboard" />
            <NavButton icon={<FileText className="w-5 h-5" />} label="Petition" href="/petition" />
            <NavButton icon={<Users className="w-5 h-5" />} label="Community" href="#" />
          </div>
        </div>
      </nav>

      {/* Bottom padding to prevent content hiding behind fixed nav */}
      <div className="h-20" />
    </div>
  )
}

function ServiceCard({
  icon,
  title,
  description,
  color,
}: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${color} flex-shrink-0`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  )
}

function NavButton({
  icon,
  label,
  active = false,
  href,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  href: string
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 px-3 py-1 ${active ? "text-primary" : "text-muted-foreground"}`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  )
}
