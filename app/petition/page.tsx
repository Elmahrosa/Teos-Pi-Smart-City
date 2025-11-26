import { FileText, Users, TrendingUp, ExternalLink, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function PetitionPage() {
  const currentSignatures = 385
  const targetSignatures = 500
  const progressPercent = (currentSignatures / targetSignatures) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-2xl">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-base font-bold">Egypt Crypto Petition</h1>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="py-8 px-4 pb-24">
        <div className="container mx-auto max-w-2xl">
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <Badge className="bg-primary text-primary-foreground">Active Campaign</Badge>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance text-center">
            Join the Movement: Regulate Digital Currencies in Egypt
          </h2>

          <p className="text-sm text-muted-foreground text-center mb-8">
            Official Teos & Pi Smart City Petition | Updated 26 November 2025
          </p>

          {/* Progress Card */}
          <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">Live Tracker</span>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                {currentSignatures} / {targetSignatures}
              </Badge>
            </div>

            <Progress value={progressPercent} className="mb-3 h-3" />

            <p className="text-sm text-muted-foreground mb-4">
              Petitions with 1,000+ signatures are 5× more likely to win
            </p>

            <a
              href="https://www.change.org/p/join-the-movement-sign-the-petition-to-regulate-digital-currencies-in-egypt?recruiter=41912740&recruited_by_id=d23ade40-5e55-0130-269d-3c764e0455b2&utm_source=share_petition&utm_campaign=share_petition&utm_term=share_petition&utm_medium=copylink&utm_content=cl_sharecopy_490544923_en-US%3A4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Sign on Change.org
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* Why This Matters */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Why This Matters</h3>
            <Card className="p-5">
              <p className="text-sm leading-relaxed mb-4">
                As the first Egyptian developer invited to the Toronto Consensus and a Pi Hackathon finalist, I've spent
                6+ years building the most complete civic-financial stack on Pi Network.
              </p>
              <p className="text-sm leading-relaxed mb-4">
                Today, millions of Egyptians are already active in the digital economy, but without clear regulation we
                risk falling behind the global shift to decentralization.
              </p>
              <p className="text-sm leading-relaxed">
                We need urgent legislation to regulate digital currencies and blockchain projects in Egypt — not to
                restrict innovation, but to protect investments, ensure transparency, and position Egypt as a regional
                Web3 leader.
              </p>
            </Card>
          </section>

          {/* What We're Asking For */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">What We're Asking For</h3>
            <Card className="p-5">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">
                    Immediate drafting of a comprehensive digital assets & blockchain law
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">
                    Recognition of utility tokens and decentralized governance models
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">Protection for Egyptian pioneers and developers</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">
                    A clear path for licensed blockchain projects (including Pi-powered smart cities)
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Alexandria Project */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">The 117-Acre Alexandria Downtown Opportunity</h3>
            <Card className="p-5 bg-chart-3/10 border-chart-3/20">
              <div className="flex items-start gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  We are in final talks for a strategic partnership on 117 acres (490,000 m²) of prime downtown
                  Alexandria land (former International Garden site) — the future home of the world's first fully
                  Pi-governed smart city.
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This is a strategic development zone ready for Day-1 Mainnet deployment.
              </p>
            </Card>
          </section>

          {/* On-Chain Pi Petition */}
          <section className="mb-8">
            <Card className="p-5 bg-primary/5 border-primary/20">
              <h4 className="font-bold mb-2">On-Chain Pi Petition (Coming This Week)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Soon you'll be able to sign directly with 5 Pi via Pi SDK (no Change.org needed). Badge + civic share
                credit will be automatically granted on the Teos & Pi Smart City dashboard.
              </p>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full bg-transparent">
                  View Dashboard
                </Button>
              </Link>
            </Card>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Contact & Strategic Inquiries</h3>
            <Card className="p-5">
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Ayman Seif</strong>
                </p>
                <p className="text-muted-foreground">Founder & CEO – TEOS Egypt / Elmahrosa International</p>
                <p className="text-muted-foreground">Email: ayman@teosegypt.com</p>
                <p className="text-muted-foreground">WhatsApp/Telegram: +20 100 616 7293</p>
                <p className="text-muted-foreground">Location: Alexandria, Egypt</p>
                <p className="text-xs text-muted-foreground mt-3">
                  Toronto Consensus Invitee · Pi Hackathon Finalist · 6+ years Pi ecosystem builder
                </p>
              </div>
            </Card>
          </section>

          {/* CTA */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-chart-2/10 border-primary/20">
            <h4 className="font-bold text-lg mb-3 text-center">Every Signature Counts</h4>
            <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
              Every signature brings Egypt one step closer to leading the next digital revolution. Sign & share today —
              let's make history together.
            </p>
            <a
              href="https://www.change.org/p/join-the-movement-sign-the-petition-to-regulate-digital-currencies-in-egypt?recruiter=41912740&recruited_by_id=d23ade40-5e55-0130-269d-3c764e0455b2&utm_source=share_petition&utm_campaign=share_petition&utm_term=share_petition&utm_medium=copylink&utm_content=cl_sharecopy_490544923_en-US%3A4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Sign the Petition Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>
        </div>
      </main>
    </div>
  )
}
