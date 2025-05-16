import apiClient from './api-client';

export interface SongSuggestion {
  title: string;
  artist: string;
  description: string;
  link?: string;
}

// Get song suggestions based on user prompt
const getSongSuggestions = async (prompt: string) => {
  const response = await apiClient.post<SongSuggestion[]>('/api/songs/suggest', { prompt });
  return response.data;
};

// Get wedding recommendations (static data)
const getWeddingRecommendations = () => {
  return {
    guestFavors: [
      {
        title: 'Personalized Wedding Favors',
        link: 'https://www.aliexpress.com/...',
        description: 'Elegant personalized gifts for your guests'
      },
      {
        title: 'Elegant Guest Gifts',
        link: 'https://www.aliexpress.com/...',
        description: 'Beautiful keepsakes for your wedding guests'
      }
    ],
    decorations: [
      {
        title: 'Wedding Arch Decorations',
        link: 'https://www.aliexpress.com/...',
        description: 'Stunning arch decorations for your ceremony'
      },
      {
        title: 'Table Centerpieces',
        link: 'https://www.aliexpress.com/...',
        description: 'Elegant centerpieces for your reception tables'
      }
    ],
    planningTips: [
      'Create a detailed timeline for the wedding day',
      'Prepare a backup plan for outdoor ceremonies',
      'Have a designated person for vendor coordination',
      'Create a wedding day emergency kit'
    ]
  };
};

export default {
  getSongSuggestions,
  getWeddingRecommendations
}; 