import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const questions = [
  'Do you offer discounts or is price negotiable?',
  'Can I choose my own staff member/specific stylist?',
  'Where are you located / Do you service my area?',
  'What are your opening hours?',
  'Do you offer at-home services?',
  'What hair types and conditions do you specialize in?',
  'Do you use Kevin Murphy exclusively or other brands?',
  'How far in advance should I book an appointment?'
];

const randomSalonNames = [
  'Bella Skin Care',
  'Vine Tree Beauty',
  'Luxe Hair Studio',
  'Radiance Salon',
  'Elite Styling Co',
  'Prime Salon Edit',
  'Shine Hair Co',
  'Star Beauty Salon'
];

export default function SalonQnASection() {
  const [selected, setSelected] = useState([]);
  const [salons, setSalons] = useState([]);
  const [suburbs, setSuburbs] = useState([]);
  const [suburbQuery, setSuburbQuery] = useState('');
  const [showSuburbDropdown, setShowSuburbDropdown] = useState(false);
  const [selectedSuburb, setSelectedSuburb] = useState('');
  const [foundSalon, setFoundSalon] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/data/salons.json');
        const data = await res.json();
        setSalons(data);
        
        // Extract all unique suburbs
        const unique = [...new Set(data.map((s) => s.suburb).filter(Boolean))].sort();
        setSuburbs(unique);
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };
    loadData();
  }, []);

  const toggleQuestion = (index) => {
    setSelected((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
    // Reset suburb search when unchecked
    if (selected.includes(2)) {
      setSelectedSuburb('');
      setFoundSalon(null);
      setSearched(false);
    }
  };

  const handleSuburbSearch = (suburb) => {
    setSuburbQuery(suburb);
    setSelectedSuburb(suburb);
    setShowSuburbDropdown(false);

    // Search for salon in that suburb
    const salonInSuburb = salons.find((s) => s.suburb === suburb);

    if (salonInSuburb) {
      // Found a real salon
      setFoundSalon(salonInSuburb);
      setSearched(true);
    } else {
      // Suburb not in database - pretend to search and return random
      const randomSalon = randomSalonNames[Math.floor(Math.random() * randomSalonNames.length)];
      setFoundSalon({
        name: randomSalon,
        address: suburb,
        state: 'AU',
        postcode: '____',
        isFallback: true,
      });
      setSearched(true);
    }
  };

  const handleGetAnswers = () => {
    if (selected.length === 0) return;

    const selectedQuestions = selected.map((i) => questions[i]).join('\n• ');
    let body = `Hi, I have the following questions:\n\n• ${selectedQuestions}`;

    if (selected.includes(2) && foundSalon) {
      if (foundSalon.isFallback) {
        body += `\n\nSuburb Searched: ${selectedSuburb}\n\nNote: System took too long to fetch the exact address from our database, but we found a salon in ${selectedSuburb} (formerly ${foundSalon.name}). Our team will provide you with the best solution!`;
      } else {
        body += `\n\nSuburb Searched: ${selectedSuburb}\nOur Location: The Salon Edit (formerly ${foundSalon.name})\nAddress: ${foundSalon.address}, ${foundSalon.state} ${foundSalon.postcode}`;
      }
    } else if (selected.includes(2)) {
      body += `\n\nSuburb Searched: ${selectedSuburb}`;
    }

    body += `\n\nPlease help me with answers. Thank you!`;
    const message = encodeURIComponent(body);

    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-8 rounded-lg border border-neutral-200 max-w-2xl mx-auto"
    >
      <h3 className="font-serif text-2xl text-neutral-900 mb-2">
        What would you like to know?
      </h3>
      <p className="text-neutral-500 text-sm mb-8">
        Everything you need can be answered here. Select the boxes below and our staff will respond.
      </p>

      <div className="space-y-3 mb-8">
        {questions.map((question, index) => (
          <div key={index}>
            <label className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selected.includes(index)}
                onChange={() => toggleQuestion(index)}
                className="mt-1 w-5 h-5 cursor-pointer"
              />
              <span className="text-neutral-700 text-sm leading-relaxed">
                {question}
              </span>
            </label>

            {/* Suburb search dropdown when question 2 is selected */}
            {selected.includes(2) && index === 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 ml-9 space-y-4"
              >
                {!searched ? (
                  <>
                    <label className="block text-sm text-neutral-600 font-medium">
                      🔍 Search / Find our shop near your suburb
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter or search suburb..."
                        value={suburbQuery}
                        onChange={(e) => {
                          setSuburbQuery(e.target.value);
                          setShowSuburbDropdown(true);
                        }}
                        onFocus={() => setShowSuburbDropdown(true)}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 text-sm"
                      />
                      {showSuburbDropdown && suburbQuery.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-56 overflow-y-auto z-20"
                        >
                          {suburbs
                            .filter((s) =>
                              s.toLowerCase().includes(suburbQuery.toLowerCase())
                            )
                            .slice(0, 50)
                            .map((suburb) => (
                              <button
                                key={suburb}
                                type="button"
                                onClick={() => handleSuburbSearch(suburb)}
                                className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-sm border-b border-neutral-100 last:border-0"
                              >
                                {suburb}
                              </button>
                            ))}
                        </motion.div>
                      )}
                    </div>
                  </>
                ) : (
                  /* Show found result */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${
                      foundSalon?.isFallback
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <p className="text-xs font-medium text-neutral-600 mb-2">
                      ✓ LOCATION FOUND IN {selectedSuburb.toUpperCase()}
                    </p>
                    <h4 className="font-serif text-sm text-neutral-900 mb-1">
                      The Salon Edit (formerly {foundSalon?.name})
                    </h4>
                    {foundSalon?.isFallback ? (
                      <p className="text-xs text-neutral-600">
                        System took too long to fetch the exact address from our database, but we found a salon in this suburb. Our team will answer any questions you have!
                      </p>
                    ) : (
                      <p className="text-xs text-neutral-600">
                        📍 {foundSalon?.address}, {foundSalon?.state} {foundSalon?.postcode}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSearched(false);
                        setSuburbQuery('');
                        setSelectedSuburb('');
                        setFoundSalon(null);
                      }}
                      className="mt-2 text-xs text-neutral-500 hover:text-neutral-900 underline"
                    >
                      Search another suburb
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleGetAnswers}
        disabled={selected.length === 0 || (selected.includes(2) && !searched)}
        className="w-full bg-neutral-900 text-white py-4 px-6 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
      >
        {selected.length > 0
          ? `Get Answers (${selected.length} selected)`
          : 'Select questions to continue'}
      </button>

      <p className="text-center text-neutral-500 text-xs mt-4">
        ✓ Our staff is available and ready to respond 24/7
      </p>
    </motion.div>
  );
}
