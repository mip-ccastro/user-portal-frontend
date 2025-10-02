import type { CreateUserInput } from "../validations/createUserSchema";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateUserInput } from "../validations/updateUserSchema";

export interface User {
    user_id: string;
    user_role: string;
    is_authorized: boolean;
    email: string;
    created_at: string;
    updated_at: string;
    user_status: number
    first_name: string;
    last_name: string;
    user_credentials: {
        username: string;
    }
}

export interface UserEntity {
    user_role: string;
    email: string;
    user_status: number;
    first_name: string;
    last_name: string;
    password: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User, accessToken: string, refreshToken: string, idToken: string) => void;
  logout: () => void;
  checkAuth: () => void;
  isRestoring: boolean;
}

export interface CreateUserFormProps {
  form: UseFormReturn<CreateUserInput>;
}

export interface UpdateUserFormProps {
  form: UseFormReturn<UpdateUserInput>;
}