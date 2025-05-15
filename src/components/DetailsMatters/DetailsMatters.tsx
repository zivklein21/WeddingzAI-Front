// DetailsMatters.tsx
import React, { useState, useEffect } from 'react';
import styles from './DetailsMatters.module.css';
import { FaMusic, FaGift, FaExternalLinkAlt } from 'react-icons/fa';
import detailsMatterService, { CanceledError, SongSuggestion } from '../../services/details-matter-service';

const DetailsMatters: React.FC = () => {
  const [songPrompt, setSongPrompt] = useState('');
  const [songSuggestions, setSongSuggestions] = useState<SongSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRequest, setCurrentRequest] = useState<{ abort: () => void } | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup any pending requests when component unmounts
      if (currentRequest) {
        currentRequest.abort();
      }
    };
  }, [currentRequest]);

  const handleSongPrompt = async () => {
    if (!songPrompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const request = detailsMatterService.getSongSuggestions(songPrompt);
      setCurrentRequest(request);
      const response = await request.request;
      
      if (response.data && Array.isArray(response.data)) {
        setSongSuggestions(response.data);
      } else {
        setError('Invalid response format from server');
      }
    } catch (error) {
      if (error instanceof CanceledError) {
        console.log('Request was canceled');
        return;
      }
      
      console.error('Failed to get song suggestions:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number; data?: { message?: string } } };
        if (axiosError.response) {
          switch (axiosError.response.status) {
            case 400:
              setError('Invalid request. Please check your input.');
              break;
            case 401:
              setError('Please log in again to continue.');
              break;
            case 500:
              setError('Server error. Please try again later.');
              break;
            default:
              setError(`Error: ${axiosError.response.data?.message || 'Unknown error'}`);
          }
        } else {
          setError('No response from server. Please check your connection.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setCurrentRequest(null);
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
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
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
                <a href="https://urbanbridesmag.co.il/שופינג-אונליין-מציאות-לחתונה-מאלי-אקספרס.html" target="_blank" rel="noopener noreferrer">
                  Personalized Wedding Favors <FaExternalLinkAlt />
                </a>
              </li>
              <li>
                <a href="https://docs.google.com/spreadsheets/d/1PU9aCVYIAWQ-2wpToobJ1fqXFY9wYaFtdxV63CEs5uk/htmlview#gid=0" target="_blank" rel="noopener noreferrer">
                  Document with all the recommendations from Aliexpress <FaExternalLinkAlt />
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.category}>
            <h3>Decoration Ideas</h3>
            <ul className={styles.linkList}>
              <li>
                <a href="https://www.pinterest.com/stylemepretty/wedding-decorations-furniture/" target="_blank" rel="noopener noreferrer">
                  Pintrest Wedding Arch Decorations <FaExternalLinkAlt />
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