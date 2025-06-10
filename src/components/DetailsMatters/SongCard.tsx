import React from 'react'
import styles from './detailsMatters.module.css'
import * as Icons from "../../icons/index";
interface SongCardProps {
  title: string
  artist: string
  onPlay?: () => void
}

const SongCard: React.FC<SongCardProps> = ({ title, artist, onPlay }) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
    </div>
    <div className={styles.bodyCard}>
      <div>
        <div className={styles.artist}>{artist}</div>
      </div>
      <div className="icon" onClick={onPlay}>
        <Icons.PlayIcon title='Play The Song'/>
      </div>
    </div>
  </div>
)

export default SongCard;