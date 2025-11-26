import type React from "react"
import { Badge } from "@/components/ui/badge"
import type { BadgeType } from "@/lib/types"
import { Shield, Briefcase, Search, UserCheck, GraduationCap, Code, Crown } from "lucide-react"

const badgeConfig: Record<BadgeType, { label: string; icon: React.ReactNode; color: string }> = {
  citizen: {
    label: "Citizen",
    icon: <UserCheck className="w-3 h-3" />,
    color: "bg-blue-500/10 text-blue-700 border-blue-200",
  },
  merchant: {
    label: "Merchant",
    icon: <Briefcase className="w-3 h-3" />,
    color: "bg-green-500/10 text-green-700 border-green-200",
  },
  auditor: {
    label: "Auditor",
    icon: <Search className="w-3 h-3" />,
    color: "bg-purple-500/10 text-purple-700 border-purple-200",
  },
  officer: {
    label: "Officer",
    icon: <Shield className="w-3 h-3" />,
    color: "bg-red-500/10 text-red-700 border-red-200",
  },
  student: {
    label: "Student",
    icon: <GraduationCap className="w-3 h-3" />,
    color: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  },
  contributor: {
    label: "Contributor",
    icon: <Code className="w-3 h-3" />,
    color: "bg-orange-500/10 text-orange-700 border-orange-200",
  },
  founder: {
    label: "Founder",
    icon: <Crown className="w-3 h-3" />,
    color: "bg-amber-500/10 text-amber-700 border-amber-200",
  },
}

export function PioneerBadge({ type }: { type: BadgeType }) {
  const config = badgeConfig[type]

  return (
    <Badge variant="outline" className={`${config.color} text-xs font-medium gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  )
}
