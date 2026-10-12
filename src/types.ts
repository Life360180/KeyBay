export type CategoryType = 'all' | 'ai-llm' | 'scraping-proxies' | 'cloud-compute' | 'media-audio' | 'dev-tools';

export interface ProductListing {
  id: string;
  title: string;
  category: CategoryType;
  categoryLabel: string;
  seller: {
    username: string;
    rating: number;
    completedSales: number;
    isVerified: boolean;
  };
  originalPrice: number;
  askingPrice: number;
  discountPercent: number;
  quotaOrDuration: string;
  keyType: 'Direct Secret Key' | 'Reverse Proxy Endpoint' | 'License Token' | 'Sub-Account Credential';
  description: string;
  verificationStatus: 'Tested & Active' | 'Escrow Guaranteed';
  lastPingTime: string;
  rateLimit: string;
  keyValue: string;
  curlSnippet: string;
  isSold: boolean;
  views: number;
  createdAt: string;
}

export interface MembershipPlan {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  targetAudience: string;
  priceMonthly: number;
  buyerFeePercent: number;
  sellerFeePercent: number;
  features: string[];
  recommended?: boolean;
}

export interface TransactionRecord {
  id: string;
  itemTitle: string;
  category: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  savings: number;
  timestamp: string;
  status: 'Completed' | 'Escrow Secured';
}

export interface UserState {
  username: string;
  email: string;
  balance: number;
  membership: 'starter' | 'pro' | 'enterprise';
  membershipBillingDate: string;
  purchasedKeys: {
    purchaseId: string;
    product: ProductListing;
    purchasedAt: string;
    transactionHash: string;
  }[];
  userListings: ProductListing[];
}
