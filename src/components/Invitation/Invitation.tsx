import React, { useState } from 'react';
import styles from './Invitation.module.css';
import { FaDownload } from 'react-icons/fa';
import invitationService, { CanceledError } from '../../services/invitation-service';
import type { Invitation } from '../../services/invitation-service';
import { useNavigate } from 'react-router-dom';
import {FiArrowLeft, FiLoader} from 'react-icons/fi';
import { ImMagicWand } from "react-icons/im";
import { toast, ToastContainer } from 'react-toastify';

const Invitation: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDownload = () => {
    if (invitation?.imageUrl) {
      const link = document.createElement('a');
      link.href = invitation.imageUrl;
      link.download = `wedding-invitation-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      toast.success("Invitations Download...")
      document.body.removeChild(link);
    }
  };

  const handleCreateInvitation = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your invitation");
      return;
    }
    
    setIsLoading(true);
    try {
      const request = invitationService.createInvitation(prompt);
      const response = await request.request;
      
      if (response.data && response.data.data) {
        setInvitation(response.data.data);
        toast.success("Create your invintations...");
      } else {
        toast.error("Failed generate invintation");
      }
    } catch (error) {
      if (error instanceof CanceledError) {
        console.log('Request was canceled');
        return;
      }
      
      console.error('Failed to create invitation:', error);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <>
    <div className={styles.invitePage}>
      <div className={styles.inviteContainer}>
          <FiArrowLeft className={styles.backIcon} onClick={() => navigate(-1)} title="Go Back" />
          <h2 className={styles.inviteHeader}>Invintation</h2>
          <div className={styles.promptSection}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your dream wedding invitation... (e.g., 'A beautiful wedding invitation with elegant typography and floral elements')"
            className={styles.promptInput}
          />
          {isLoading
          ? <FiLoader className={styles.spinner} />
          : (
            <span
              role="button"
              tabIndex={0}
              onClick={handleCreateInvitation}
              className={styles.createIcon}
            >
              <ImMagicWand />
            </span>
          )
        }
          </div>
          <div>
            {invitation && (
              <div className={styles.result}>
                <div className={styles.resultHeader}>
                  <h3>Your Invitation</h3>
                  <button 
                    onClick={handleDownload}
                    className={styles.downloadButton}
                  >
                    <FaDownload />
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
          </div>
          <div className={styles.linksContainer}>
          <div className={styles.linkCategory}>
            <h3>Invitation Design Inspiration</h3>
            <ul className={styles.linkList}>
              <li>
                <a href="https://www.pinterest.com/search/pins/?q=wedding%20invitation%20design" target="_blank" rel="noopener noreferrer">
                  Pinterest Wedding Invitations
                </a>
              </li>
              <li>
                <a href="https://www.minted.com/wedding-invitations" target="_blank" rel="noopener noreferrer">
                  Minted Wedding Invitations 
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right"/>
    </div>
    </>
  );
};

export default Invitation; 