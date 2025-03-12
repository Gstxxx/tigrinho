export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export interface CrashBet {
  id: string;
  amount: number;
  status: string;
  cashoutMultiplier: number | null;
  autoWithdrawAt: number | null;
  profit: number | null;
  userId: string;
  userName: string;
}

export interface CrashGame {
  id: string;
  hash: string;
  status: string;
  createdAt: string;
  crashPoint?: number;
  seed?: string;
}

export interface UserBet extends CrashBet {
  createdAt: string;
  game: {
    id: string;
    crashPoint: number;
    status: string;
    createdAt: string;
  };
}

export interface GameHistoryItem {
  id: string;
  crashPoint: number;
  createdAt: string;
}
