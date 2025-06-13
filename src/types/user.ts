export interface BookedVendor {
  vendorId: string;
  vendorType: string;
}

export interface User {
  _id: string;
  firstPartner: string;
  secondPartner: string;
  email: string;
  avatar: string;
  myVendors?: string[];
  weddingDate: string;
  weddingVenue: string;
  bookedVendors?: BookedVendor[];
}