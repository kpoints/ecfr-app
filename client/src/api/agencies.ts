
/**
 * Fetches the agencies.json and returns the `agencies` array.
 * @returns {Promise<number[]>}
 */
export async function fetchAgencies() {
    const res = await fetch('/ecfr-data/agencies/agencies.json', {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      throw new Error(`Failed to load agencies.json: ${res.status}`);
    }
    const json = await res.json();
    
    return Array.isArray(json.agencies) ? json.agencies : [];
  }