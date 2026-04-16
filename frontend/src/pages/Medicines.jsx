import { useEffect, useState } from 'react';
import { Search, Pill, MessageCircle } from 'lucide-react';
import api from '../services/api';

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
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              <input
                type="text" placeholder="Search medicines..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'
                    }`}>{cat}</button>
                ))}
              </div>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                  <div className="h-40 bg-muted rounded-lg mb-4" /><div className="h-5 bg-muted rounded w-3/4 mb-2" /><div className="h-4 bg-muted rounded w-full mb-4" /><div className="h-10 bg-muted rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayMedicines.map((med) => (
                <div key={med.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/20 transition-all">
                  <div className="h-44 bg-muted flex items-center justify-center">
                    {med.imageUrl ? <img src={med.imageUrl} alt={med.name} className="w-full h-full object-cover" /> : <Pill className="h-12 w-12 text-muted-foreground/30" />}
                  </div>
                  <div className="p-5">
                    {med.category && <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">{med.category}</span>}
                    <h3 className="font-semibold text-foreground mb-1">{med.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{med.description}</p>
                    <a href={getWhatsAppLink(med.name)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-secondary text-secondary-foreground font-medium py-2.5 rounded-lg hover:bg-secondary/90 transition-colors text-sm">
                      <MessageCircle className="h-4 w-4" /> Contact for Price
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {displayMedicines.length === 0 && !loading && (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <Pill className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground text-lg">No Medicines Found</h3>
              <p className="text-muted-foreground text-sm mt-2">Try a different search or category</p>
            </div>
          )}

          {/* WhatsApp CTA */}
          <div className="mt-12 bg-secondary/10 border border-secondary/20 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Need Bulk Orders?</h3>
                <p className="text-muted-foreground text-sm mt-1">Contact us on WhatsApp for wholesale pricing</p>
              </div>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello, I am interested in wholesale medicine pricing')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-medium px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors shrink-0">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Medicines;
