import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import type { AuthContextType } from "../utils/types/users";

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};