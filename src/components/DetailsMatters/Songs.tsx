// src/components/DetailsMatters/Songs.tsx
import React, { useState, useEffect } from 'react';
import detailsMatterService, { CanceledError, SongSuggestion } from '../../services/details-matter-service';
import styles from './detailsMatters.module.css';
import SongCard from './SongCard';
import { toast } from 'react-toastify';
import * as Icons from "../../icons/index";

const Songs: React.FC = () => {
  const [songPrompt, setSongPrompt] = useState('');
  const [songSuggestions, setSongSuggestions] = useState<SongSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<{ abort: () => void } | null>(null);

  useEffect(() => {
    return () => {
      currentRequest?.abort();
    };
  }, [currentRequest]);

  const handleSongPrompt = async () => {
    if (!songPrompt.trim()) {
      toast.error("No prompt set");
      return;
    }

    setIsLoading(true);
    try {
      const { request, abort } = detailsMatterService.getSongSuggestions(songPrompt);
      setCurrentRequest({ abort });
      const response = await request;
      setSongSuggestions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      if (err instanceof CanceledError) return;
      toast.error("Error fetching suggestions");
    } finally {
      setIsLoading(false);
      setCurrentRequest(null);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Wedding Songs</h2>
      <div className={styles.songPrompt}>
        <textarea
          value={songPrompt}
          onChange={e => setSongPrompt(e.target.value)}
          placeholder="Describe your wedding style, mood, or preferences for song suggestions... (English Artists only)"
          className={styles.promptInput}
        />
        {isLoading
          ? <Icons.LoaderIcon className="spinner" />
          : (
            <span
              role="button"
              tabIndex={0}
              onClick={handleSongPrompt}
              onKeyPress={e => { if (e.key === 'Enter') handleSongPrompt() }}
              className="icon"
              
              >
              <Icons.MusicIcon title='Generate Songs'/>
            </span>
          )
        }
      </div>

      <div className={styles.songsSuggestion}>
        <div className={styles.songsScroll}>
          {songSuggestions.length > 0 && (
            <div className={styles.suggestionsGrid}>
              {songSuggestions.map((song, i) => (
                <SongCard
                  key={i}
                  title={song.title}
                  artist={song.artist}
                  onPlay={() => window.open(song.link || '#', '_blank')}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Songs;