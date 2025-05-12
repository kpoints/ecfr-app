import { useState, useEffect } from 'react';
import { fetchTitles } from '../api/titles';

export function useTitles() {
  const [titles, setTitles]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetchTitles()
      .then(raw => {
        // raw is an array of objects like:
        // { number, name, latest_amended_on, latest_issue_date, up_to_date_as_of, reserved }
        const mapped = raw.map(t => ({
          number:          t.number,
          name:            t.name,
          lastAmendedOn:   t.latest_amended_on,
          latestIssueDate: t.latest_issue_date,
          upToDateAsOf:    t.up_to_date_as_of,
          reserved:        t.reserved
        }));
        setTitles(mapped);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { titles, loading, error };
}
