import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, Ticket, Wallet, Mail, QrCode, 
  RefreshCw, Users, Shield, Calendar, Video
} from "lucide-react";

export function EventsHelpSupport() {
  const faqs = [
    {
      category: "Tickets & Pricing",
      icon: Ticket,
      color: "text-purple-400",
      questions: [
        {
          q: "How do I set different prices for Adult, Child, and Senior tickets?",
          a: "When creating an event, set the Adult price. Child and Senior prices are automatically calculated based on discount percentages (default: Child 50% off, Senior 30% off). You can adjust these percentages in the event settings."
        },
        {
          q: "What happens when someone buys a free ticket?",
          a: "Free tickets (R0 events) are confirmed instantly without going through the payment gateway. Buyers receive an immediate confirmation email with their QR code ticket."
        },
        {
          q: "How do I limit the number of tickets?",
          a: "Set the 'Max Attendees' field when creating your event. The system will prevent sales once this limit is reached and show availability on the ticket page."
        },
        {
          q: "Can buyers select multiple ticket types in one purchase?",
          a: "Yes! Buyers can select quantities for Adult, Child, and Senior tickets in a single transaction. Each ticket type generates a separate ticket with its own tracking number."
        }
      ]
    },
    {
      category: "Payments & Revenue",
      icon: Wallet,
      color: "text-emerald-400",
      questions: [
        {
          q: "What is the revenue split?",
          a: "You receive 94% of all ticket sales. The platform takes a 6% commission to cover payment processing, hosting, and support. This split is applied automatically."
        },
        {
          q: "When do I get paid?",
          a: "Payments are recorded instantly when a ticket is purchased. Your earnings are tracked in the Creator Dashboard and paid out according to the platform payout schedule (typically monthly)."
        },
        {
          q: "What payment methods can attendees use?",
          a: "We use PayFast which supports credit/debit cards, instant EFT, and various South African payment methods. All transactions are secure and PCI-compliant."
        },
        {
          q: "Is the 6% commission refundable if I refund a ticket?",
          a: "No, the 6% platform commission is non-refundable. When processing refunds, you only refund the 94% creator share to the attendee."
        }
      ]
    },
    {
      category: "Email & Notifications",
      icon: Mail,
      color: "text-blue-400",
      questions: [
        {
          q: "What emails do attendees receive?",
          a: "After successful payment, attendees receive a confirmation email containing: event details, QR code ticket, unique tracking number, and a calendar (.ics) file to add the event to their calendar."
        },
        {
          q: "What if the confirmation email doesn't arrive?",
          a: "Check the spam folder first. If still missing, the attendee can contact you (via the contact info on the event) and you can verify their purchase in the Attendees tab and resend manually if needed."
        },
        {
          q: "Can I customize the confirmation email?",
          a: "Currently, confirmation emails use a standard template with your event details. Custom branding options may be available in future updates."
        }
      ]
    },
    {
      category: "QR Codes & Check-In",
      icon: QrCode,
      color: "text-pink-400",
      questions: [
        {
          q: "How does the QR code system work?",
          a: "Each ticket gets a unique tracking number (e.g., TKT-20260117-ABC123). This is encoded into a QR code that attendees present at entry. Scan or enter the tracking number to check them in."
        },
        {
          q: "How do I check in attendees at my venue?",
          a: "Go to the Attendees tab and enable 'Check-In Mode'. You can either scan QR codes (if you have a scanner) or manually enter tracking numbers. The system prevents duplicate check-ins."
        },
        {
          q: "What if an attendee loses their QR code?",
          a: "Search for them by name or email in the Attendees tab. You can verify their purchase and check them in manually."
        },
        {
          q: "Can I use QR check-in for virtual events?",
          a: "For virtual events, the QR code links to the stream access page. Attendees can use the tracking number as their access credential."
        }
      ]
    },
    {
      category: "Refunds",
      icon: RefreshCw,
      color: "text-amber-400",
      questions: [
        {
          q: "What is the refund policy?",
          a: "Per the Consumer Protection Act (CPA), attendees have a 7-day cooling-off period to request a refund for any reason. After 7 days, refunds are at your discretion."
        },
        {
          q: "How do I process a refund?",
          a: "Go to the Refunds tab, find the ticket, and click 'Request Refund'. Enter the reason and submit. The platform Admin will process the refund via PayFast and update the status. You'll see 'Approved' or 'Rejected' once complete."
        },
        {
          q: "Why can't I process refunds directly?",
          a: "For security and compliance, only platform administrators have access to the PayFast merchant dashboard. This ensures proper audit trails and prevents unauthorized transactions."
        },
        {
          q: "How long do refunds take?",
          a: "Once you submit a request, Admin typically processes it within 1-3 business days. The attendee receives funds 3-5 business days after processing, depending on their bank."
        },
        {
          q: "Why is the 6% commission non-refundable?",
          a: "Payment processing fees are charged at the time of transaction and cannot be recovered. This is standard practice in the ticketing industry."
        }
      ]
    },
    {
      category: "Data & CRM",
      icon: Users,
      color: "text-cyan-400",
      questions: [
        {
          q: "How do I export attendee data?",
          a: "Go to the Attendees tab and click 'Export CSV'. This downloads a file with all attendee information: name, email, ticket tier, price, status, check-in time, etc."
        },
        {
          q: "Can I use attendee data for marketing?",
          a: "Yes, you can use exported data in external CRM systems. However, ensure you comply with POPIA (Protection of Personal Information Act) and only send communications attendees have consented to."
        },
        {
          q: "Is attendee data secure?",
          a: "All data is stored securely with encryption. Access is limited to you (the event creator) and platform administrators for support purposes."
        }
      ]
    },
    {
      category: "Virtual Events",
      icon: Video,
      color: "text-violet-400",
      questions: [
        {
          q: "How do virtual events work?",
          a: "Mark your event as 'Virtual' when creating it. After ticket purchase, attendees receive an access link to the stream. You can integrate with your streaming platform of choice."
        },
        {
          q: "What if an attendee has technical issues during the event?",
          a: "Technical issues on the attendee's end are generally not grounds for refund. Include troubleshooting info in your event description and have a support channel (WhatsApp/email) ready."
        },
        {
          q: "Can I run hybrid events (in-person + virtual)?",
          a: "Yes! Create separate ticket types or events for each format. Virtual tickets can have different pricing and access methods than physical attendance."
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Events Help & Support</h2>
              <p className="text-muted-foreground mt-1">
                Everything you need to know about creating and managing events
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Categories */}
      <div className="space-y-6">
        {faqs.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.category} className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${category.color}`} />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.category}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {faq.a}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Reference */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Revenue Split</h4>
              <p className="text-2xl font-bold text-emerald-400">94% Creator / 6% Platform</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Refund Period</h4>
              <p className="text-2xl font-bold">7 Days (CPA)</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Default Discounts</h4>
              <p className="text-lg">Child: 50% off | Senior: 30% off</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Email Features</h4>
              <p className="text-lg">QR Code + Calendar File (.ics)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-blue-400" />
          <h3 className="font-bold text-lg">Need More Help?</h3>
          <p className="text-muted-foreground mt-2">
            Can't find what you're looking for? Contact our support team.
          </p>
          <Badge className="mt-4 bg-blue-500/20 text-blue-300">
            support@supaview.co.za
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
