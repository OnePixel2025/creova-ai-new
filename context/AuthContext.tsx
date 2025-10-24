import { User } from "firebase/auth";
import { createContext } from "react";

interface UserData {
  credits: number;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: any;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    refreshUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);