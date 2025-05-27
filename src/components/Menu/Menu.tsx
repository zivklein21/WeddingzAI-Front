import React, { useState } from 'react';
import styles from './Menu.module.css';
import { FaImage, FaSpinner, FaExternalLinkAlt, FaDownload, FaPlus, FaTrash } from 'react-icons/fa';
import menuService, { CanceledError } from '../../services/menu-service';
import type { Menu, Dish } from '../../services/menu-service';

const Menu: React.FC = () => {
  const [coupleNames, setCoupleNames] = useState('');
  const [designPrompt, setDesignPrompt] = useState('');
  const [dishes, setDishes] = useState<Dish[]>([
    { name: '', description: '' }
  ]);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddDish = () => {
    setDishes([...dishes, { name: '', description: '' }]);
  };

  const handleRemoveDish = (index: number) => {
    setDishes(dishes.filter((_, i) => i !== index));
  };

  const handleDishChange = (index: number, field: keyof Dish, value: string) => {
    const newDishes = [...dishes];
    newDishes[index] = { ...newDishes[index], [field]: value };
    setDishes(newDishes);
  };

  const handleDownload = () => {
    if (menu?.imageUrl) {
      const link = document.createElement('a');
      link.href = menu.imageUrl;
      link.download = `wedding-menu-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCreateMenu = async () => {
    if (!coupleNames.trim()) {
      setError('Please enter the couple names');
      return;
    }
    if (!designPrompt.trim()) {
      setError('Please enter a design prompt');
      return;
    }
    if (dishes.some(dish => !dish.name.trim() || !dish.description.trim())) {
      setError('Please fill in all dish details');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const request = menuService.createMenu(coupleNames, designPrompt, dishes);
      const response = await request.request;
      
      if (response.data && response.data.data) {
        setMenu(response.data.data);
      } else {
        setError('Invalid response format from server');
      }
    } catch (error) {
      if (error instanceof CanceledError) {
        console.log('Request was canceled');
        return;
      }
      
      console.error('Failed to create menu:', error);
      
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
          <FaImage className={styles.icon} /> Design Your Wedding Menu
        </h2>
        
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="coupleNames">Couple Names</label>
            <input
              id="coupleNames"
              type="text"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
              placeholder="e.g., John & Jane"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="designPrompt">Design Style</label>
            <textarea
              id="designPrompt"
              value={designPrompt}
              onChange={(e) => setDesignPrompt(e.target.value)}
              placeholder="Describe your menu design style... (e.g., 'Elegant menu with gold accents and floral elements')"
              className={styles.textarea}
            />
          </div>

          <div className={styles.dishesSection}>
            <h3>Menu Items</h3>
            {dishes.map((dish, index) => (
              <div key={index} className={styles.dishItem}>
                <div className={styles.dishInputs}>
                  <input
                    type="text"
                    value={dish.name}
                    onChange={(e) => handleDishChange(index, 'name', e.target.value)}
                    placeholder="Dish name (e.g., Appetizer)"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={dish.description}
                    onChange={(e) => handleDishChange(index, 'description', e.target.value)}
                    placeholder="Dish description"
                    className={styles.input}
                  />
                </div>
                {dishes.length > 1 && (
                  <button
                    onClick={() => handleRemoveDish(index)}
                    className={styles.removeButton}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddDish}
              className={styles.addButton}
            >
              <FaPlus /> Add Another Dish
            </button>
          </div>

          <button 
            onClick={handleCreateMenu}
            disabled={isLoading}
            className={styles.createButton}
          >
            {isLoading ? (
              <>
                <FaSpinner className={styles.spinner} /> Creating...
              </>
            ) : (
              'Create Menu'
            )}
          </button>
        </div>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        {menu && (
          <div className={styles.result}>
            <div className={styles.resultHeader}>
              <h3>Your Menu</h3>
              <button 
                onClick={handleDownload}
                className={styles.downloadButton}
              >
                <FaDownload /> Download
              </button>
            </div>
            <div className={styles.imageContainer}>
              <img 
                src={menu.imageUrl} 
                alt="Generated wedding menu" 
                className={styles.menuImage}
              />
            </div>
          </div>
        )}

        <div className={styles.linksContainer}>
          <div className={styles.linkCategory}>
            <h3>Menu Design Inspiration</h3>
            <ul className={styles.linkList}>
              <li>
                <a href="https://www.pinterest.com/search/pins/?q=wedding%20menu%20design" target="_blank" rel="noopener noreferrer">
                  Pinterest Wedding Menus <FaExternalLinkAlt />
                </a>
              </li>
              <li>
                <a href="https://www.minted.com/wedding/menus" target="_blank" rel="noopener noreferrer">
                  Minted Wedding Menus <FaExternalLinkAlt />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu; 