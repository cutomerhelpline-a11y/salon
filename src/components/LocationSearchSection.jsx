import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { findNearestSalon } from '@/lib/nearest-salon';

// Comprehensive list of Australian suburbs and their approximate coordinates
const australianSuburbs = [
  { name: 'Sydney', state: 'NSW', lat: -33.8688, lon: 151.2093 },
  { name: 'Melbourne', state: 'VIC', lat: -37.8136, lon: 144.9631 },
  { name: 'Brisbane', state: 'QLD', lat: -27.4698, lon: 153.0251 },
  { name: 'Perth', state: 'WA', lat: -31.9505, lon: 115.8605 },
  { name: 'Adelaide', state: 'SA', lat: -34.9285, lon: 138.6007 },
  { name: 'Hobart', state: 'TAS', lat: -42.8821, lon: 147.3272 },
  { name: 'Canberra', state: 'ACT', lat: -35.2809, lon: 149.1300 },
  { name: 'Darwin', state: 'NT', lat: -12.4634, lon: 130.8456 },
  { name: 'Parramatta', state: 'NSW', lat: -33.8121, lon: 151.0049 },
  { name: 'Newcastle', state: 'NSW', lat: -32.9271, lon: 151.7826 },
  { name: 'Wollongong', state: 'NSW', lat: -34.4268, lon: 150.8931 },
  { name: 'Gold Coast', state: 'QLD', lat: -28.0028, lon: 153.4314 },
  { name: 'Sunshine Coast', state: 'QLD', lat: -26.7963, lon: 153.0005 },
  { name: 'Townsville', state: 'QLD', lat: -19.2643, lon: 146.8118 },
  { name: 'Cairns', state: 'QLD', lat: -16.8661, lon: 145.7781 },
  { name: 'Toowoomba', state: 'QLD', lat: -27.5598, lon: 151.9507 },
  { name: 'Geelong', state: 'VIC', lat: -38.1499, lon: 144.3617 },
  { name: 'Ballarat', state: 'VIC', lat: -37.5550, lon: 143.8503 },
  { name: 'Bendigo', state: 'VIC', lat: -36.7597, lon: 144.2801 },
  { name: 'Shepparton', state: 'VIC', lat: -36.3817, lon: 145.3927 },
  { name: 'Albury', state: 'NSW', lat: -36.0737, lon: 146.9135 },
  { name: 'Dubbo', state: 'NSW', lat: -32.2453, lon: 148.6055 },
  { name: 'Tamworth', state: 'NSW', lat: -31.0925, lon: 150.8313 },
  { name: 'Armidale', state: 'NSW', lat: -30.5076, lon: 151.6337 },
  { name: 'Lismore', state: 'NSW', lat: -28.8093, lon: 153.2774 },
  { name: 'Coffs Harbour', state: 'NSW', lat: -30.3031, lon: 153.1191 },
  { name: 'Port Macquarie', state: 'NSW', lat: -31.4312, lon: 152.9101 },
  { name: 'Gosford', state: 'NSW', lat: -33.4409, lon: 151.3424 },
  { name: 'Penrith', state: 'NSW', lat: -33.7449, lon: 150.6901 },
  { name: 'Bathurst', state: 'NSW', lat: -33.4148, lon: 149.5825 },
  { name: 'Orange', state: 'NSW', lat: -33.2869, lon: 149.0984 },
  { name: 'Mudgee', state: 'NSW', lat: -32.6127, lon: 149.5781 },
  { name: 'Goulburn', state: 'NSW', lat: -34.7516, lon: 149.1203 },
  { name: 'Canberra', state: 'ACT', lat: -35.2809, lon: 149.1300 },
  { name: 'Queanbeyan', state: 'ACT', lat: -35.3506, lon: 149.2280 },
  { name: 'Wagga Wagga', state: 'NSW', lat: -35.1064, lon: 147.3605 },
  { name: 'Riverina', state: 'NSW', lat: -34.5, lon: 147.5 },
  { name: 'Nowra', state: 'NSW', lat: -34.8822, lon: 150.5919 },
  { name: 'Batemans Bay', state: 'NSW', lat: -35.7110, lon: 150.1770 },
  { name: 'Merimbula', state: 'NSW', lat: -36.8942, lon: 149.9043 },
  { name: 'Geraldton', state: 'WA', lat: -28.7692, lon: 114.6100 },
  { name: 'Busselton', state: 'WA', lat: -33.6488, lon: 115.3303 },
  { name: 'Margaret River', state: 'WA', lat: -33.9549, lon: 115.0711 },
  { name: 'Albany', state: 'WA', lat: -34.4848, lon: 117.8813 },
  { name: 'Esperance', state: 'WA', lat: -33.8603, lon: 121.8947 },
  { name: 'Kalgoorlie', state: 'WA', lat: -30.9455, lon: 121.1681 },
  { name: 'Bunbury', state: 'WA', lat: -33.3268, lon: 115.6348 },
  { name: 'Karratha', state: 'WA', lat: -22.7139, lon: 118.7239 },
  { name: 'Port Hedland', state: 'WA', lat: -20.3136, lon: 118.5891 },
  { name: 'Adelaide', state: 'SA', lat: -34.9285, lon: 138.6007 },
  { name: 'Mount Gambier', state: 'SA', lat: -37.8252, lon: 140.7811 },
  { name: 'Port Augusta', state: 'SA', lat: -32.4999, lon: 137.7693 },
  { name: 'Ceduna', state: 'SA', lat: -32.3011, lon: 133.6993 },
  { name: 'Barossa Valley', state: 'SA', lat: -34.5000, lon: 139.0000 },
  { name: 'Hobart', state: 'TAS', lat: -42.8821, lon: 147.3272 },
  { name: 'Launceston', state: 'TAS', lat: -41.4308, lon: 147.1192 },
  { name: 'Devonport', state: 'TAS', lat: -41.1748, lon: 146.3839 },
  { name: 'Burnie', state: 'TAS', lat: -41.0562, lon: 145.9133 },
  { name: 'Ulverstone', state: 'TAS', lat: -41.1318, lon: 146.1683 },
];

