import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SearchLocations() {
  const [salons, setSalons] = useState([]);
  const [suburbs, setSuburbs] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Load salons and extract unique suburbs
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/salons.json');
        const salonData = await response.json();
        setSalons(salonData);

        // Extract unique suburbs sorted alphabetically
        const uniqueSuburbs = [...new Set(salonData.map((s) => s.suburb))].sort();
        setSuburbs(uniqueSuburbs);

        // Load saved location from localStorage
        const saved = localStorage.getItem('selectedSalonLocation');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSelectedLocation(parsed);
        }
      } catch (error) {
        console.error('Error loading salons:', error);
      }
    };

    loadData();
  }, []);

  const handleSearch = () => {
    if (!selectedSuburb && !searchInput.trim()) {
      setSearchResults([]);
      setSearched(false);
      return;
    }

    setSearched(true);
    const query = (searchInput + selectedSuburb).toLowerCase();

    const results = salons.filter((salon) => {
      const salonText = `${salon.suburb} ${salon.address} ${salon.name}`.toLowerCase();
      return salonText.includes(query);
    });

    setSearchResults(results);
  };

  const handleSelectLocation = (salon) => {
    const locationData = {
      id: salon.id,
      name: salon.name,
      address: salon.address,
      suburb: salon.suburb,
      state: salon.state,
      postcode: salon.postcode,
      phone: salon.phone,
    };
    setSelectedLocation(locationData);
    localStorage.setItem('selectedSalonLocation', JSON.stringify(locationData));
    setSearchInput('');
    setSelectedSuburb('');
    setSearchResults([]);
    setSearched(false);
  };

  const handleClearSelection = () => {
    setSelectedLocation(null);
    localStorage.removeItem('selectedSalonLocation');
  };

  const handleWhatsAppAsk = () => {
    const message = encodeURIComponent(
      'Hi, I am looking for a salon in a specific location. Can you please provide information about salons in my area? Thank you!'
    );
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
        Check if we have a branch in your area
      </h3>
      <p className="text-neutral-500 text-sm mb-8">
        Search for available locations near you by suburb or address.
      </p>

      {/* Selected Location Display */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-50 p-6 rounded-lg mb-8 border border-green-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
                Selected Location
              </p>
              <h4 className="font-serif text-lg text-neutral-900 mb-2">
                The Salon Edit (formerly {selectedLocation.name})
              </h4>
              <p className="text-neutral-600 text-sm mb-1">
                📍 {selectedLocation.address}, {selectedLocation.state} {selectedLocation.postcode}
              </p>
              {selectedLocation.phone && (
                <p className="text-neutral-600 text-sm">
                  📞 {selectedLocation.phone}
                </p>
              )}
            </div>
            <button
              onClick={handleClearSelection}
              className="text-neutral-500 hover:text-neutral-900 text-2xl"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Search Form */}
      {!selectedLocation && (
        <>
          <div className="space-y-4 mb-6">
            {/* Suburb Dropdown */}
            <div className="relative">
              <label className="block text-sm text-neutral-600 mb-2">
                Select Suburb
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search or type suburb..."
                  value={selectedSuburb}
                  onChange={(e) => setSelectedSuburb(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                />
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10"
                  >
                    {suburbs
                      .filter((s) => s.toLowerCase().includes(selectedSuburb.toLowerCase()))
                      .slice(0, 20)
                      .map((suburb) => (
                        <button
                          key={suburb}
                          onClick={() => {
                            setSelectedSuburb(suburb);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-sm"
                        >
                          {suburb}
                        </button>
                      ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Address Search */}
            <div>
              <label className="block text-sm text-neutral-600 mb-2">
                Or search by address/name
              </label>
              <input
                type="text"
                placeholder="Enter address or salon name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-neutral-900 text-white py-3 px-6 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-neutral-800 transition-all duration-300 rounded-lg mb-6"
          >
            Search Locations
          </button>

          {/* Search Results */}
          {searched && (
            <div>
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 mb-4">
                    Found {searchResults.length} location(s):
                  </p>
                  {searchResults.map((salon) => (
                    <motion.button
                      key={salon.id}
                      onClick={() => handleSelectLocation(salon)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full text-left bg-neutral-50 p-4 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-100 transition-all"
                    >
                      <h5 className="font-serif text-neutral-900 mb-1">
                        The Salon Edit (formerly {salon.name})
                      </h5>
                      <p className="text-neutral-600 text-sm mb-2">
                        📍 {salon.address}, {salon.state} {salon.postcode}
                      </p>
                      {salon.phone && (
                        <p className="text-neutral-500 text-xs">
                          📞 {salon.phone}
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 text-center"
                >
                  <p className="text-neutral-600 mb-4">
                    No locations found in that area.
                  </p>
                  <button
                    onClick={handleWhatsAppAsk}
                    className="inline-block bg-green-600 text-white px-8 py-2 text-xs tracking-widest uppercase font-medium hover:bg-green-700 transition-all rounded"
                  >
                    Check with us on WhatsApp
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
