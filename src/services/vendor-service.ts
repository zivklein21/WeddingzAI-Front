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

// GET /vendors
export const fetchAllVendors = async (): Promise<{ success: boolean; data?: Vendor[]; error?: string }> => {
  try {
    const resp = await apiClient.get<{ data: Vendor[]; message?: string }>("/vendors/all");
    return { success: true, data: Array.isArray(resp.data.data) ? resp.data.data : [] };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } }, message?: string };

    return {
      success: false,
      error: error.response?.data?.error || error.message || "Network error",
    };
  }
};

// GET /vendors/mine
export const fetchUseervendors = async (): Promise<{ success: boolean; data?: Vendor[]; error?: string }> => {
  try {
    const resp = await apiClient.get<{ data: Vendor[]; message?: string }>("/vendors/mine");
    return { success: true, data: Array.isArray(resp.data.data) ? resp.data.data : [] };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } }, message?: string };
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Network error",
    };
  }
};

// GET /vendors/:id
export const fetchVendorById = async (id: string): Promise<{ success: boolean; data?: Vendor; error?: string }> => {
  try {
    const resp = await apiClient.get<ApiResponse<Vendor>>(`/vendors/${id}`);
    if (!resp.data.data) {
      throw new Error("Vendor not found");
    }
    return { success: true, data: resp.data.data };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } }, message?: string };
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Network error",
    };
  }
};

// GET /vendors/type/:type
export const fetchVendorsByType = async (type: string): Promise<{ success: boolean; data?: Vendor[]; error?: string }> => {
  try {
    const resp = await apiClient.get<ApiResponse<Vendor[]>>(`/vendors/type/${type}`);
    return { success: true, data: resp.data.data || [] };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } }, message?: string };
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Network error",
    };
  }
};

// GET /vendors/search?query=X&type=Y
export const searchVendors = async (query?: string, type?: string): Promise<{ success: boolean; data?: Vendor[]; error?: string }> => {
  try {
    let url = "/vendors/search";
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (type) params.append("type", type);
    if (params.toString()) {
      url += "?" + params.toString();
    }

    const resp = await apiClient.get<ApiResponse<Vendor[]>>(url);
    return { success: true, data: resp.data.data || [] };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } }, message?: string };
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Network error",
    };
  }
};

// Start AI research in the background
export const startAIResearchBackground = async (query: string, userId: string): Promise<{ success: boolean; taskId?: string; error?: string, errorCode?: string}> => {
  try {
    const resp = await apiClient.post<{ success: boolean; taskId?: string; error?: string }>(
      "/vendors/research/background",
      { query, userId }
    );
    return resp.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } }, message?: string };
    if (error.response && error.response.data) {
        return {
          success: false,
          error: error.response.data.error || "Unexpected error",
        };
      } else {
      return {
        success: false,
        error: error.message || "Network error",
      };
    }
  }
};

// GET /vendors/relevant
export const fetchRelevantVendors = async (): Promise<{ success: boolean; data?: Vendor[]; error?: string }> => {
  try {
    const resp = await apiClient.get<ApiResponse<Vendor[]>>("/vendors/relevant");
    return { success: true, data: resp.data.data || [] };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } }, message?: string };
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Network error",
    };
  }
};

// GET /vendors/summary
export const fetchVendorSummary = async (): Promise<{ success: boolean; data?: VendorSummaryResponse; error?: string }> => {
  try {
    const resp = await apiClient.get<{ total: number; counts: Record<string, number> }>("/vendors/summary");
    return { success: true, data: resp.data };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } }, message?: string };
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Network error",
    };
  }
};

// PATCH /vendors/book
export const toggleBookedVendor = async (vendorId: string): Promise<{ success: boolean; data?: { added: boolean; message: string; vendorType?: string }; error?: string }> => {
  try {
    const resp = await apiClient.patch<{ added: boolean; message: string; vendorType?: string }>(
      "/vendors/book",
      { vendorId }
    );
    return { success: true, data: resp.data };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } }, message?: string };
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Network error",
    };
  }
};

// PATCH /vendors/cancel
export const cancelBookedVendor = async (vendorId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiClient.patch("/vendors/cancel", { vendorId });
    return { success: true };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } }, message?: string };
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Network error",
    };
  }
};

// GET /vendors/booked
export const fetchBookedVendors = async (): Promise<{ success: boolean; data?: Vendor[]; error?: string }> => {
  try {
    const resp = await apiClient.get<ApiResponse<Vendor[]>>("/vendors/booked");
    return { success: true, data: resp.data.data || [] };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } }, message?: string };
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Network error",
    };
  }
};

export default {
  fetchAllVendors,
  fetchVendorById,
  fetchVendorsByType,
  searchVendors,
  startAIResearchBackground,
  fetchRelevantVendors,
  fetchVendorSummary,
  toggleBookedVendor,
  cancelBookedVendor,
  fetchBookedVendors,
  fetchUseervendors,
};