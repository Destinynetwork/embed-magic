import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, Calendar, Ticket, Users, Wallet, Mail, 
  QrCode, Settings, CheckCircle2, ArrowRight, 
  Video, MapPin, Crown, Clock, BarChart3, Shield
} from "lucide-react";

interface EventsGettingStartedProps {
  onNavigate: (tab: string) => void;
}

export function EventsGettingStarted({ onNavigate }: EventsGettingStartedProps) {
  const steps = [
    {
      step: 1,
      title: "Create Your Event",
      description: "Set up your event with all the details attendees need to know",
      icon: Calendar,
      color: "from-purple-500 to-violet-600",
      details: [
        "Choose event type: Concert, Live Stream, Workshop, Conference, Podcast, or Radio Show",
        "Set date, time, and duration - supports multi-day events",
        "Add location (physical address) or mark as Virtual Event",
        "Upload an eye-catching thumbnail image",
        "Write a compelling description to attract attendees",
        "Toggle VVIP for exclusive premium events"
      ],
      tips: [
        "Virtual events get a stream access link sent automatically",
        "VVIP events can have exclusive pricing tiers",
        "Add contact details so attendees can reach you"
      ]
    },
    {
      step: 2,
      title: "Set Tiered Pricing",
      description: "Configure flexible pricing for different audience segments",
      icon: Ticket,
      color: "from-pink-500 to-rose-600",
      details: [
        "Set Adult ticket price (base price)",
        "Child discount: Auto-calculated (default 50% off adult price)",
        "Senior discount: Auto-calculated (default 30% off adult price)",
        "Set maximum attendees to control capacity",
        "FREE events? Set price to R0 - tickets are confirmed instantly"
      ],
      tips: [
        "Platform takes 6% commission on paid tickets",
        "You receive 94% of ticket sales directly",
        "Free events skip payment - instant confirmation"
      ]
    },
    {
      step: 3,
      title: "Share & Promote",
      description: "Get your event in front of your audience",
      icon: Rocket,
      color: "from-emerald-500 to-teal-600",
      details: [
        "Copy your unique event ticket link",
        "Share on social media, WhatsApp, email newsletters",
        "Embed on your website or blog",
        "Your event appears in the public Events Calendar",
        "Add social links (Facebook, Instagram, YouTube) to boost visibility"
      ],
      tips: [
        "Share early - give people time to plan",
        "Use countdown posts to build excitement",
        "Partner with other creators to cross-promote"
      ]
    },
    {
      step: 4,
      title: "Ticket Sales & Notifications",
      description: "Watch the bookings roll in with automatic notifications",
      icon: Mail,
      color: "from-blue-500 to-cyan-600",
      details: [
        "Buyers select ticket quantities (Adult, Child, Senior)",
        "Secure payment via PayFast (card, EFT, instant EFT)",
        "Automatic confirmation email sent with QR code ticket",
        "ICS calendar file attached for easy scheduling",
        "Each ticket gets a unique tracking number"
      ],
      tips: [
        "Buyers receive their QR code immediately after payment",
        "Virtual events include a direct access link in the email",
        "Free event tickets are confirmed instantly - no payment step"
      ]
    },
    {
      step: 5,
      title: "Manage Attendees",
      description: "Track who's coming and export data for external CRM",
      icon: Users,
      color: "from-amber-500 to-orange-600",
      details: [
        "View complete attendee list with name, email, ticket tier",
        "See payment status (pending, completed, refunded)",
        "Check-in attendees at the venue using tracking numbers",
        "Export CSV with all attendee data for external CRM",
        "Filter by event, status, or search by name/email"
      ],
      tips: [
        "Export CSV before the event for door lists",
        "Use check-in feature to track actual attendance",
        "Build your mailing list from attendee data"
      ]
    },
    {
      step: 6,
      title: "Check-In at Venue",
      description: "Validate tickets and track attendance in real-time",
      icon: QrCode,
      color: "from-violet-500 to-purple-600",
      details: [
        "Enter tracking number to validate ticket",
        "One-click check-in marks attendee as arrived",
        "Live counter shows checked-in vs total tickets",
        "Prevent duplicate check-ins with status tracking",
        "Works offline - sync when back online"
      ],
      tips: [
        "Print attendee list as backup",
        "Assign a team member to handle check-in",
        "Start check-in 30 minutes before event"
      ]
    },
    {
      step: 7,
      title: "Track Revenue & Payouts",
      description: "Monitor earnings and understand your revenue share",
      icon: Wallet,
      color: "from-green-500 to-emerald-600",
      details: [
        "View real-time revenue from ticket sales",
        "94% goes to you, 6% platform commission",
        "Revenue recorded automatically after payment confirmation",
        "View payout history in Creator Dashboard",
        "Analytics show ticket sales trends over time"
      ],
      tips: [
        "Revenue is recorded per ticket, not per transaction",
        "Check Analytics tab for detailed breakdowns",
        "Payouts processed according to platform schedule"
      ]
    },
    {
      step: 8,
      title: "Handle Refunds",
      description: "Process refund requests professionally",
      icon: Shield,
      color: "from-red-500 to-rose-600",
      details: [
        "View pending refund requests from attendees",
        "7-day cooling-off period applies (CPA requirement)",
        "Process refunds via PayFast merchant dashboard",
        "6% platform commission is non-refundable",
        "Update ticket status after processing"
      ],
      tips: [
        "Respond to refund requests within 48 hours",
        "Document reason for refund for your records",
        "Consider offering event credit as alternative"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Welcome to Events Hub</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Create and manage ticketed events - concerts, live streams, workshops, and more. 
                Sell tickets, track attendees, process refunds, and grow your audience.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  <Ticket className="h-3 w-3 mr-1" />
                  Tiered Pricing
                </Badge>
                <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                  <QrCode className="h-3 w-3 mr-1" />
                  QR Code Tickets
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <Mail className="h-3 w-3 mr-1" />
                  Email Confirmations
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  <Users className="h-3 w-3 mr-1" />
                  CSV Export
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Split Explainer */}
      <Card className="bg-card/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-400" />
            Revenue Split
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-emerald-400">94%</p>
              <p className="text-sm text-muted-foreground">Your Share</p>
            </div>
            <div className="flex-1 bg-gradient-to-r from-muted/20 to-muted/5 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-muted-foreground">6%</p>
              <p className="text-sm text-muted-foreground">Platform Fee</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Platform fee is non-refundable. You receive 94% of every ticket sale automatically.
          </p>
        </CardContent>
      </Card>

      {/* Step-by-Step Guide */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-purple-400" />
          Complete Event Workflow
        </h3>

        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.step} className="bg-card/50 overflow-hidden">
              <div className="flex">
                {/* Step Number */}
                <div className={`w-2 bg-gradient-to-b ${step.color}`} />
                
                <div className="flex-1 p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${step.color} flex-shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Step {step.step}</Badge>
                        <h4 className="font-bold text-lg">{step.title}</h4>
                      </div>
                      <p className="text-muted-foreground mt-1">{step.description}</p>
                      
                      {/* Details */}
                      <div className="mt-4 space-y-2">
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Tips */}
                      <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <p className="text-xs font-medium text-purple-300 mb-2">💡 Pro Tips</p>
                        <ul className="space-y-1">
                          {step.tips.map((tip, i) => (
                            <li key={i} className="text-xs text-muted-foreground">• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition-all"
              onClick={() => onNavigate("events")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold">Create Your First Event</h4>
              <p className="text-sm text-muted-foreground">Start selling tickets now</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition-all"
              onClick={() => onNavigate("attendees")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold">View Attendees & Export</h4>
              <p className="text-sm text-muted-foreground">Download CSV for CRM</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
