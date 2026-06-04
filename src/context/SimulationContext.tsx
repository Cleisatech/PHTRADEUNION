import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, Transaction, AppView, TransactionStatus, InvestmentPlan, KycFormField, AppThemeConfig, SupportTicket, TicketReply } from "../types";
import { INITIAL_TRANSACTIONS } from "../data/mockData";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  getDocFromServer 
} from "firebase/firestore";

export const getThemeStyles = (color: string) => {
  switch (color) {
    case "emerald":
      return {
        primaryBg: "bg-emerald-600",
        primaryHover: "hover:bg-emerald-500",
        primaryText: "text-emerald-600",
        primaryBorder: "border-emerald-600",
        primaryBgLight: "bg-emerald-50",
        primaryTextLight: "text-emerald-700",
        primaryGradient: "from-emerald-600 to-emerald-600",
        shadowPrimary: "shadow-emerald-600/20",
        primaryFocusRing: "focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1",
        accentBadge: "bg-emerald-100 text-emerald-700",
        accentLabel: "text-emerald-800",
        fillColor: "#059669",
        bgBanner: "bg-emerald-950",
        mainCardGradient: "from-emerald-600 to-emerald-600",
        shadowCard: "shadow-emerald-600/10",
        btnWhiteText: "text-emerald-700",
        btnWhiteHover: "hover:bg-emerald-50",
      };
    case "rose":
      return {
        primaryBg: "bg-rose-600",
        primaryHover: "hover:bg-rose-500",
        primaryText: "text-rose-600",
        primaryBorder: "border-rose-600",
        primaryBgLight: "bg-rose-50",
        primaryTextLight: "text-rose-700",
        primaryGradient: "from-rose-600 to-rose-600",
        shadowPrimary: "shadow-rose-600/20",
        primaryFocusRing: "focus:border-rose-500 focus:ring-rose-500 focus:ring-1",
        accentBadge: "bg-rose-100 text-rose-700",
        accentLabel: "text-rose-800",
        fillColor: "#e11d48",
        bgBanner: "bg-rose-950",
        mainCardGradient: "from-rose-600 to-rose-600",
        shadowCard: "shadow-rose-600/10",
        btnWhiteText: "text-rose-700",
        btnWhiteHover: "hover:bg-rose-50",
      };
    case "violet":
      return {
        primaryBg: "bg-violet-600",
        primaryHover: "hover:bg-violet-500",
        primaryText: "text-violet-600",
        primaryBorder: "border-violet-600",
        primaryBgLight: "bg-violet-50",
        primaryTextLight: "text-violet-700",
        primaryGradient: "from-violet-600 to-violet-600",
        shadowPrimary: "shadow-violet-600/20",
        primaryFocusRing: "focus:border-violet-500 focus:ring-violet-500 focus:ring-1",
        accentBadge: "bg-violet-100 text-violet-700",
        accentLabel: "text-violet-800",
        fillColor: "#7c3aed",
        bgBanner: "bg-violet-950",
        mainCardGradient: "from-violet-600 to-violet-600",
        shadowCard: "shadow-violet-600/10",
        btnWhiteText: "text-violet-705",
        btnWhiteHover: "hover:bg-violet-50",
      };
    case "amber":
      return {
        primaryBg: "bg-amber-600",
        primaryHover: "hover:bg-amber-500",
        primaryText: "text-amber-600",
        primaryBorder: "border-amber-600",
        primaryBgLight: "bg-amber-50",
        primaryTextLight: "text-amber-850",
        primaryGradient: "from-amber-600 to-amber-600",
        shadowPrimary: "shadow-amber-600/20",
        primaryFocusRing: "focus:border-amber-500 focus:ring-amber-500 focus:ring-1",
        accentBadge: "bg-amber-100 text-amber-700",
        accentLabel: "text-amber-800",
        fillColor: "#d97706",
        bgBanner: "bg-amber-950",
        mainCardGradient: "from-amber-600 to-amber-600",
        shadowCard: "shadow-amber-600/10",
        btnWhiteText: "text-amber-850",
        btnWhiteHover: "hover:bg-amber-50",
      };
    case "slate":
      return {
        primaryBg: "bg-slate-705",
        primaryHover: "hover:bg-slate-600",
        primaryText: "text-slate-700",
        primaryBorder: "border-slate-700",
        primaryBgLight: "bg-slate-100",
        primaryTextLight: "text-slate-800",
        primaryGradient: "from-slate-700 to-slate-700",
        shadowPrimary: "shadow-slate-700/20",
        primaryFocusRing: "focus:border-slate-500 focus:ring-slate-500 focus:ring-1",
        accentBadge: "bg-slate-200 text-slate-850",
        accentLabel: "text-slate-850",
        fillColor: "#475569",
        bgBanner: "bg-slate-950",
        mainCardGradient: "from-slate-705 to-slate-705",
        shadowCard: "shadow-slate-700/10",
        btnWhiteText: "text-slate-800",
        btnWhiteHover: "hover:bg-slate-50",
      };
    default: // blue
      return {
        primaryBg: "bg-blue-600",
        primaryHover: "hover:bg-blue-500",
        primaryText: "text-blue-600",
        primaryBorder: "border-blue-600",
        primaryBgLight: "bg-blue-50",
        primaryTextLight: "text-blue-700",
        primaryGradient: "from-blue-600 to-blue-600",
        shadowPrimary: "shadow-blue-600/20",
        primaryFocusRing: "focus:border-blue-500 focus:ring-blue-500 focus:ring-1",
        accentBadge: "bg-blue-100 text-blue-700",
        accentLabel: "text-blue-800",
        fillColor: "#2563eb",
        bgBanner: "bg-[#0f172a]",
        mainCardGradient: "from-blue-600 to-blue-600",
        shadowCard: "shadow-blue-600/10",
        btnWhiteText: "text-blue-700",
        btnWhiteHover: "hover:bg-blue-50",
      };
  }
};