export default function LocationSearchSection() {
  const [selectedSuburb, setSelectedSuburb] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const sortedSuburbs = useMemo(
    () => australianSuburbs.sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const handleSearch = async () => {
    if (!selectedSuburb) return;

    setLoading(true);
    setSearched(true);

    try {
      const salonsResponse = await fetch('/data/salons.json');
      const salons = await salonsResponse.json();

      const nearest = findNearestSalon(
        selectedSuburb.lat,
        selectedSuburb.lon,
        salons,
        200 // Allow wider search for location search (200km)
      );

      if (nearest) {
        setSearchResults(nearest);
        // Save to localStorage for checkout
        localStorage.setItem('selectedSalon', JSON.stringify(nearest));
        localStorage.setItem('selectedSuburb', JSON.stringify(selectedSuburb));
      } else {
        setSearchResults(null);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
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
        Select your suburb or area to find your nearest The Salon Edit location.
      </p>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            Select Suburb/City
          </label>
          <select
            value={selectedSuburb ? JSON.stringify(selectedSuburb) : ''}
            onChange={(e) =>
              setSelectedSuburb(
                e.target.value ? JSON.parse(e.target.value) : null
              )
            }
            className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="">-- Choose a suburb --</option>
            {sortedSuburbs.map((suburb, idx) => (
              <option key={idx} value={JSON.stringify(suburb)}>
                {suburb.name}, {suburb.state}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSearch}
          disabled={!selectedSuburb || loading}
          className="w-full bg-neutral-900 text-white py-3 px-6 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
        >
          {loading ? 'Searching...' : 'Search Locations'}
        </button>
      </div>

      {/* Search Results */}
      {searched && (
        <>
          {searchResults ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-neutral-50 p-6 rounded-lg border border-neutral-200"
            >
              <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-3">
                Nearest Location Found
              </p>
              <h4 className="font-serif text-lg text-neutral-900 mb-2">
                The Salon Edit (formerly {searchResults.name})
              </h4>
              <p className="text-neutral-600 text-sm mb-3">
                📍 {searchResults.address}, {searchResults.state} {searchResults.postcode}
              </p>
              {searchResults.phone && (
                <p className="text-neutral-600 text-sm mb-2">
                  📞 {searchResults.phone}
                </p>
              )}
              <p className="text-neutral-500 text-xs italic">
                ✓ Location saved for checkout
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-red-50 p-6 rounded-lg border border-red-200 text-center"
            >
              <p className="text-neutral-700 text-sm mb-4">
                We don't currently have a branch in {selectedSuburb?.name}. 
              </p>
              <p className="text-neutral-600 text-sm mb-4">
                Check with our staff members in nearby locations via WhatsApp for at-home service availability.
              </p>
              <a
                href="https://wa.me/?text=Hi,%20I%20would%20like%20to%20know%20if%20you%20offer%20services%20in%20my%20area."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-neutral-900 text-white px-6 py-2 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-neutral-800 transition-all rounded-lg"
              >
                Contact us on WhatsApp
              </a>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
