import { restClient } from "../rest/client";

export type User = {
  id: number;
  email: string;
  nickname: string;
};

export type AuthResponse = {
  status: { code: number; message: string };
  data: {
    user: User;
    token: string;
  };
};

export type LoginParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
};

export const authService = {
  login: async (params: LoginParams): Promise<AuthResponse> => {
    const response = await restClient.post<AuthResponse>("/api/v1/users/sign_in", {
      user: params,
    });
    return response.data;
  },

  signUp: async (params: SignUpParams): Promise<AuthResponse> => {
    const response = await restClient.post<AuthResponse>("/api/v1/users", {
      user: params,
    });
    return response.data;
  },

  logout: async (token: string): Promise<void> => {
    await restClient.delete("/api/v1/users/sign_out", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateProfile: async (params: { name?: string }, token: string): Promise<AuthResponse> => {
    const response = await restClient.patch<AuthResponse>("/api/v1/users", {
      user: params,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await restClient.delete("/api/v1/users");
  },
};