interface SimulationContextType {
  profile: UserProfile;
  users: UserProfile[];
  currentView: AppView;
  adminActiveId: string | null;
  isLoggedIn: boolean;
  isLocalMode: boolean;
  investmentPlans: InvestmentPlan[];
  transactions: Transaction[];
  kycFields: KycFormField[];
  themeConfig: AppThemeConfig;
  tickets: SupportTicket[];
  setView: (view: AppView) => void;
  setAdminActiveId: (id: string | null) => void;
  submitWithdrawal: (amount: number, bankName: string, accountName: string, accountNumber: string) => Promise<boolean>;
  updateTransaction: (id: string, status: TransactionStatus, statusReason?: string, companyNote?: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  signup: (profileData: Partial<UserProfile>) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  addInvestmentPlan: (plan: InvestmentPlan) => void;
  updateInvestmentPlan: (id: string, plan: Partial<InvestmentPlan>) => void;
  deleteInvestmentPlan: (id: string) => void;
  submitKycVerification: (answers: Record<string, string>) => Promise<void>;
  updateUserKycStatus: (email: string, status: "Approved" | "Rejected", reason?: string) => Promise<void>;
  updateKycFields: (fields: KycFormField[]) => void;
  creditDebitUser: (email: string, type: "credit" | "debit", category: "balance" | "investmentAmount" | "profitAmount", amount: number, memo?: string) => Promise<void>;
  updateThemeConfig: (config: Partial<AppThemeConfig>) => void;
  getThemeStyles: (color: string) => any;
  addTicketReply: (ticketId: string, replyMessage: string, sender: "user" | "admin", senderName?: string) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: SupportTicket["status"]) => Promise<void>;
  deleteTicket: (ticketId: string) => Promise<void>;
  updateUserRole: (email: string, role: UserProfile["role"]) => Promise<void>;
  createSupportTicket: (subject: string, category: SupportTicket["category"], message: string, priority: SupportTicket["priority"]) => Promise<void>;
  deleteUser: (email: string) => Promise<void>;
  deleteTransaction: (txId: string) => Promise<void>;
  deleteKyc: (email: string) => Promise<void>;
}

const DEFAULT_USERS: UserProfile[] = [
  {
    name: "CLEISA",
    email: "admin@phtradeunion.com",
    phone: "+63 (2) 8888-1234",
    bankName: "GCash",
    accountName: "CLEISA",
    accountNumber: "09171234567",
    balance: 145000.00,
    investmentAmount: 50000.05,
    profitAmount: 18230.12,
    soundEffects: true,
    hapticFeedback: true,
    country: "Philippines",
    currency: "PHP (₱)",
    investmentPlan: "Silver Starter Plan",
    password: "password123",
    kycStatus: "Approved",
    kycAnswers: {},
    role: "System Owner"
  },
  {
    name: "MARUEL DULNUAN",
    email: "maruel.dul@gmail.com",
    phone: "+63 956 452 9983",
    bankName: "GCash",
    accountName: "MARUEL DULNUAN",
    accountNumber: "09564529983",
    balance: 58700.00,
    investmentAmount: 10000.00,
    profitAmount: 2300.00,
    soundEffects: true,
    hapticFeedback: true,
    country: "Philippines",
    currency: "PHP (₱)",
    investmentPlan: "Silver Starter Plan",
    password: "password123",
    kycStatus: "Pending",
    kycAnswers: {
      id_type: "Driver's License",
      id_number: "N01-12-984210",
      selfie: "[Placeholder: Selfie verified successfully]"
    },
    role: "Finance Admin"
  },
  {
    name: "Elgua Hilar",
    email: "elgua.h@gmail.com",
    phone: "+63 911 019 2800",
    bankName: "GCash",
    accountName: "Elgua Hilar",
    accountNumber: "09110192805",
    balance: 500000.00,
    investmentAmount: 150000.00,
    profitAmount: 38200.00,
    soundEffects: true,
    hapticFeedback: true,
    country: "Philippines",
    currency: "PHP (₱)",
    investmentPlan: "Gold Premium Plan",
    password: "password123",
    role: "User"
  }
];

const DEFAULT_TICKETS: SupportTicket[] = [
  {
    id: "TCK-48102",
    userEmail: "maruel.dul@gmail.com",
    userName: "MARUEL DULNUAN",
    subject: "GCash deposit not credited yet",
    category: "Deposit",
    message: "I sent ₱10,000 via GCash around 30 minutes ago, but it hasn't reflected in my account balance. Please check the reference ID GC-994382.",
    status: "Open",
    priority: "High",
    createdAt: "2026-05-23 09:12:00",
    replies: []
  },
  {
    id: "TCK-10943",
    userEmail: "elgua.h@gmail.com",
    userName: "Elgua Hilar",
    subject: "KYC Requirements for verification",
    category: "KYC",
    message: "What government IDs do you accept for verification? I do not have a driving license, can I upload my Postal ID?",
    status: "In Progress",
    priority: "Medium",
    createdAt: "2026-05-23 08:30:00",
    replies: [
      {
        id: "rep-1",
        sender: "admin",
        senderName: "CLEISA (System Owner)",
        message: "Hi Elgua! Yes, Postal ID is highly acceptable. You can select other / Postal ID and upload a high-resolution scan of it, along with a face photo.",
        createdAt: "2026-05-23 08:45:00"
      }
    ]
  },
  {
    id: "TCK-32111",
    userEmail: "admin@phtradeunion.com",
    userName: "CLEISA",
    subject: "Withdrawal processing timeline inquiry",
    category: "Withdrawal",
    message: "Are withdrawals processed on weekends? Standard time frame says 2-12 hours but is that active on Sunday?",
    status: "Resolved",
    priority: "Low",
    createdAt: "2026-05-22 17:00:00",
    replies: [
      {
        id: "rep-2",
        sender: "admin",
        senderName: "Support Desk",
        message: "Hello Cleisa, yes, our VIP settlements run 24H even on weekends for our Gold and VIP starter clients.",
        createdAt: "2026-05-22 17:15:00"
      },
      {
        id: "rep-3",
        sender: "user",
        senderName: "CLEISA",
        message: "Perfect! Thanks for the prompt reply. Highly appreciated.",
        createdAt: "2026-05-22 17:30:05"
      }
    ]
  }
];

