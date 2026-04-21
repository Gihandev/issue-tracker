import { create } from "zustand";
import { persist } from "zustand/middleware";
import { updateProfileApi } from "../api/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Called after successful login or register with real API response
      login: (userData, token) =>
        set({
          user: userData,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      // Update profile via real API, then sync local state
      updateUser: async (updates) => {
        const response = await updateProfileApi(updates);
        const updatedUser = response.data.user;
        set((state) => ({
          user: { ...state.user, ...updatedUser },
        }));
        return updatedUser;
      },
    }),
    { name: "auth-store" }
  )
);