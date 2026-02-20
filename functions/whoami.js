// Netlify Function: Returns visitor's geolocation based on IP
// Uses ipapi.co (free, no auth required)

exports.handler = async (event) => {
  try {
    const ip = event.headers['x-forwarded-for']?.split(',')[0] || event.headers['client-ip'] || 'unknown';
    
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        ip,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        city: data.city || null,
        region: data.region || null,
        country: data.country_name || null,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to determine location', details: error.message }),
    };
  }
};
