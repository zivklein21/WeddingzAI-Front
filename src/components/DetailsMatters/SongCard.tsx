import React from 'react'
import { IoPlayOutline } from "react-icons/io5";
import styles from './detailsMatters.module.css'

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
      <div className={styles.playButton} onClick={onPlay}>
        <IoPlayOutline />
      </div>
    </div>
  </div>
)

export default SongCard;