/// <reference types="vite/client" />

// Declare missing modules to prevent build errors
declare module 'crypto-js' {
  export const HmacSHA256: (message: string, secret: string) => { toString: (encoder: unknown) => string };
  export const enc: { Hex: { toString: () => string } };
  [key: string]: any;
}

declare module 'zod' {
  export const z: any;
  [key: string]: any;
}

declare module 'react-toastify' {
  export const toast: any;
  export const ToastContainer: any;
  [key: string]: any;
}

declare module 'lucide-react' {
  import React from 'react';
  export const Ticket: React.FC<any>;
  export const Loader2: React.FC<any>;
  export const Lock: React.FC<any>;
  export const Sun: React.FC<any>;
  export const Moon: React.FC<any>;
  export const Menu: React.FC<any>;
  export const Facebook: React.FC<any>;
  export const Twitter: React.FC<any>;
  export const Instagram: React.FC<any>;
  export const MessageCircle: React.FC<any>;
  export const Shield: React.FC<any>;
  export const Star: React.FC<any>;
  export const Zap: React.FC<any>;
  export const LiveTv: React.FC<any>;
  export const Schedule: React.FC<any>;
  export const Sparkles: React.FC<any>;
  export const ChevronRight: React.FC<any>;
  export const AlertCircle: React.FC<any>;
  export const RotateCw: React.FC<any>;
  export const Target: React.FC<any>;
  export const History: React.FC<any>;
  export const ChevronLeft: React.FC<any>;
  export const ArrowDown: React.FC<any>;
  export const ArrowUp: React.FC<any>;
  export const CreditCard: React.FC<any>;
  export const Wallet: React.FC<any>;
  export const Plus: React.FC<any>;
  export const Send: React.FC<any>;
  export const Hash: React.FC<any>;
  export const Calendar: React.FC<any>;
  export const Phone: React.FC<any>;
  export const Check: React.FC<any>;
  export const ChevronUp: React.FC<any>;
  export const LayoutDashboard: React.FC<any>;
  export const Gamepad2: React.FC<any>;
  export const Activity: React.FC<any>;
  export const Bell: React.FC<any>;
  export const ToggleLeft: React.FC<any>;
  export const ToggleRight: React.FC<any>;
  export const Trash2: React.FC<any>;
  export const Edit3: React.FC<any>;
  export const Link: React.FC<any>;
  export const MousePointerClick: React.FC<any>;
  export const Eye: React.FC<any>;
  export const EyeOff: React.FC<any>;
  export const AlertTriangle: React.FC<any>;
  export const X: React.FC<any>;
  export const TrendingUp: React.FC<any>;
  export const Clock: React.FC<any>;
  export const Play: React.FC<any>;
  export const DollarSign: React.FC<any>;
  export const CheckCircle: React.FC<any>;
  export const XCircle: React.FC<any>;
  export const LogOut: React.FC<any>;
  export const ArrowLeft: React.FC<any>;
  export const ChevronDown: React.FC<any>;
  export const AnimatePresence: any;
  export const motion: any;
  export const Trophy: React.FC<any>;
  export const TrendingDown: React.FC<any>;
  export const Minus: React.FC<any>;
  export const Plus: React.FC<any>;
  export const Flashlight: React.FC<any>;
  export const YellowCard: React.FC<any>;
  export const RedCard: React.FC<any>;
  export const Substitution: React.FC<any>;
  export const Goal: React.FC<any>;
  export const BarChart3: React.FC<any>;
  export const List: React.FC<any>;
  export const MessageSquare: React.FC<any>;
  export const Users: React.FC<any>;
  export const Mail: React.FC<any>;
  export const Filter: React.FC<any>;
  export const Download: React.FC<any>;
  [key: string]: any;
}
