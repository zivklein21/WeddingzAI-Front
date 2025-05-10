// src/services/vendor-service.ts
import apiClient from "./api-client";

export interface Vendor {
  id: string;
  category: string;
  name: string;
  address: string;
  rating: number;
  price_range: string;
  menu_type: string;
  reviews: string;
  website: string;
  contact: string;
  coverImage: string;
  logoUrl: string;
  imageUrls: string[];
  description: string;
  locationLink: string;
  social: { instagram?: string; facebook?: string; [key: string]: string | undefined };
}

interface FetchVendorsResponse {
  vendorList: Vendor[];
}

const fetchVendors = async (
  vendor_type: string,
  wed_city: string,
  wed_date: string
): Promise<FetchVendorsResponse> => {
  const response = await apiClient.post<FetchVendorsResponse>(
    "/vendors",
    { vendor_type, wed_city, wed_date },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export default { fetchVendors };