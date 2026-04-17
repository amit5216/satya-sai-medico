import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

/**
 * ============================================================
 * CONTACT PAGE — Public-facing contact info
 * ============================================================
 */
const WHATSAPP_NUMBER = '917385312823';

const Contact = () => {
  const contactCards = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 73853 12823',
      subtitle: 'Available 24/7 for emergencies',
      href: 'tel:+917385312823',
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+91 73853 12823',
      subtitle: 'Quick responses during business hours',
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello, I need help with a medical query')}`,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      external: true
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'info@satyasaimedico.com',
      subtitle: "We'll respond within 24 hours",
      href: 'mailto:info@satyasaimedico.com',
      color: 'text-chart-4',
      bg: 'bg-chart-4/10'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-3xl md:text-5xl font-bold">Contact Us</h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto text-lg">
            We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactCards.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="block"
                >
                  <Card className="hover:shadow-lg hover:border-primary/20 transition-all group">
                    <CardContent className="p-6 flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className={`${item.color} font-medium`}>{item.value}</p>
                        <p className="text-muted-foreground text-sm">{item.subtitle}</p>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}

              {/* Address */}
              <Card>
                <CardContent className="p-6 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-chart-5/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-chart-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground text-sm">Satya Sai Medico, India</p>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card>
                <CardContent className="p-6 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-chart-3/10 flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 text-chart-3" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Working Hours</h3>
                    <p className="text-muted-foreground text-sm">Mon - Sat: 9:00 AM - 9:00 PM</p>
                    <p className="text-muted-foreground text-sm">Sunday: Emergency Only</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visit Us Card */}
            <Card className="h-fit">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Visit Us</h2>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  Come visit Satya Sai Medico for personalized medical consultation and wholesale medicine purchases.
                </p>
                <div className="bg-muted/50 rounded-2xl p-6 text-left">
                  <h3 className="font-semibold text-foreground mb-3">Why Choose Us?</h3>
                  <ul className="text-sm text-muted-foreground space-y-2.5">
                    {[
                      'Experienced specialist doctors',
                      'Modern diagnostic facilities',
                      'Wholesale medicine at best prices',
                      '24/7 emergency services',
                      'Compassionate patient care',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-secondary mt-0.5 shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello, I need help with a medical query')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block"
                >
                  <Button variant="secondary" size="lg">
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
