import apiClient, { CanceledError } from "./api-client";
export { CanceledError };

export interface Vendor {
  _id: string;
  name: string;
  vendorType: string;
  rating: number;
  coverImage: string;
  profileImage: string;
  about: string;
  price_range: string;
  services: string;
  area: string;
  attributes: Record<string, string>;
  galleryImages: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  reviews: Array<{
    reviewer: string;
    date: string;
    comment: string;
  }>;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  website: string;
  phone: string;
  sourceUrl: string;
  scrapedAt: string;
}

export interface AIResearchResult {
  vendorType: string;
  urlsFound: number;
  scrapedVendors: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  error?: string;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
  result?: any;
}

// 1. Send a task for AI research
export const runAIResearch = async (query: string): Promise<{ success: boolean; result: AIResearchResult }> => {
  try {
    const resp = await apiClient.post<{ success: boolean; result: AIResearchResult }>(
      "/vendors/ai-research",
      { query }
    );
    return resp.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to run AI research");
  }
};

// 2. GET /vendors
export const fetchAllVendors = async (): Promise<Vendor[]> => {
  try {
    const resp = await apiClient.get<ApiResponse<Vendor[]>>("/vendors");
    return resp.data.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch vendors");
  }
};

// 3. GET /vendors/:id
export const fetchVendorById = async (id: string): Promise<Vendor> => {
  try {
    const resp = await apiClient.get<ApiResponse<Vendor>>(`/vendors/${id}`);
    if (!resp.data.data) {
      throw new Error("Vendor not found");
    }
    return resp.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch vendor");
  }
};

// 4. GET /vendors/type/:type
export const fetchVendorsByType = async (type: string): Promise<Vendor[]> => {
  try {
    const resp = await apiClient.get<ApiResponse<Vendor[]>>(`/vendors/type/${type}`);
    return resp.data.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch vendors by type");
  }
};

// 5. GET /vendors/search?query=X&type=Y
export const searchVendors = async (query?: string, type?: string): Promise<Vendor[]> => {
  try {
    let url = "/vendors/search";
    const params = new URLSearchParams();
    
    if (query) params.append("query", query);
    if (type) params.append("type", type);
    
    if (params.toString()) {
      url += "?" + params.toString();
    }
    
    const resp = await apiClient.get<ApiResponse<Vendor[]>>(url);
    return resp.data.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to search vendors");
  }
};

// 6. DELETE /vendors/:id
export const deleteVendor = async (id: string): Promise<Vendor> => {
  try {
    const resp = await apiClient.delete<ApiResponse<Vendor>>(`/vendors/${id}`);
    if (!resp.data.data) {
      throw new Error("Failed to delete vendor");
    }
    return resp.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to delete vendor");
  }
};

// Start AI research in the background
export const startAIResearchBackground = async (query: string): Promise<{ success: boolean; taskId?: string; error?: string }> => {
  try {
    const resp = await apiClient.post<{ success: boolean; taskId: string; error?: string }>(
      "/vendors/research/background",
      { query }
    );
    return resp.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to start AI research");
  }
};

export default {
  runAIResearch,
  fetchAllVendors,
  fetchVendorById,
  fetchVendorsByType,
  searchVendors,
  deleteVendor,
  startAIResearchBackground
};