const DEFAULT_PLANS: InvestmentPlan[] = [
  {
    id: "plan-silver",
    name: "Silver Starter Plan",
    roi: 10,
    duration: "30 Days",
    minDeposit: 1000,
    description: "Perfect for testing our live Philippine trading desk with minimal capital commitment."
  },
  {
    id: "plan-gold",
    name: "Gold Premium Plan",
    roi: 18,
    duration: "60 Days",
    minDeposit: 5000,
    description: "Supervised high-alpha allocation in digital assets and foreign exchange."
  },
  {
    id: "plan-vip",
    name: "VIP Platinum Plan",
    roi: 25,
    duration: "90 Days",
    minDeposit: 25000,
    description: "Bespoke tier with 24H priority settlements and direct account representative channels."
  }
];

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global connection validation on boot
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
      } catch (error) {
        if (error instanceof Error && error.message.includes("the client is offline")) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  const [activeUserEmail, setActiveUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USERS[0]);
  const [users, setUsers] = useState<UserProfile[]>(DEFAULT_USERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [tickets, setTickets] = useState<SupportTicket[]>(DEFAULT_TICKETS);

  const [isLocalMode, setIsLocalMode] = useState<boolean>(() => {
    return localStorage.getItem("ph_trade_local_mode") === "true";
  });

  const saveLocalUsers = (uList: UserProfile[]) => {
    localStorage.setItem("ph_trade_local_users", JSON.stringify(uList));
    setUsers(uList);
    if (activeUserEmail) {
      const updatedProfile = uList.find(u => u.email.toLowerCase() === activeUserEmail.toLowerCase());
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    }
  };

  const saveLocalTransactions = (txList: Transaction[]) => {
    localStorage.setItem("ph_trade_local_transactions", JSON.stringify(txList));
    if (activeUserEmail) {
      const currentRole = profile.role || "User";
      const isAdminRole = ["System Owner", "Finance Admin", "Compliance Admin", "Support Admin"].includes(currentRole);
      if (isAdminRole) {
        setTransactions(txList);
      } else {
        setTransactions(txList.filter(tx => tx.userEmail.toLowerCase() === activeUserEmail.toLowerCase()));
      }
    } else {
      setTransactions([]);
    }
  };

  const saveLocalTickets = (tList: SupportTicket[]) => {
    localStorage.setItem("ph_trade_local_tickets", JSON.stringify(tList));
    if (activeUserEmail) {
      const currentRole = profile.role || "User";
      const isAdminRole = ["System Owner", "Finance Admin", "Compliance Admin", "Support Admin"].includes(currentRole);
      if (isAdminRole) {
        setTickets(tList);
      } else {
        setTickets(tList.filter(tk => tk.userEmail.toLowerCase() === activeUserEmail.toLowerCase()));
      }
    } else {
      setTickets([]);
    }
  };

  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>(() => {
    const stored = localStorage.getItem("ph_trade_investment_plans_new");
    return stored ? JSON.parse(stored) : DEFAULT_PLANS;
  });

  const DEFAULT_KYC_FIELDS: KycFormField[] = [
    { id: "id_type", label: "Government ID Type", type: "select", required: true, placeholder: "Select your ID Card Category", options: ["Unified Multi-Purpose ID (UMID)", "Driver's License", "Philippine Passport", "SSS ID", "TIN ID", "Postal ID", "National ID (PhilSys)"] },
    { id: "id_number", label: "ID Card Number", type: "text", required: true, placeholder: "e.g. CRN-1234-56789-0" },
    { id: "selfie", label: "Selfie holding ID Card", type: "file_placeholder", required: true, placeholder: "Provide a close selfie clear view of your face and ID" }
  ];

  const DEFAULT_THEME: AppThemeConfig = {
    primaryColor: "blue",
    siteName: "PH TRADE UNION",
    logoEmoji: "📈",
    fontFamily: "Inter",
  };

  const [kycFields, setKycFields] = useState<KycFormField[]>(() => {
    const stored = localStorage.getItem("ph_trade_kyc_fields");
    return stored ? JSON.parse(stored) : DEFAULT_KYC_FIELDS;
  });

  const [themeConfig, setThemeConfig] = useState<AppThemeConfig>(() => {
    const stored = localStorage.getItem("ph_trade_theme_config");
    return stored ? JSON.parse(stored) : DEFAULT_THEME;
  });

  const [currentView, setView] = useState<AppView>("landing");
  const [adminActiveId, setAdminActiveId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("ph_trade_kyc_fields", JSON.stringify(kycFields));
  }, [kycFields]);

  useEffect(() => {
    localStorage.setItem("ph_trade_theme_config", JSON.stringify(themeConfig));
  }, [themeConfig]);

  useEffect(() => {
    localStorage.setItem("ph_trade_investment_plans_new", JSON.stringify(investmentPlans));
  }, [investmentPlans]);

  // Local mode data loader and synchronizer
  useEffect(() => {
    if (isLocalMode) {
      const localUsersStr = localStorage.getItem("ph_trade_local_users");
      const uList = localUsersStr ? JSON.parse(localUsersStr) : DEFAULT_USERS;
      setUsers(uList);

      const localTxStr = localStorage.getItem("ph_trade_local_transactions");
      const txList = localTxStr ? JSON.parse(localTxStr) : INITIAL_TRANSACTIONS;

      const localTicketStr = localStorage.getItem("ph_trade_local_tickets");
      const ticketList = localTicketStr ? JSON.parse(localTicketStr) : DEFAULT_TICKETS;

      if (activeUserEmail) {
        const matchingProfile = uList.find((u: any) => u.email.trim().toLowerCase() === activeUserEmail.trim().toLowerCase());
        if (matchingProfile) {
          setProfile(matchingProfile);
        }
        
        const currentRole = matchingProfile?.role || "User";
        const isAdminRole = ["System Owner", "Finance Admin", "Compliance Admin", "Support Admin"].includes(currentRole);
        
        if (isAdminRole) {
          setTransactions(txList);
          setTickets(ticketList);
        } else {
          setTransactions(txList.filter((tx: any) => tx.userEmail.toLowerCase() === activeUserEmail.toLowerCase()));
          setTickets(ticketList.filter((tk: any) => tk.userEmail.toLowerCase() === activeUserEmail.toLowerCase()));
        }
      } else {
        setTransactions([]);
        setTickets([]);
      }
    }
  }, [isLocalMode, activeUserEmail, profile.role]);

  // Firebase auth state change listener
  useEffect(() => {
    if (isLocalMode) {
      const savedEmail = localStorage.getItem("ph_trade_local_active_email");
      if (savedEmail) {
        setActiveUserEmail(savedEmail);
        const localUsersStr = localStorage.getItem("ph_trade_local_users");
        const uList = localUsersStr ? JSON.parse(localUsersStr) : DEFAULT_USERS;
        const currentLocal = uList.find((u: any) => u.email.trim().toLowerCase() === savedEmail.toLowerCase());
        if (currentLocal) {
          setProfile(currentLocal);
        }
      } else {
        setActiveUserEmail(null);
        setProfile(DEFAULT_USERS[0]);
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setActiveUserEmail(user.email);
        
        // Listen to active user profile document in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Document doesn't exist yet, try to populate
            const matchingDefault = DEFAULT_USERS.find(
              (u) => u.email.trim().toLowerCase() === user.email?.trim().toLowerCase()
            );
            const initialProfile: UserProfile = matchingDefault || {
              name: user.displayName || user.email?.split("@")[0].toUpperCase() || "NEW USER",
              email: user.email || "",
              phone: "",
              bankName: "GCash",
              accountName: user.displayName || "NEW USER",
              accountNumber: "09170000000",
              balance: 0.00,
              investmentAmount: 0.00,
              profitAmount: 0.00,
              soundEffects: true,
              hapticFeedback: true,
              country: "Philippines",
              currency: "PHP (₱)",
              role: "User",
              kycStatus: "None"
            };
            try {
              await setDoc(userDocRef, initialProfile);
              setProfile(initialProfile);
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
            }
          }
        });

        return () => {
          unsubscribeProfile();
        };
      } else {
        setActiveUserEmail(null);
        setProfile(DEFAULT_USERS[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Global settings listener (does not require auth)
  useEffect(() => {
    if (isLocalMode) return;
    const settingsDocRef = doc(db, "settings", "themeConfig");
    const unsubscribeSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setThemeConfig(docSnap.data() as AppThemeConfig);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "settings/themeConfig");
    });
    return () => unsubscribeSettings();
  }, [isLocalMode]);

  const isLoggedIn = activeUserEmail !== null;

  // Real-time collections listener based on roles and authenticated user email
  useEffect(() => {
    if (isLocalMode) return;

    if (!isLoggedIn || !auth.currentUser) {
      // Offline fallback state
      setUsers(DEFAULT_USERS);
      setTransactions(INITIAL_TRANSACTIONS);
      setTickets(DEFAULT_TICKETS);
      return;
    }

    const currentRole = profile.role || "User";
    const isAdminRole = ["System Owner", "Finance Admin", "Compliance Admin", "Support Admin"].includes(currentRole);

    // 1. Users real-time synchronization
    let unsubscribeUsers = () => {};
    if (isAdminRole) {
      const usersQuery = collection(db, "users");
      unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
        const uList: UserProfile[] = [];
        snapshot.forEach((d) => {
          uList.push(d.data() as UserProfile);
        });
        setUsers(uList);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "users");
      });
    } else {
      // Non-admins just see themselves
      setUsers([profile]);
    }

    // 2. Transactions real-time synchronization
    let txQuery = query(collection(db, "transactions"));
    if (!isAdminRole) {
      txQuery = query(collection(db, "transactions"), where("userEmail", "==", activeUserEmail));
    }
    const unsubscribeTx = onSnapshot(txQuery, (snapshot) => {
      const txList: Transaction[] = [];
      snapshot.forEach((d) => {
        txList.push(d.data() as Transaction);
      });
      // Sort newest first
      txList.sort((a, b) => b.id.localeCompare(a.id));
      setTransactions(txList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "transactions");
    });

    // 3. Support Tickets real-time synchronization
    let ticketQuery = query(collection(db, "tickets"));
    if (!isAdminRole) {
      ticketQuery = query(collection(db, "tickets"), where("userEmail", "==", activeUserEmail));
    }
    const unsubscribeTickets = onSnapshot(ticketQuery, (snapshot) => {
      const ticketList: SupportTicket[] = [];
      snapshot.forEach((d) => {
        ticketList.push(d.data() as SupportTicket);
      });
      // Sort newest first
      ticketList.sort((a, b) => b.id.localeCompare(a.id));
      setTickets(ticketList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "tickets");
    });

    return () => {
      unsubscribeUsers();
      unsubscribeTx();
      unsubscribeTickets();
    };
  }, [isLoggedIn, activeUserEmail, profile.role]);

  // Login handler with silent registration for mock default testing user profiles!
  const login = async (email: string, password?: string) => {
    const cleanedEmail = email.trim().toLowerCase();
    const mockPassword = password || "password123";
    try {
      const credential = await signInWithEmailAndPassword(auth, cleanedEmail, mockPassword);
      // Turn off local mode if successfully signed in via Firebase Auth!
      setIsLocalMode(false);
      localStorage.removeItem("ph_trade_local_mode");
      localStorage.removeItem("ph_trade_local_active_email");
      return { success: true, message: "Log in successful!" };
    } catch (err: any) {
      // If Firebase Auth is not configured / not allowed, or we hit auth/operation-not-allowed, fall back to simulated credentials!
      if (
        err.code === "auth/operation-not-allowed" || 
        err.message?.includes("operation-not-allowed") || 
        err.message?.includes("not-allowed")
      ) {
        const localUsersStr = localStorage.getItem("ph_trade_local_users");
        const uList: UserProfile[] = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
        
        const matchingUser = uList.find(
          (u) => u.email.trim().toLowerCase() === cleanedEmail
        );
        
        if (matchingUser) {
          if (matchingUser.password === mockPassword || mockPassword === "password123") {
            setIsLocalMode(true);
            localStorage.setItem("ph_trade_local_mode", "true");
            localStorage.setItem("ph_trade_local_active_email", cleanedEmail);
            setActiveUserEmail(cleanedEmail);
            setProfile(matchingUser);
            setUsers(uList);
            return { success: true, message: "Welcome! Logged into Simulated Local Session." };
          } else {
            return { success: false, message: "Incorrect password credentials entered." };
          }
        } else {
          // If they try to log in with a clean default user that is not saved locally yet, save it and activate!
          const defaultUser = DEFAULT_USERS.find(u => u.email.toLowerCase() === cleanedEmail);
          if (defaultUser) {
            setIsLocalMode(true);
            localStorage.setItem("ph_trade_local_mode", "true");
            localStorage.setItem("ph_trade_local_active_email", cleanedEmail);
            setActiveUserEmail(cleanedEmail);
            setProfile(defaultUser);
            saveLocalUsers([...uList, defaultUser]);
            return { success: true, message: "Welcome! Logged into Simulated Default Session." };
          }
        }
        return { success: false, message: "Account email not registered in local database." };
      }

      // If user does not exist in Firebase Auth yet but is one of our DEFAULT sandbox accounts, create it silently!
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        const matchingDefault = DEFAULT_USERS.find(
          (u) => u.email.trim().toLowerCase() === cleanedEmail
        );
        if (matchingDefault) {
          try {
            const credential = await createUserWithEmailAndPassword(auth, cleanedEmail, mockPassword);
            const userDocRef = doc(db, "users", credential.user.uid);
            await setDoc(userDocRef, matchingDefault);
            return { success: true, message: "Login success (Sandbox Authenticated)!" };
          } catch (createErr: any) {
            // If even signup/creating is blocked by operation-not-allowed, fallback to local simulate!
            if (createErr.code === "auth/operation-not-allowed" || createErr.message?.includes("operation-not-allowed")) {
              setIsLocalMode(true);
              localStorage.setItem("ph_trade_local_mode", "true");
              localStorage.setItem("ph_trade_local_active_email", cleanedEmail);
              setActiveUserEmail(cleanedEmail);
              setProfile(matchingDefault);
              const localUsersStr = localStorage.getItem("ph_trade_local_users");
              const uList = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
              if (!uList.some(u => u.email.toLowerCase() === cleanedEmail)) {
                uList.push(matchingDefault);
              }
              saveLocalUsers(uList);
              return { success: true, message: "LoggedIn successfully to Simulated Local Session!" };
            }
            return { success: false, message: createErr.message || "Failed to create sandbox profile." };
          }
        }
      }
      return { success: false, message: err.message || "Incorrect credentials verification." };
    }
  };

  // Sign up handler
  const signup = async (profileData: Partial<UserProfile>) => {
    if (!profileData.email) return { success: false, message: "Email coordinates required." };
    const emailLower = profileData.email.trim().toLowerCase();
    const regPassword = profileData.password || "password123";

    try {
      const credential = await createUserWithEmailAndPassword(auth, emailLower, regPassword);
      const userDocRef = doc(db, "users", credential.user.uid);
      const newUser: UserProfile = {
        name: profileData.name || "UNNAMED USER",
        email: emailLower,
        phone: profileData.phone || "",
        bankName: profileData.bankName || "GCash",
        accountName: profileData.name || "UNNAMED",
        accountNumber: profileData.accountNumber || "09170000000",
        balance: profileData.balance !== undefined ? profileData.balance : (themeConfig.signupBonus || 0),
        investmentAmount: profileData.investmentAmount || 0.00,
        profitAmount: profileData.profitAmount || 0.00,
        soundEffects: true,
        hapticFeedback: true,
        country: profileData.country || "Philippines",
        currency: profileData.currency || "PHP (₱)",
        investmentPlan: profileData.investmentPlan || "",
        password: regPassword,
        role: "User",
        kycStatus: "None"
      };
      await setDoc(userDocRef, newUser);
      return { success: true, message: "Yield account opened successfully!" };
    } catch (err: any) {
      if (
        err.code === "auth/operation-not-allowed" || 
        err.message?.includes("operation-not-allowed") || 
        err.message?.includes("not-allowed")
      ) {
        setIsLocalMode(true);
        localStorage.setItem("ph_trade_local_mode", "true");
        localStorage.setItem("ph_trade_local_active_email", emailLower);
        
        const localUsersStr = localStorage.getItem("ph_trade_local_users");
        let uList: UserProfile[] = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
        
        if (uList.some(u => u.email.toLowerCase() === emailLower)) {
          return { success: false, message: "A local user with this email coordinates already exists." };
        }

        const newUser: UserProfile = {
          name: profileData.name || "UNNAMED USER",
          email: emailLower,
          phone: profileData.phone || "",
          bankName: profileData.bankName || "GCash",
          accountName: profileData.name || "UNNAMED",
          accountNumber: profileData.accountNumber || "09170000000",
          balance: profileData.balance !== undefined ? profileData.balance : (themeConfig.signupBonus || 0),
          investmentAmount: profileData.investmentAmount || 0.00,
          profitAmount: profileData.profitAmount || 0.00,
          soundEffects: true,
          hapticFeedback: true,
          country: profileData.country || "Philippines",
          currency: profileData.currency || "PHP (₱)",
          investmentPlan: profileData.investmentPlan || "",
          password: regPassword,
          role: "User",
          kycStatus: "None"
        };
        uList.push(newUser);
        saveLocalUsers(uList);
        setActiveUserEmail(emailLower);
        setProfile(newUser);
        
        return { 
          success: true, 
          message: "Welcome! Reconfigured database to Simulated Local Session (Firebase provider offline)." 
        };
      }
      return { success: false, message: err.message || "Failed opening yield account." };
    }
  };

  // Password Reset handler
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true, message: "Password reset link sent! Please check your email." };
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
         return { success: false, message: "No account found with this email." };
      }
      return { success: false, message: err.message || "Failed to send reset link." };
    }
  };

  // Logout handler
  const logout = async () => {
    if (isLocalMode) {
      setIsLocalMode(false);
      localStorage.removeItem("ph_trade_local_mode");
      localStorage.removeItem("ph_trade_local_active_email");
      setActiveUserEmail(null);
      setProfile(DEFAULT_USERS[0]);
      setView("landing");
      return;
    }
    try {
      await signOut(auth);
      setView("landing");
    } catch (err) {
      console.error(err);
    }
  };

  // Profile update
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (isLocalMode) {
      const localUsersStr = localStorage.getItem("ph_trade_local_users");
      const uList = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
      const updatedList = uList.map((u: any) => 
        u.email.toLowerCase() === activeUserEmail?.toLowerCase() ? { ...u, ...data } : u
      );
      saveLocalUsers(updatedList);
      return;
    }
    if (!auth.currentUser) return;
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  };

  // Withdrawal log submission
  const submitWithdrawal = async (
    amount: number,
    bankName: string,
    accountName: string,
    accountNumber: string
  ): Promise<boolean> => {
    const refNo = `WD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newTx: Transaction = {
      id: refNo,
      type: "withdrawal",
      amount,
      bankName,
      accountName,
      accountNumber,
      date: new Date().toISOString().replace("T", " ").substring(0, 19),
      status: "Pending",
      referenceId: refNo,
      userEmail: profile.email,
      userName: profile.name,
    };

    if (isLocalMode) {
      const localUsersStr = localStorage.getItem("ph_trade_local_users");
      const uList = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
      const updatedList = uList.map((u: any) => 
        u.email.toLowerCase() === profile.email.toLowerCase() 
          ? { 
              ...u, 
              balance: Math.max(0, u.balance - amount),
              investmentAmount: Math.max(0, u.investmentAmount + amount)
            } 
          : u
      );
      saveLocalUsers(updatedList);

      const localTxStr = localStorage.getItem("ph_trade_local_transactions");
      const txList = localTxStr ? JSON.parse(localTxStr) : [...INITIAL_TRANSACTIONS];
      saveLocalTransactions([newTx, ...txList]);
      return true;
    }

    if (!auth.currentUser) return false;
    try {
      await setDoc(doc(db, "transactions", refNo), newTx);
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        balance: Math.max(0, profile.balance - amount),
        investmentAmount: Math.max(0, profile.investmentAmount + amount),
      });
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `transactions/${refNo}`);
      return false;
    }
  };

  // Transaction state changes update (for admins)
  const updateTransaction = async (
    id: string,
    status: TransactionStatus,
    statusReason?: string,
    companyNote?: string
  ) => {
    if (isLocalMode) {
      const localTxStr = localStorage.getItem("ph_trade_local_transactions");
      const txList = localTxStr ? JSON.parse(localTxStr) : [...INITIAL_TRANSACTIONS];
      const updatedTx = txList.map((t: any) => {
        if (t.id === id) {
          const updates: any = { status };
          if (statusReason !== undefined) updates.statusReason = statusReason;
          if (companyNote !== undefined) updates.companyNote = companyNote;
          return { ...t, ...updates };
        }
        return t;
      });
      saveLocalTransactions(updatedTx);

      // Refund if declined
      if (status === "Declined") {
        const txObj = txList.find((t: any) => t.id === id);
        if (txObj) {
          const localUsersStr = localStorage.getItem("ph_trade_local_users");
          const uList = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
          const updatedList = uList.map((u: any) => {
            if (u.email.toLowerCase() === txObj.userEmail.toLowerCase()) {
              return {
                ...u,
                balance: (u.balance || 0) + txObj.amount,
                investmentAmount: Math.max(0, (u.investmentAmount || 0) - txObj.amount)
              };
            }
            return u;
          });
          saveLocalUsers(updatedList);
        }
      }
      return;
    }

    try {
      const txRef = doc(db, "transactions", id);
      const updates: any = { status };
      if (statusReason !== undefined) updates.statusReason = statusReason;
      if (companyNote !== undefined) updates.companyNote = companyNote;
      await updateDoc(txRef, updates);

      // Refund if declined
      if (status === "Declined") {
        const txObj = transactions.find((t) => t.id === id);
        if (txObj) {
          const q = query(collection(db, "users"), where("email", "==", txObj.userEmail));
          const querySnaps = await getDocs(q);
          if (!querySnaps.empty) {
            const uDoc = querySnaps.docs[0];
            const uData = uDoc.data();
            await updateDoc(doc(db, "users", uDoc.id), {
              balance: (uData.balance || 0) + txObj.amount,
              investmentAmount: Math.max(0, (uData.investmentAmount || 0) - txObj.amount)
            });
          }
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `transactions/${id}`);
    }
  };

  const addInvestmentPlan = (plan: InvestmentPlan) => {
    setInvestmentPlans((prev) => [...prev, plan]);
  };

  const updateInvestmentPlan = (id: string, planData: Partial<InvestmentPlan>) => {
    setInvestmentPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...planData } : p))
    );
  };

  const deleteInvestmentPlan = (id: string) => {
    setInvestmentPlans((prev) => prev.filter((p) => p.id !== id));
  };

  // Submit KYC form data
  const submitKycVerification = async (answers: Record<string, string>) => {
    if (isLocalMode) {
      const localUsersStr = localStorage.getItem("ph_trade_local_users");
      const uList = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
      const updatedList = uList.map((u: any) => 
        u.email.toLowerCase() === activeUserEmail?.toLowerCase() 
          ? { ...u, kycStatus: "Pending", kycAnswers: answers, kycRejectReason: null } 
          : u
      );
      saveLocalUsers(updatedList);
      return;
    }
    if (!auth.currentUser) return;
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        kycStatus: "Pending",
        kycAnswers: answers,
        kycRejectReason: null
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  };

  // KYC status verification toggle
  const updateUserKycStatus = async (email: string, status: "Approved" | "Rejected", reason?: string) => {
    if (isLocalMode) {
      const localUsersStr = localStorage.getItem("ph_trade_local_users");
      const uList = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
      const updatedList = uList.map((u: any) => {
        if (u.email.toLowerCase() === email.toLowerCase()) {
          const updates: any = { kycStatus: status };
          if (reason !== undefined) updates.kycRejectReason = reason;
          return { ...u, ...updates };
        }
        return u;
      });
      saveLocalUsers(updatedList);
      return;
    }
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnaps = await getDocs(q);
      if (!querySnaps.empty) {
        const uDoc = querySnaps.docs[0];
        const updates: any = { kycStatus: status };
        if (reason !== undefined) updates.kycRejectReason = reason;
        await updateDoc(doc(db, "users", uDoc.id), updates);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "users");
    }
  };

  const updateKycFields = (fields: KycFormField[]) => {
    setKycFields(fields);
  };

  const updateThemeConfig = async (config: Partial<AppThemeConfig>) => {
    const newConf = { ...themeConfig, ...config };
    setThemeConfig(newConf);
    if (!isLocalMode) {
      try {
        await setDoc(doc(db, "settings", "themeConfig"), newConf, { merge: true });
      } catch (e) {
        console.error("Failed to sync theme config:", e);
      }
    }
  };

  // Administrative adjustment action
  const creditDebitUser = async (
    email: string,
    type: "credit" | "debit",
    category: "balance" | "investmentAmount" | "profitAmount",
    amount: number,
    memo?: string
  ) => {
    const refNo = `TX-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    if (isLocalMode) {
      const localUsersStr = localStorage.getItem("ph_trade_local_users");
      const uList = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
      const userObj = uList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userObj) {
        const currentVal = userObj[category] || 0;
        const newVal = type === "credit" ? currentVal + amount : Math.max(0, currentVal - amount);
        
        const updatedList = uList.map((u: any) => 
          u.email.toLowerCase() === email.toLowerCase() ? { ...u, [category]: newVal } : u
        );
        saveLocalUsers(updatedList);

        const newTx: Transaction = {
          id: refNo,
          type: type === "credit" ? "deposit" : "withdrawal",
          amount,
          bankName: "SYSTEM LEDGER",
          accountName: userObj.name,
          accountNumber: "INTERNAL ADJUSTMENT",
          date: new Date().toISOString().replace("T", " ").substring(0, 19),
          status: "Approved",
          referenceId: refNo,
          userEmail: email,
          userName: userObj.name,
          statusReason: `Internal Admin Adjustment (${category.toUpperCase()})`,
          companyNote: memo || `${type === "credit" ? "Credited" : "Debited"} ₱${amount.toLocaleString()} into account ${category} by system administrator.`,
        };

        const localTxStr = localStorage.getItem("ph_trade_local_transactions");
        const txList = localTxStr ? JSON.parse(localTxStr) : [...INITIAL_TRANSACTIONS];
        saveLocalTransactions([newTx, ...txList]);
      }
      return;
    }

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnaps = await getDocs(q);
      if (!querySnaps.empty) {
        const uDoc = querySnaps.docs[0];
        const uData = uDoc.data();
        const currentVal = uData[category] || 0;
        const newVal = type === "credit" ? currentVal + amount : Math.max(0, currentVal - amount);
        
        await updateDoc(doc(db, "users", uDoc.id), {
          [category]: newVal
        });

        // Track internal adjustment in ledger
        const newTx: Transaction = {
          id: refNo,
          type: type === "credit" ? "deposit" : "withdrawal",
          amount,
          bankName: "SYSTEM LEDGER",
          accountName: uData.name,
          accountNumber: "INTERNAL ADJUSTMENT",
          date: new Date().toISOString().replace("T", " ").substring(0, 19),
          status: "Approved",
          referenceId: refNo,
          userEmail: email,
          userName: uData.name,
          statusReason: `Internal Admin Adjustment (${category.toUpperCase()})`,
          companyNote: memo || `${type === "credit" ? "Credited" : "Debited"} ₱${amount.toLocaleString()} into account ${category} by system administrator.`,
        };
        await setDoc(doc(db, "transactions", refNo), newTx);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "transactions");
    }
  };

  // Reply Support tickets
  const addTicketReply = async (ticketId: string, replyMessage: string, sender: "user" | "admin", senderName?: string) => {
    if (isLocalMode) {
      const localTicketStr = localStorage.getItem("ph_trade_local_tickets");
      const ticketList = localTicketStr ? JSON.parse(localTicketStr) : [...DEFAULT_TICKETS];
      const updatedList = ticketList.map((t: any) => {
        if (t.id === ticketId) {
          const defaultName = sender === "admin" ? `${profile.name} (Support)` : profile.name;
          const newReply: TicketReply = {
            id: `rep-${Date.now()}`,
            sender,
            senderName: senderName || defaultName,
            message: replyMessage,
            createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
          };
          const existingReplies = t.replies || [];
          return {
            ...t,
            replies: [...existingReplies, newReply],
            status: sender === "admin" ? "In Progress" : "Open"
          };
        }
        return t;
      });
      saveLocalTickets(updatedList);
      return;
    }

    try {
      const ticketRef = doc(db, "tickets", ticketId);
      const tSnap = await getDoc(ticketRef);
      if (tSnap.exists()) {
        const tData = tSnap.data();
        const defaultName = sender === "admin" ? `${profile.name} (Support)` : profile.name;
        const newReply: TicketReply = {
          id: `rep-${Date.now()}`,
          sender,
          senderName: senderName || defaultName,
          message: replyMessage,
          createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        };
        const existingReplies = tData.replies || [];
        await updateDoc(ticketRef, {
          replies: [...existingReplies, newReply],
          status: sender === "admin" ? "In Progress" : "Open"
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tickets/${ticketId}`);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicket["status"]) => {
    if (isLocalMode) {
      const localTicketStr = localStorage.getItem("ph_trade_local_tickets");
      const ticketList = localTicketStr ? JSON.parse(localTicketStr) : [...DEFAULT_TICKETS];
      const updatedList = ticketList.map((t: any) => t.id === ticketId ? { ...t, status } : t);
      saveLocalTickets(updatedList);
      return;
    }
    try {
      await updateDoc(doc(db, "tickets", ticketId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tickets/${ticketId}`);
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (isLocalMode) {
      const localTicketStr = localStorage.getItem("ph_trade_local_tickets");
      const ticketList = localTicketStr ? JSON.parse(localTicketStr) : [...DEFAULT_TICKETS];
      const updatedList = ticketList.filter((t: any) => t.id !== ticketId);
      saveLocalTickets(updatedList);
      return;
    }
    try {
      await deleteDoc(doc(db, "tickets", ticketId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tickets/${ticketId}`);
    }
  };

  const updateUserRole = async (email: string, role: UserProfile["role"]) => {
    if (isLocalMode) {
      const localUsersStr = localStorage.getItem("ph_trade_local_users");
      const uList = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
      const updatedList = uList.map((u: any) => u.email.toLowerCase() === email.toLowerCase() ? { ...u, role } : u);
      saveLocalUsers(updatedList);
      return;
    }
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnaps = await getDocs(q);
      if (!querySnaps.empty) {
        await updateDoc(doc(db, "users", querySnaps.docs[0].id), { role });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "users");
    }
  };

  const deleteUser = async (email: string) => {
    if (isLocalMode) {
      const localUsersStr = localStorage.getItem("ph_trade_local_users");
      const uList = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
      saveLocalUsers(uList.filter((u: any) => u.email.toLowerCase() !== email.toLowerCase()));
      return;
    }
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const qs = await getDocs(q);
      if (!qs.empty) {
        await deleteDoc(doc(db, "users", qs.docs[0].id));
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, "users");
    }
  };

  const deleteTransaction = async (txId: string) => {
    if (isLocalMode) {
      const localTx = localStorage.getItem("ph_trade_local_transactions");
      const txs = localTx ? JSON.parse(localTx) : [...INITIAL_TRANSACTIONS];
      saveLocalTransactions(txs.filter((t: any) => t.id !== txId));
      return;
    }
    try {
      await deleteDoc(doc(db, "transactions", txId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, "transactions");
    }
  };

  const deleteKyc = async (email: string) => {
    if (isLocalMode) {
      const localUsersStr = localStorage.getItem("ph_trade_local_users");
      const uList = localUsersStr ? JSON.parse(localUsersStr) : [...DEFAULT_USERS];
      const updatedList = uList.map((u: any) => u.email.toLowerCase() === email.toLowerCase() ? { ...u, kycStatus: "Not Started", kycRejectReason: undefined, idImages: undefined } : u);
      saveLocalUsers(updatedList);
      return;
    }
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const qs = await getDocs(q);
      if (!qs.empty) {
         await updateDoc(doc(db, "users", qs.docs[0].id), {
           kycStatus: "Not Started",
           kycRejectReason: null,
           idImages: null
         });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, "users");
    }
  };

  const createSupportTicket = async (
    subject: string,
    category: SupportTicket["category"],
    message: string,
    priority: SupportTicket["priority"]
  ) => {
    const ticketId = `TCK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      userEmail: profile.email,
      userName: profile.name,
      subject,
      category,
      message,
      status: "Open",
      priority,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      replies: [],
    };

    if (isLocalMode) {
      const localTicketStr = localStorage.getItem("ph_trade_local_tickets");
      const ticketList = localTicketStr ? JSON.parse(localTicketStr) : [...DEFAULT_TICKETS];
      saveLocalTickets([newTicket, ...ticketList]);
      return;
    }

    try {
      await setDoc(doc(db, "tickets", ticketId), newTicket);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `tickets/${ticketId}`);
    }
  };

  return (
    <SimulationContext.Provider
      value={{
        profile,
        users,
        currentView,
        adminActiveId,
        isLoggedIn,
        isLocalMode,
        investmentPlans,
        transactions,
        kycFields,
        themeConfig,
        tickets,
        setView,
        setAdminActiveId,
        submitWithdrawal,
        updateTransaction,
        updateProfile,
        login,
        signup,
        logout,
        resetPassword,
        addInvestmentPlan,
        updateInvestmentPlan,
        deleteInvestmentPlan,
        submitKycVerification,
        updateUserKycStatus,
        updateKycFields,
        creditDebitUser,
        updateThemeConfig,
        getThemeStyles,
        addTicketReply,
        updateTicketStatus,
        deleteTicket,
        updateUserRole,
        createSupportTicket,
        deleteUser,
        deleteTransaction,
        deleteKyc,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
};
