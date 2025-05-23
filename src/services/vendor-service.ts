import apiClient, { CanceledError } from "./api-client";
export { CanceledError };
import { Vendor } from "../types/Vendor";

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
  result?: unknown;
}

export interface VendorSummaryResponse {
  total: number;
  counts: Record<string, number>;
}

// 1. Send a task for AI research
export const runAIResearch = async (query: string): Promise<{ success: boolean; result: AIResearchResult }> => {
    const resp = await apiClient.post<{ success: boolean; result: AIResearchResult }>(
      "/vendors/ai-research",
      { query }
    );
    return resp.data;
};

// 2. GET /vendors
export const fetchAllVendors = async (): Promise<Vendor[]> => {
    const resp = await apiClient.get<ApiResponse<Vendor[]>>("/vendors");
    return resp.data.data || [];
};

// 3. GET /vendors/:id
export const fetchVendorById = async (id: string): Promise<Vendor> => {
    const resp = await apiClient.get<ApiResponse<Vendor>>(`/vendors/${id}`);
    if (!resp.data.data) {
      throw new Error("Vendor not found");
    }
    return resp.data.data;
};

// 4. GET /vendors/type/:type
export const fetchVendorsByType = async (type: string): Promise<Vendor[]> => {
    const resp = await apiClient.get<ApiResponse<Vendor[]>>(`/vendors/type/${type}`);
    return resp.data.data || [];
};

// 5. GET /vendors/search?query=X&type=Y
export const searchVendors = async (query?: string, type?: string): Promise<Vendor[]> => {
    let url = "/vendors/search";
    const params = new URLSearchParams();
    
    if (query) params.append("query", query);
    if (type) params.append("type", type);
    
    if (params.toString()) {
      url += "?" + params.toString();
    }
    
    const resp = await apiClient.get<ApiResponse<Vendor[]>>(url);
    return resp.data.data || [];
};

// 6. DELETE /vendors/:id
export const deleteVendor = async (id: string): Promise<Vendor> => {
    const resp = await apiClient.delete<ApiResponse<Vendor>>(`/vendors/${id}`);
    if (!resp.data.data) {
      throw new Error("Failed to delete vendor");
    }
    return resp.data.data;
};

// 7. Start AI research in the background
export const startAIResearchBackground = async (query: string, userId: string): Promise<{ success: boolean; taskId?: string; error?: string }> => {
    const resp = await apiClient.post<{ success: boolean; taskId: string; error?: string }>(
      "/vendors/research/background",
      { query , userId}
    );
    return resp.data;
};

// 8. GET /vendors/mine - fetch AI-filtered vendors based on TDL
export const fetchRelevantVendors = async (): Promise<Vendor[]> => {
    const resp = await apiClient.get<ApiResponse<Vendor[]>>("/vendors/mine");
    return resp.data.data || [];
};

// 9. GET /vendors/summary - get user vendor summay
export const fetchVendorSummary= async(): Promise<VendorSummaryResponse> => {
  const resp = await apiClient.get<{ total: number; counts: Record<string, number> }>("/vendors/summary");
  return resp.data;
}


export default {
  runAIResearch,
  fetchAllVendors,
  fetchVendorById,
  fetchVendorsByType,
  searchVendors,
  deleteVendor,
  startAIResearchBackground,
  fetchRelevantVendors,
  fetchVendorSummary
};
