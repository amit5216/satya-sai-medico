import { useEffect, useState } from 'react';
import { FaWhatsapp, FaSearch, FaPills } from 'react-icons/fa';
import api from '../services/api';

const WHATSAPP_NUMBER = '917385312823';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    api.get('/medicines')
      .then(res => setMedicines(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(medicines.map(m => m.category).filter(Boolean))];

  // Filter medicines
  const filtered = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // WhatsApp link generator
  const getWhatsAppLink = (medicineName) => {
    const message = encodeURIComponent(`Hello, I want price details for *${medicineName}*`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };

  // Default medicines if none in DB
  const defaultMedicines = [
    { id: 1, name: 'Paracetamol 500mg', description: 'Fever & pain relief tablets. Available in strips of 10.', category: 'Pain Relief', imageUrl: null },
    { id: 2, name: 'Amoxicillin 500mg', description: 'Broad-spectrum antibiotic capsules for bacterial infections.', category: 'Antibiotics', imageUrl: null },
    { id: 3, name: 'Cetirizine 10mg', description: 'Anti-allergic tablets for sneezing, runny nose, and itching.', category: 'Allergy', imageUrl: null },
    { id: 4, name: 'Pantoprazole 40mg', description: 'Gastric acid reducer for acidity and GERD treatment.', category: 'Gastric', imageUrl: null },
    { id: 5, name: 'Metformin 500mg', description: 'Type 2 diabetes management tablet. Sugar control.', category: 'Diabetes', imageUrl: null },
    { id: 6, name: 'Vitamin D3 60K', description: 'Weekly vitamin D supplement for bone health.', category: 'Vitamins', imageUrl: null },
  ];

  const displayMedicines = medicines.length > 0 ? filtered : defaultMedicines;

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-secondary py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">Wholesale Medicines</h1>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            Quality pharmaceutical products at wholesale prices. Contact us for pricing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-light bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              />
            </div>
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeCategory === cat
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-gray hover:text-primary border border-gray-light/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Medicines Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-40 bg-gray-light rounded-xl mb-4" />
                  <div className="h-5 bg-gray-light rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-light rounded w-full mb-4" />
                  <div className="h-10 bg-gray-light rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayMedicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-light/50 hover:border-primary/20 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="h-44 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center overflow-hidden">
                    {medicine.imageUrl ? (
                      <img src={medicine.imageUrl} alt={medicine.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <FaPills className="text-5xl text-primary/20" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {medicine.category && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                        {medicine.category}
                      </span>
                    )}
                    <h3 className="font-heading font-semibold text-lg text-dark mb-1">{medicine.name}</h3>
                    <p className="text-gray text-sm leading-relaxed mb-4">{medicine.description}</p>

                    {/* WhatsApp Contact Button */}
                    <a
                      href={getWhatsAppLink(medicine.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-whatsapp text-white font-semibold py-2.5 rounded-xl hover:bg-whatsapp/90 hover:shadow-lg hover:shadow-whatsapp/25 transition-all duration-200"
                    >
                      <FaWhatsapp className="text-lg" />
                      Contact for Price
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {displayMedicines.length === 0 && !loading && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-light/50">
              <FaPills className="text-5xl text-gray-light mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-dark text-lg">No Medicines Found</h3>
              <p className="text-gray text-sm mt-2">Try a different search term or category</p>
            </div>
          )}

          {/* WhatsApp CTA Banner */}
          <div className="mt-12 bg-gradient-to-r from-whatsapp/10 to-emerald-50 rounded-2xl p-8 border border-whatsapp/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-dark">Need Bulk Orders?</h3>
                <p className="text-gray text-sm mt-1">Contact us on WhatsApp for wholesale pricing and special offers</p>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello, I am interested in wholesale medicine pricing')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 shrink-0"
              >
                <FaWhatsapp className="text-lg" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Medicines;
