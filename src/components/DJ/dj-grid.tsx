// src/components/DjsGrid/DjsGrid.tsx

import React, { useEffect, useState } from 'react';
import djService, { Dj } from '../../services/dj-service';
import DjDetail from './dj-details';
import styles from './dj-grid.module.css';

const DjsGrid: React.FC = () => {
  const [djs, setDjs]             = useState<Dj[]>([]);
  const [selectedDj, setSelectedDj] = useState<Dj | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // Read your backend base URL from env
  const BEX = import.meta.env.VITE_BACKEND_URL || '';

  useEffect(() => {
    setLoading(true);
    djService
      .fetchAllDjs()
      .then(setDjs)
      .catch(() => setError('Failed to load DJs'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading DJs…</p>;
  if (error)   return <p className={styles.error}>{error}</p>;

  return (
    <>
      <div className={styles.grid}>
        {djs.map(dj => {
          // Build the full image URL: if it's already absolute, use it; otherwise prefix your backend base URL
          const rawPath = dj.coverImage || dj.profileImage || '';
          const url =
            rawPath.startsWith('http') 
              ? rawPath 
              : `${BEX}${rawPath}`;

          return (
            <div
              key={dj.id}
              className={styles.card}
              style={{ backgroundImage: `url(${url})` }}
              onClick={() => setSelectedDj(dj)}
            >
              <div className={styles.overlay} />
              <h3 className={styles.name}>{dj.name}</h3>
            </div>
          );
        })}
      </div>

      {selectedDj && (
        <DjDetail
          dj={selectedDj}
          onClose={() => setSelectedDj(null)}
        />
      )}
    </>
  );
};

export default DjsGrid;