
/**
 * Fetches the corrections.json and returns the `corrections` array.
 * @returns {Promise<number[]>}
 */
export async function fetchCorrections() {
    const res = await fetch('../../public/ecfr-data/corrections/corrections.json', {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      throw new Error(`Failed to load corrections.json: ${res.status}`);
    }
    const json = await res.json();
    
    return Array.isArray(json.corrections) ? json.corrections : [];
  }