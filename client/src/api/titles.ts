
/**
 * Fetches the titles.json and returns the `titles` array.
 * @returns {Promise<number[]>}
 */
export async function fetchTitles() {
    const res = await fetch('/ecfr-data/titles/titles.json', {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      throw new Error(`Failed to load titles.json: ${res.status}`);
    }
    const json = await res.json();
    
    return Array.isArray(json.titles) ? json.titles : [];
  }