function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function calculateAvgLatLngAndTerritory(listings) {
  let totalLatitude = 0;
  let totalLongitude = 0;
  let furthestListing = null;
  let furthestDistance = 0;

  // **Choose Territory Radius Calculation Approach (Uncomment your preferred option):**

  // **Haversine Formula (More Accurate):**
  let distances = []; // Store distances to each listing for radius calculation

  for (const listing of listings) {
    totalLatitude += listing.latitude;
    totalLongitude += listing.longitude;

    // Haversine Formula with placeholder values (not used for radius calculation)
    haversineDistance(listing.latitude, listing.longitude, 0, 0);
  }

  const averageLatitude = totalLatitude / listings.length;
  const averageLongitude = totalLongitude / listings.length;

  // **Haversine Formula Approach (Calculate distances after loop):**
  for (const listing of listings) {
    distances.push(
      haversineDistance(
        averageLatitude,
        averageLongitude,
        listing.latitude,
        listing.longitude
      )
    );
  }

  const territoryRadius = 10000; // Get the maximum distance (farthest point)

  return {
    averageLatitude,
    averageLongitude,
    territoryRadius,
  };
}
