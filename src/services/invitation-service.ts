import apiClient from "./api-client";

export type Sentence = {
  title: string;
};

export interface Invitation {
  userId: string;
  coupleNames: string;
  designPrompt: string;
  backgroundUrl: string;
  ceremonyHour?: string;
  receptionHour?: string;
  sentences?: Sentence[];
  date: string;
  venue: string;
  finalPng?: string;
  finalPdf?: string;
}

interface CreateInvitationPayload {
  userId: string;
  coupleNames: string;
  designPrompt: string;
  backgroundUrl: string; 
  date: string;
  venue: string;
}

const invitationService = {
  // 1. Generate invitation background image with AI (returns {backgroundUrl})
  generateBackground: (prompt: string) =>
    apiClient.post<{ backgroundUrl: string }>("/invitation/background", { prompt }),

  // 2. Create Invitation with background
  createInvitationWithBackground: (payload: CreateInvitationPayload) => {
    return apiClient.post<Invitation>("/invitation/create-invitation", payload);
  },

  getInvitationByUserId: (userId: string) => {
    return apiClient.get<Invitation>(`/invitation/${userId}`);
  },

  updateTextsByUserId: (userId: string, sentences: Sentence[]) => {
    return apiClient.put<Invitation>(`/invitation/${userId}/sentences`, { sentences });
  },

  updateHoursByUserId: (userId: string, ceremonyHour: string, receptionHour: string) => {
    return apiClient.put<Invitation>(`/invitation/${userId}/hours`, { ceremonyHour, receptionHour });
  },

  updateFinals: (userId: string, finals: {finalPng: string, finalCanvasJson: string}) => {
    console.log(userId);
    return apiClient.put<Invitation>(`/invitation/${userId}/finals`, {finals});
  }
};

export default invitationService;