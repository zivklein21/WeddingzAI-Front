// src/components/DJ/DjsGrid.tsx
import React, { useEffect, useState } from 'react';
import djService, { Dj }         from '../../services/dj-service';
import DjDetailModal          from './dj-details';
import styles                    from './dj-grid.module.css';

const DjsGrid: React.FC = () => {
  const [djs, setDjs] = useState<Dj[]>([]);
  const [selected, setSelected] = useState<Dj|null>(null);

  useEffect(() => {
    djService.fetchAllDjs()
      .then(all => {
        // סינון רק עם שם תקין
        setDjs(all.filter(dj => dj.name && dj.name.trim().length > 0));
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <div className={styles.grid}>
        {djs.map(dj => (
          <div
            key={dj._id}
            className={styles.card}
            onClick={() => setSelected(dj)}
            style={{ backgroundImage: `url(${dj.coverImage || dj.profileImage})` }}
          >
            <div className={styles.overlay}/>
            <h3 className={styles.name}>{dj.name}</h3>
          </div>
        ))}
      </div>

      {selected && (
        <DjDetailModal
          dj={selected}
          isOpen={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

export default DjsGrid;