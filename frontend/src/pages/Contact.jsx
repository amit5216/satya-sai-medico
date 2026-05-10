import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              <a href="tel:+917385312823"
                className="flex items-center gap-5 bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/20 transition-all">
                <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p className="text-primary font-medium">+91 73853 12823</p>
                  <p className="text-muted-foreground text-sm">Available 24/7 for emergencies</p>
                </div>
              </a>

              <a href="https://wa.me/917385312823?text=Hello%2C%20I%20need%20help%20with%20a%20medical%20query"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-5 bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-secondary/20 transition-all">
                <div className="p-3 bg-secondary/10 rounded-xl shrink-0">
                  <MessageCircle className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">WhatsApp</h3>
                  <p className="text-secondary font-medium">+91 73853 12823</p>
                  <p className="text-muted-foreground text-sm">Quick responses during business hours</p>
                </div>
              </a>

              <a href="mailto:info@satyasaimedico.com"
                className="flex items-center gap-5 bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-chart-4/20 transition-all">
                <div className="p-3 bg-chart-4/10 rounded-xl shrink-0">
                  <Mail className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-chart-4 font-medium">info@satyasaimedico.com</p>
                  <p className="text-muted-foreground text-sm">We'll respond within 24 hours</p>
                </div>
              </a>

              <div className="flex items-center gap-5 bg-card border border-border rounded-xl p-6">
                <div className="p-3 bg-chart-5/10 rounded-xl shrink-0">
                  <MapPin className="h-6 w-6 text-chart-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Address</h3>
                  <p className="text-muted-foreground text-sm">Satya Sai Medico, India</p>
                </div>
              </div>

              <div className="flex items-center gap-5 bg-card border border-border rounded-xl p-6">
                <div className="p-3 bg-chart-3/10 rounded-xl shrink-0">
                  <Clock className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Working Hours</h3>
                  <p className="text-muted-foreground text-sm">Mon - Sat: 9:00 AM - 9:00 PM</p>
                  <p className="text-muted-foreground text-sm">Sunday: Emergency Only</p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Visit Us</h2>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  Come visit for personalized medical consultation and wholesale medicine purchases.
                </p>
                <div className="bg-muted/50 rounded-xl p-6 text-left">
                  <h3 className="font-semibold text-foreground mb-3">Why Choose Us?</h3>
                  <ul className="text-sm text-muted-foreground space-y-2.5">
                    {[
                      'Experienced specialist doctors',
                      'Modern diagnostic facilities',
                      'Wholesale medicine at best prices',
                      '24/7 emergency services',
                      'Compassionate patient care'
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
