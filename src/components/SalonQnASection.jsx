import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { openWhatsApp } from '@/lib/whatsapp';

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

const SALON_PHONE = '61468231108';

export default function SalonQnASection() {
  const [selected, setSelected] = useState([]);
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/data/salons.json');
        const data = await res.json();
        setSalons(data);
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
  };

  const handleGetAnswers = () => {
    if (selected.length === 0) return;

    const selectedQuestions = selected.map((i) => questions[i]).join('\n• ');
    let body = `Hi, I have the following questions:\n\n• ${selectedQuestions}`;

    if (selected.includes(2) && foundSalon) {
      if (foundSalon.notFound) {
        body += `\n\nSuburb Searched: ${selectedSuburb}\n\nCouldn't fetch the exact address from our database, but please check with our staff or team as we may have locations or at-home services available in your area!`;
      } else {
        body += `\n\nSuburb Searched: ${selectedSuburb}\nOur Location: The Salon Edit (formerly ${foundSalon.name})\nAddress: ${foundSalon.address}, ${foundSalon.state} ${foundSalon.postcode}`;
      }
    } else if (selected.includes(2)) {
      body += `\n\nSuburb Searched: ${selectedSuburb}`;
    }

    body += `\n\nPlease help me with answers. Thank you!`;

    openWhatsApp(SALON_PHONE, body);
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
                      foundSalon?.notFound
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    {foundSalon?.notFound ? (
                      <>
                        <p className="text-xs font-medium text-neutral-600 mb-2">
                          ⚠ WE'LL CHECK WITH OUR TEAM
                        </p>
                        <p className="text-xs text-neutral-600">
                          Couldn't find an exact address for {selectedSuburb} in our database, but our staff will confirm if we have a location or at-home service available in your area. Please proceed with your questions!
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-neutral-600 mb-2">
                          ✓ LOCATION FOUND IN {selectedSuburb.toUpperCase()}
                        </p>
                        <h4 className="font-serif text-sm text-neutral-900 mb-1">
                          The Salon Edit (formerly {foundSalon?.name})
                        </h4>
                        <p className="text-xs text-neutral-600">
                          📍 {foundSalon?.address}, {foundSalon?.state} {foundSalon?.postcode}
                        </p>
                      </>
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
