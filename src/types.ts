export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  balance: number;
  investmentAmount: number;
  profitAmount: number;
  soundEffects: boolean;
  hapticFeedback: boolean;
  country?: string;
  currency?: string;
  investmentPlan?: string;
  password?: string;
  kycStatus?: "None" | "Pending" | "Approved" | "Rejected";
  kycRejectReason?: string;
  kycAnswers?: Record<string, string>;
  role?: "User" | "Support Admin" | "Compliance Admin" | "Finance Admin" | "System Owner";
  profileImageUrl?: string;
}

export interface TicketReply {
  id: string;
  sender: "user" | "admin";
  senderName: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: "Deposit" | "Withdrawal" | "KYC" | "Account Security" | "General Inquiry";
  message: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  createdAt: string;
  replies: TicketReply[];
}

export interface KycFormField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "file_placeholder";
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface AppThemeConfig {
  primaryColor: "blue" | "emerald" | "rose" | "violet" | "amber" | "slate";
  siteName: string;
  logoEmoji: string;
  fontFamily: "Inter" | "Space Grotesk" | "Outfit" | "Playfair Display" | "JetBrains Mono";
  signupBonus?: number;
  depositMessage?: string;
  depositButtonText?: string;
  chatDefaultMessage?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  roi: number;
  duration: string;
  minDeposit: number;
  description: string;
}

export type TransactionStatus =
  | "Pending"
  | "Processing"
  | "Approved"
  | "Declined"
  | "Verification Required";

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  date: string;
  status: TransactionStatus;
  statusReason?: string;
  companyNote?: string;
  referenceId: string;
  userEmail: string;
  userName: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "manager";
  content: string;
  timestamp: string;
}

export type AppView =
  | "landing"
  | "login"
  | "signup"
  | "user_dashboard"
  | "admin_dashboard"
  | "deposit"
  | "withdraw"
  | "profile";
