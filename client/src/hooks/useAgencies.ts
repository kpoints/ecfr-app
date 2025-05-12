
import { useState, useEffect } from 'react';
import { fetchAgencies } from '../api/agencies';

export function useAgencies() {
  const [agencies, setAgencies] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    fetchAgencies()
      .then(raw => {
        // raw is an array of { name, short_name, slug, children, cfr_references, … }
        const mapped = raw.map(a => ({
          name:         a.display_name,
          shortName:    a.short_name || '—',
          slug:         a.slug,
          childCount:   Array.isArray(a.children) ? a.children.length : 0,
          refCount:     Array.isArray(a.cfr_references) ? a.cfr_references.length : 0
        }));
        setAgencies(mapped);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { agencies, loading, error };
}
