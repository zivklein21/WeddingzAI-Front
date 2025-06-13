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
  generateBackground: async (prompt: string) => {
    try {
      const res = await apiClient.post<{ backgroundUrl: string }>("/invitation/background", { prompt });
      return res;
    } catch (error) {
      console.error("[invitationService.generateBackground] Error:", error);
      throw error;
    }
  },

  // 2. Create Invitation with background
  createInvitationWithBackground: async (payload: CreateInvitationPayload) => {
    try {
      const res = await apiClient.post<Invitation>("/invitation/create-invitation", payload);
      return res;
    } catch (error) {
      console.error("[invitationService.createInvitationWithBackground] Error:", error);
      throw error;
    }
  },

  getInvitationByUserId: async (userId: string) => {
    try {
      const res = await apiClient.get<Invitation>(`/invitation/${userId}`);
      return res;
    } catch (error) {
      console.error("[invitationService.getInvitationByUserId] Error:", error);
      throw error;
    }
  },

  updateTextsByUserId: async (userId: string, sentences: Sentence[]) => {
    try {
      const res = await apiClient.put<Invitation>(`/invitation/${userId}/sentences`, { sentences });
      return res;
    } catch (error) {
      console.error("[invitationService.updateTextsByUserId] Error:", error);
      throw error;
    }
  },

  updateHoursByUserId: async (userId: string, ceremonyHour: string, receptionHour: string) => {
    try {
      const res = await apiClient.put<Invitation>(`/invitation/${userId}/hours`, { ceremonyHour, receptionHour });
      return res;
    } catch (error) {
      console.error("[invitationService.updateHoursByUserId] Error:", error);
      throw error;
    }
  },

  updateFinals: async (userId: string, finals: {finalPng: string; finalCanvasJson: string}) => {
    try {
      const res = await apiClient.put<Invitation>(`/invitation/${userId}/finals`, { finals });
      return res;
    } catch (error) {
      console.error("[invitationService.updateFinals] Error:", error);
      throw error;
    }
  }
};

export default invitationService;