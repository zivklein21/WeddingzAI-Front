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
  area?:            string;
  coverImage?:      string;
  details?:         string[];
  end_time?:        string;
  eventImages?:     string[];
  faqs?:            Faq[];
  genres?:          string;
  max_companions?:  string;
  max_guests?:      string;
  min_guests?:      string;
  name:             string;
  phone?:           string;
  price_include?:   string;
  price_range?:     string;
  profileImage:     string;
  reviews?:         BrideReview[];
  seasons?:         string;
  socialMedia?: {
    facebook?:      string;
    instagram?:     string;
  };
  services?:        string;
  website?:         string;
  hour_limits?:     string;
  sourceUrl?:       string;
  vendorType:      string;
}