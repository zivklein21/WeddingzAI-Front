export interface BrideReview {
  reviewer: string;
  date:     string;
  comment:  string;
}

export interface Faq {
  question: string;
  answer:   string;
}

export interface Vendor {
  _id:              string;
  about?:           string;
  accessorise?:     string;
  area?:            string;
  buy_options?:     string;
  check_in?:        string;
  check_out?:       string;
  close_venues?:    string[];
  coverImage?:      string;
  details?:         string[];
  end_time?:        string;
  eventImages?:     string[];
  faqs?:            Faq[];
  genres?:          string;
  location_facilities?: string[];
  max_companions?:  string;
  max_guests?:      string;
  min_guests?:      string;
  max_vendors?:     string;
  name:             string;
  phone?:           string;
  price_include?:   string;
  price_range?:     string;
  profileImage:     string;
  reviews?:         BrideReview[];
  seasons?:         string;
  serv_location?:   string;
  shoot_type?:      string;
  size_range?:      string;
  socialMedia?: {
    facebook?:      string;
    instagram?:     string;
  };
  services?:        string;
  website?:         string;
  weekend?:         string;
  hour_limits?:     string;
  sourceUrl?:       string;
  vendorType:       string;
  vendor?: {
    _id: string;
    name: string;
    email: string;
  }
}