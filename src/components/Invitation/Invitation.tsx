import React, { useState } from 'react';
import styles from './Invitation.module.css';
import { FaImage, FaSpinner, FaExternalLinkAlt, FaDownload } from 'react-icons/fa';
import invitationService, { CanceledError } from '../../services/invitation-service';
import type { Invitation } from '../../services/invitation-service';

const Invitation: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = () => {
    if (invitation?.imageUrl) {
      const link = document.createElement('a');
      link.href = invitation.imageUrl;
      link.download = `wedding-invitation-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCreateInvitation = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your invitation');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const request = invitationService.createInvitation(prompt);
      const response = await request.request;
      
      if (response.data && response.data.data) {
        setInvitation(response.data.data);
      } else {
        setError('Invalid response format from server');
      }
    } catch (error) {
      if (error instanceof CanceledError) {
        console.log('Request was canceled');
        return;
      }
      
      console.error('Failed to create invitation:', error);
      
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
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FaImage className={styles.icon} /> Design Your Invitation
        </h2>
        
        <div className={styles.promptSection}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your dream wedding invitation... (e.g., 'A beautiful wedding invitation with elegant typography and floral elements')"
            className={styles.promptInput}
          />
          <button 
            onClick={handleCreateInvitation}
            disabled={isLoading}
            className={styles.createButton}
          >
            {isLoading ? (
              <>
                <FaSpinner className={styles.spinner} /> Creating...
              </>
            ) : (
              'Create Invitation'
            )}
          </button>
        </div>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        {invitation && (
          <div className={styles.result}>
            <div className={styles.resultHeader}>
              <h3>Your Invitation</h3>
              <button 
                onClick={handleDownload}
                className={styles.downloadButton}
              >
                <FaDownload /> Download
              </button>
            </div>
            <div className={styles.imageContainer}>
              <img 
                src={invitation.imageUrl} 
                alt="Generated wedding invitation" 
                className={styles.invitationImage}
              />
            </div>
          </div>
        )}

        <div className={styles.linksContainer}>
          <div className={styles.linkCategory}>
            <h3>Invitation Design Inspiration</h3>
            <ul className={styles.linkList}>
              <li>
                <a href="https://www.pinterest.com/search/pins/?q=wedding%20invitation%20design" target="_blank" rel="noopener noreferrer">
                  Pinterest Wedding Invitations <FaExternalLinkAlt />
                </a>
              </li>
              <li>
                <a href="https://www.minted.com/wedding-invitations" target="_blank" rel="noopener noreferrer">
                  Minted Wedding Invitations <FaExternalLinkAlt />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Invitation; 