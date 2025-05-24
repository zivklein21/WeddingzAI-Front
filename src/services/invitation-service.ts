import apiClient, { CanceledError } from './api-client';

export { CanceledError };

export interface Invitation {
  _id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationResponse {
  message: string;
  data: Invitation;
}

const createInvitation = (prompt: string) => {
  const controller = new AbortController();
  
  const request = apiClient.post<InvitationResponse>(
    '/invitation/create',
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

const invitationService = {
  createInvitation
};

export default invitationService; 