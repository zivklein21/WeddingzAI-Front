// src/pages/ScrapeDjPage.tsx

import React, { useState } from 'react';
import djService from '../../services/dj-service';
import styles from './scrape-dj.module.css';

const ScrapeDj: React.FC = () => {
  const [listingUrl, setListingUrl] = useState('');
  const [singleUrl, setSingleUrl] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError]   = useState<string | null>(null);

  const handleBulkScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const result = await djService.findDjs(listingUrl);
      setStatus(`Bulk scrape started: ${result.message}`);
    } catch (err: any) {
      setError(err.message || 'Bulk scrape failed');
    }
  };

  const handleSingleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const result = await djService.scrapeOneDj(singleUrl);
      setStatus(`Saved DJ: ${result.dj.name}`);
    } catch (err: any) {
      setError(err.message || 'Single scrape failed');
    }
  };

  return (
    <div className={styles.page}>
      <h1>DJ Scraping</h1>

      <section className={styles.section}>
        <h2>Bulk Scrape from Listing URL</h2>
        <form onSubmit={handleBulkScrape} className={styles.form}>
          <input
            type="url"
            placeholder="Enter listing URL"
            value={listingUrl}
            onChange={e => setListingUrl(e.target.value)}
            required
          />
          <button type="submit">Start Bulk Scrape</button>
        </form>
      </section>

      <section className={styles.section}>
        <h2>Scrape Single DJ Profile</h2>
        <form onSubmit={handleSingleScrape} className={styles.form}>
          <input
            type="url"
            placeholder="Enter DJ profile URL"
            value={singleUrl}
            onChange={e => setSingleUrl(e.target.value)}
            required
          />
          <button type="submit">Scrape One DJ</button>
        </form>
      </section>

      {status && <p className={styles.status}>{status}</p>}
      {error  && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ScrapeDj;