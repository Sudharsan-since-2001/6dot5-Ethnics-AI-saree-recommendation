import { useState, useRef } from 'react';
import Head from 'next/head';

const OCCASION_GROUPS = {
  "💍 Bridal / Wedding Core": ["Wedding (own)", "Reception", "Sangeet ceremony"],
  "💐 Wedding Guest / Family Functions": ["Friend's wedding", "Relative's wedding", "Wedding anniversary", "Baby shower", "Grihapravesh", "Family gatherings"],
  "🎉 Festivals": ["Pongal", "Diwali", "Navratri", "Durga Puja", "Onam", "Vishu", "Holi", "Karva Chauth", "Raksha Bandhan", "Ganesh Chaturthi", "Ugadi"],
  "🥂 Parties & Celebrations": ["Parties", "Cocktail parties", "Birthday celebrations"],
  "🏢 Office / Professional": ["Office parties", "VC meetings"]
};

export default function Home() {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);

  const fetchRecommendations = async () => {
    if (!selectedOccasion) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/recommend?occasion=${encodeURIComponent(selectedOccasion)}`);
      const data = await res.json();

      if (res.ok) {
        setResults(data.recommendations);
        // Smooth scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>Saree AI Recommendation - Smart Assistant</title>
        <meta name="description" content="Find the perfect saree for any occasion with our rule-based AI recommendation engine." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-brand-plum rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-plum-light rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-brand mb-6 text-brand-dark">
            Saree AI Recommendation
          </h1>
          <p className="text-xl md:text-2xl text-brand-dark/70 mb-12 max-w-2xl mx-auto italic font-light">
            Experience the elegance of tradition guided by intelligent business logic.
          </p>

          {!showRecommendation ? (
            <button
              onClick={() => setShowRecommendation(true)}
              className="btn-primary text-lg"
            >
              ✨ Not sure what to choose? Try AI Recommendation
            </button>
          ) : (
            <div className="max-w-md mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-left mb-2">
                <label className="text-sm font-semibold text-brand-plum uppercase tracking-wider ml-1">Select Occasion</label>
              </div>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="dropdown-select text-lg"
              >
                <option value="">Select an Occasion</option>
                {Object.entries(OCCASION_GROUPS).map(([group, list]) => (
                  <optgroup key={group} label={group}>
                    {list.map(occ => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <button
                onClick={fetchRecommendations}
                disabled={!selectedOccasion || loading}
                className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Finding the perfect match...
                  </>
                ) : (
                  'Recommend for me'
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section ref={resultsRef} className="py-20 bg-brand-blush/30">
        <div className="container mx-auto px-4">
          {error && (
            <div className="text-center py-10">
              <p className="text-brand-plum text-lg">{error}</p>
            </div>
          )}

          {results.length > 0 ? (
            <>
              <h2 className="text-3xl font-brand mb-12 text-center text-brand-dark">
                Our Curated Recommendations for {selectedOccasion}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {results.map((saree) => (
                  <div key={saree.sku_code} className="saree-card group bg-white">
                    <div className="relative h-[450px] overflow-hidden">
                      <img
                        src={saree.image}
                        alt={saree.saree_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 bg-brand-plum text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        ₹{saree.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-8 text-center">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-brand-plum mb-3 font-bold opacity-80">
                        {saree.fabric}
                      </p>
                      <h3 className="text-xl font-brand mb-4 text-brand-dark leading-tight h-14 line-clamp-2">
                        {saree.saree_name}
                      </h3>

                      <a
                        href={saree.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full border-2 border-brand-plum text-brand-plum py-2 rounded-full font-bold hover:bg-brand-plum hover:text-white transition-all duration-300"
                      >
                        Buy Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : showRecommendation && !loading && !error && selectedOccasion && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-brand-blush max-w-2xl mx-auto shadow-sm">
              <p className="text-xl text-brand-dark/70 font-brand italic">No sarees found matching these criteria. Please try another occasion.</p>
              <button onClick={() => setShowRecommendation(false)} className="mt-6 text-brand-plum underline font-bold">Try another occasion</button>
            </div>
          )}
        </div>
      </section>

      <footer className="py-10 bg-white border-t border-brand-blush text-center text-brand-dark/50">
        <p>© 2026 Saree AI Recommendation. All rights reserved.</p>
      </footer>
    </div>
  );
}
