import React, { useState } from 'react';
import styles from './detailsMatters.module.css';
import { FaMusic, FaGift, FaExternalLinkAlt } from 'react-icons/fa';

interface SongSuggestion {
  title: string;
  artist: string;
  description: string;
  link?: string;
}

const DetailsMatters = () => {
  const [songPrompt, setSongPrompt] = useState('');
  const [songSuggestions, setSongSuggestions] = useState<SongSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSongPrompt = async () => {
    if (!songPrompt) return;
    
    setIsLoading(true);
    try {
      // TODO: Implement API call to get song suggestions
      // For now, using mock data
      setSongSuggestions([
        {
          title: "Can't Help Falling in Love",
          artist: "Elvis Presley",
          description: "A timeless classic perfect for the first dance",
          link: "https://www.youtube.com/watch?v=vGJTaP6anOU"
        }
      ]);
    } catch (error) {
      console.error('Failed to get song suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Details Matter</h1>
      
      {/* Wedding Songs Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FaMusic className={styles.icon} /> Wedding Songs
        </h2>
        <div className={styles.songPrompt}>
          <textarea
            value={songPrompt}
            onChange={(e) => setSongPrompt(e.target.value)}
            placeholder="Describe your wedding style, mood, or preferences for song suggestions..."
            className={styles.promptInput}
          />
          <button 
            onClick={handleSongPrompt}
            disabled={isLoading}
            className={styles.promptButton}
          >
            {isLoading ? 'Getting Suggestions...' : 'Get Song Suggestions'}
          </button>
        </div>
        
        {songSuggestions.length > 0 && (
          <div className={styles.suggestions}>
            {songSuggestions.map((song, index) => (
              <div key={index} className={styles.songCard}>
                <h3>{song.title}</h3>
                <p className={styles.artist}>{song.artist}</p>
                <p className={styles.description}>{song.description}</p>
                {song.link && (
                  <a 
                    href={song.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Listen <FaExternalLinkAlt />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Wedding Details & Recommendations */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FaGift className={styles.icon} /> Wedding Details & Recommendations
        </h2>
        
        <div className={styles.recommendations}>
          <div className={styles.category}>
            <h3>Guest Favors</h3>
            <ul className={styles.linkList}>
              <li>
                <a href="https://www.aliexpress.com/..." target="_blank" rel="noopener noreferrer">
                  Personalized Wedding Favors <FaExternalLinkAlt />
                </a>
              </li>
              <li>
                <a href="https://www.aliexpress.com/..." target="_blank" rel="noopener noreferrer">
                  Elegant Guest Gifts <FaExternalLinkAlt />
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.category}>
            <h3>Decoration Ideas</h3>
            <ul className={styles.linkList}>
              <li>
                <a href="https://www.aliexpress.com/..." target="_blank" rel="noopener noreferrer">
                  Wedding Arch Decorations <FaExternalLinkAlt />
                </a>
              </li>
              <li>
                <a href="https://www.aliexpress.com/..." target="_blank" rel="noopener noreferrer">
                  Table Centerpieces <FaExternalLinkAlt />
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.category}>
            <h3>Wedding Planning Tips</h3>
            <ul className={styles.tipsList}>
              <li>Create a detailed timeline for the wedding day</li>
              <li>Prepare a backup plan for outdoor ceremonies</li>
              <li>Have a designated person for vendor coordination</li>
              <li>Create a wedding day emergency kit</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetailsMatters; 