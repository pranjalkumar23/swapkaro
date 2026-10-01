export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.7041, lng: 77.1025 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Chandigarh: { lat: 30.7333, lng: 76.7794 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
  Indore: { lat: 22.7196, lng: 75.8577 },
  Surat: { lat: 21.1702, lng: 72.8311 },
};

export function coordsForCity(city: string): { lat: number; lng: number } {
  const match = CITY_COORDS[city.trim()];
  if (match) return match;
  return CITY_COORDS.Delhi;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Rounded, low-precision distance label — never exposes exact coordinates. */
export function formatDistance(km: number): string {
  if (km < 1) return "< 1 km away";
  if (km < 10) return `~${Math.round(km)} km away`;
  return `~${Math.round(km / 5) * 5} km away`;
}
