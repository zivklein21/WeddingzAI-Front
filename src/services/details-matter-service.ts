// details-matter-service.ts
import apiClient, { CanceledError } from './api-client';

export { CanceledError };

export interface SongSuggestion {
  title: string;
  artist: string;
  description: string;
  link: string;
}

const getSongSuggestions = (prompt: string) => {
  const controller = new AbortController();
  
  const request = apiClient.post<SongSuggestion[]>(
    '/details-matter/suggest',
    { prompt },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    request,
    abort: () => controller.abort()
  };
};

const detailsMatterService = {
  getSongSuggestions
};

export default detailsMatterService;