/**
 * Haversine formula to calculate distance between two points (in km)
 */
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearest salon to a given lat/lon
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {Array} salons - Array of salon objects (must have lat, lon)
 * @param {number} maxDistance - Maximum distance in km to show salon (default 35km)
 * @returns {Object} Nearest salon with distance, or null if exceeds maxDistance
 */
export function findNearestSalon(userLat, userLon, salons, maxDistance = 35) {
  if (!userLat || !userLon || !Array.isArray(salons) || salons.length === 0) {
    return null;
  }

  let nearest = null;
  let minDistance = Infinity;

  for (const salon of salons) {
    if (salon.lat && salon.lon) {
      const distance = haversine(userLat, userLon, salon.lat, salon.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...salon, distance: Math.round(distance) };
      }
    }
  }

  // Only return salon if within max distance threshold
  if (nearest && minDistance <= maxDistance) {
    return nearest;
  }

  return null;
}

/**
 * Advanced location fetching with retry logic and multiple fallbacks
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<Object>} Object with latitude, longitude, city, region
 */
export async function getUserLocationFromIP(maxRetries = 3) {
  const apis = [
    {
      name: 'Netlify',
      fetch: () => fetch('/.netlify/functions/whoami', { timeout: 2000 }),
      parse: (data) => ({
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        region: data.region,
        country: data.country,
      }),
    },
    {
      name: 'ipapi.co',
      fetch: () =>
        fetch('https://ipapi.co/json/', {
          headers: { Accept: 'application/json' },
          timeout: 3000,
        }),
      parse: (data) => ({
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        region: data.region,
        country: data.country_name,
      }),
    },
    {
      name: 'ip-api.com',
      fetch: () =>
        fetch('http://ip-api.com/json/', { timeout: 3000 }),
      parse: (data) => ({
        latitude: data.lat,
        longitude: data.lon,
        city: data.city,
        region: data.regionName,
        country: data.country,
      }),
    },
  ];

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    for (const api of apis) {
      try {
        const response = await api.fetch();
        if (response.ok) {
          const data = await response.json();
          if (data.latitude && data.longitude) {
            console.log(`✓ Location loaded via ${api.name}`);
            return api.parse(data);
          }
        }
      } catch (error) {
        console.log(`✗ ${api.name} attempt ${attempt + 1} failed:`, error.message);
      }
    }

    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }

  console.warn('⚠ All location APIs failed after retries');
  return null;
}
