import { Transaction } from "../types";

export interface BankConfig {
  id: string;
  name: string;
  color: string;
  logoText: string;
}

export const PHILIPPINE_BANKS: BankConfig[] = [
  { id: "gcash", name: "GCash", color: "bg-blue-600 text-white", logoText: "G" },
  { id: "maya", name: "PayMaya (Maya)", color: "bg-emerald-500 text-white", logoText: "M" },
  { id: "bdo", name: "BDO (Banco de Oro)", color: "bg-[#002A54] text-white", logoText: "BDO" },
  { id: "bpi", name: "BPI (Bank of the Philippine Islands)", color: "bg-red-700 text-white", logoText: "BPI" },
  { id: "metrobank", name: "Metrobank", color: "bg-blue-800 text-white", logoText: "MB" },
  { id: "unionbank", name: "UnionBank", color: "bg-amber-600 text-white", logoText: "UB" },
  { id: "pnb", name: "PNB (Philippine National Bank)", color: "bg-blue-900 text-white", logoText: "PNB" },
  { id: "psbank", name: "PSBANK (Philippine Savings Bank)", color: "bg-blue-600 text-white", logoText: "PSB" },
  { id: "securitybank", name: "Security Bank", color: "bg-sky-700 text-white", logoText: "SBC" },
  { id: "landbank", name: "Landbank", color: "bg-green-700 text-white", logoText: "LBP" },
  { id: "rcbc", name: "RCBC (Rizal Commercial Banking Corporation)", color: "bg-indigo-700 text-white", logoText: "RCBC" },
  { id: "eastwest", name: "EastWest Bank", color: "bg-amber-500 text-white", logoText: "EW" },
  { id: "chinabank", name: "China Bank", color: "bg-[#c026d3] text-white", logoText: "CBC" },
  { id: "gotyme", name: "GoTyme Bank", color: "bg-teal-600 text-white", logoText: "Go" },
  { id: "tonik", name: "Tonik", color: "bg-purple-600 text-white", logoText: "T" },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "WD-1775565391616-DHABG2TNB",
    type: "withdrawal",
    amount: 58700,
    bankName: "GCash",
    accountName: "MARUEL DULNUAN",
    accountNumber: "09564529983",
    date: "2026-05-20 14:32:10",
    status: "Verification Required",
    statusReason: "SYSTEM MANAGEMENT CHARGES REQUIRED",
    companyNote: "Because Of The Unpaid System Management Charges Of ₱5,800.00, Kindly Contact The Customer Service Agent Now To Proceed With The Charges Payment And Check The Transaction Status Again.",
    referenceId: "WD-1775565391616-DHABG2TNB",
    userEmail: "maruel.dul@gmail.com",
    userName: "MARUEL DULNUAN",
  },
  {
    id: "WD-172548816445-EACWFRION",
    type: "withdrawal",
    amount: 500000,
    bankName: "GCash",
    accountName: "Elgua Hilar",
    accountNumber: "09110192800",
    date: "2026-05-19 09:12:00",
    status: "Pending",
    referenceId: "WD-172548816445-EACWFRION",
    userEmail: "elgua.h@gmail.com",
    userName: "Elgua Hilar",
  },
  {
    id: "WD-17189191002-WBSDF98S",
    type: "withdrawal",
    amount: 45320,
    bankName: "GCash",
    accountName: "Maria Santos",
    accountNumber: "09214481021",
    date: "2026-05-21 11:18:00",
    status: "Approved",
    referenceId: "WD-17189191002-WBSDF98S",
    userEmail: "maria.s@gmail.com",
    userName: "Maria Santos",
  },
  {
    id: "WD-17189191003-XBND812",
    type: "withdrawal",
    amount: 28750,
    bankName: "PayMaya (Maya)",
    accountName: "Juan Dela Cruz",
    accountNumber: "09311029182",
    date: "2026-05-21 10:15:00",
    status: "Approved",
    referenceId: "WD-17189191003-XBND812",
    userEmail: "juan.dc@gmail.com",
    userName: "Juan Dela Cruz",
  },
  {
    id: "WD-17189191004-9ASDFG98",
    type: "withdrawal",
    amount: 72400,
    bankName: "BDO (Banco de Oro)",
    accountName: "Ana Reyes",
    accountNumber: "10328919102",
    date: "2026-05-18 15:44:00",
    status: "Approved",
    referenceId: "WD-17189191004-9ASDFG98",
    userEmail: "ana.reyes@gmail.com",
    userName: "Ana Reyes",
  }
];

export const RANDOM_FIRST_NAMES = [
  "Fernando", "Maria", "Juan", "Angelo", "Michael", "Manuel", "Corazon", "Jose", "Divina", "Estrella",
  "Ramon", "Aileen", "Analyn", "Roderick", "Maruel", "Elgua", "Althea", "Mark", "Cristina", "Sheryl",
  "Jeffrey", "Cynthia", "Leandro", "Reynaldo", "Rosalie", "Glenda", "Wilfredo", "Jocelyn", "Elisa"
];

export const RANDOM_LAST_NAMES = [
  "Dela Cruz", "Santos", "Reyes", "Dulnuan", "Garcia", "Mendoza", "Aquino", "Bautista", "Hilar",
  "Gonzales", "Villanueva", "Castro", "Roxas", "Lopez", "Mercado", "Ramirez", "Ocampo", "Dizon"
];

export const RANDOM_PAYOUT_METHODS = [
  "GCash", "Maya", "BDO", "BPI", "Metrobank", "UnionBank"
];
