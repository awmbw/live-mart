const axios = require('axios');

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Get location details from Google Maps API
const getLocationDetails = async (address) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      // Return mock data for development
      return {
        lat: 28.6139 + (Math.random() - 0.5) * 0.1,
        lng: 77.2090 + (Math.random() - 0.5) * 0.1,
        formattedAddress: address
      };
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: address,
          key: apiKey
        }
      }
    );

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: response.data.results[0].formatted_address
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting location details:', error);
    return null;
  }
};

// Find nearby shops based on location
const findNearbyShops = (userLat, userLng, shops, maxDistance = 10) => {
  return shops
    .map(shop => {
      if (!shop.latitude || !shop.longitude) return null;
      const distance = calculateDistance(userLat, userLng, shop.latitude, shop.longitude);
      return { ...shop, distance };
    })
    .filter(shop => shop && shop.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};

module.exports = {
  calculateDistance,
  getLocationDetails,
  findNearbyShops
};

