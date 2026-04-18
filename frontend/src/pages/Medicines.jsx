import { useEffect, useState } from 'react';
import { Search, Pill, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { EmptyState } from '../components/ui/empty-state';
import { cn } from '../lib/utils';
import api from '../services/api';

/**
 * ============================================================
 * MEDICINES PAGE — Public catalog with WhatsApp inquiry
 * ============================================================
 */
const WHATSAPP_NUMBER = '917385312823';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    api.get('/medicines').then(res => setMedicines(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(medicines.map(m => m.category).filter(Boolean))];
  const filtered = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getWhatsAppLink = (name) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello, I want price details for *${name}*`)}`;

  const defaultMedicines = [
    { id: 1, name: 'Paracetamol 500mg', description: 'Fever & pain relief tablets.', category: 'Pain Relief' },
    { id: 2, name: 'Amoxicillin 500mg', description: 'Broad-spectrum antibiotic capsules.', category: 'Antibiotics' },
    { id: 3, name: 'Cetirizine 10mg', description: 'Anti-allergic tablets for sneezing.', category: 'Allergy' },
    { id: 4, name: 'Pantoprazole 40mg', description: 'Gastric acid reducer for acidity.', category: 'Gastric' },
    { id: 5, name: 'Metformin 500mg', description: 'Type 2 diabetes management.', category: 'Diabetes' },
    { id: 6, name: 'Vitamin D3 60K', description: 'Weekly vitamin D supplement.', category: 'Vitamins' },
  ];

  const displayMedicines = medicines.length > 0 ? filtered : defaultMedicines;

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-3xl md:text-5xl font-bold">Wholesale Medicines</h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto text-lg">
            Quality pharmaceutical products at wholesale prices. Contact us for pricing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-44 w-full rounded-t-xl rounded-b-none" />
                    <div className="p-5 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full rounded-lg mt-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayMedicines.map((med) => (
                <Card key={med.id} className="overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                  <div className="h-44 bg-muted flex items-center justify-center overflow-hidden">
                    {med.imageUrl ? (
                      <img src={med.imageUrl} alt={med.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Pill className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    {med.category && (
                      <Badge variant="default" className="mb-2">{med.category}</Badge>
                    )}
                    <h3 className="font-semibold text-foreground mb-1">{med.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{med.description}</p>
                    <a href={getWhatsAppLink(med.name)} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" className="w-full">
                        <MessageCircle className="h-4 w-4" /> Contact for Price
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {displayMedicines.length === 0 && !loading && (
            <Card>
              <EmptyState
                icon={Pill}
                title="No Medicines Found"
                description="Try a different search or category"
              />
            </Card>
          )}

          {/* WhatsApp CTA */}
          <Card className="mt-12 border-secondary/20 bg-secondary/5">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Need Bulk Orders?</h3>
                  <p className="text-muted-foreground text-sm mt-1">Contact us on WhatsApp for wholesale pricing</p>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello, I am interested in wholesale medicine pricing')}`}
                  target="_blank" rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="lg">
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Medicines;
