import { create } from "zustand";

// This is the shape of the auth store
interface AuthState {
  token:        string | null;  // null = not logged in
  isAuthed:     boolean;
  isMarketOpen: boolean | null; // null = not fetched yet
  ordersSummary: { pending?: number; executed?: number } | null;
  rmsLimits:    { availableMargin?: number } | null;

  // Actions — functions that update the state
  setToken:      (token: string) => void;
  setMarketOpen: (v: boolean) => void;
  logout:        () => void;
}

// create() builds the store with initial values and actions
export const useAuthStore = create<AuthState>((set) => ({
  token:         null,
  isAuthed:      false,
  isMarketOpen:  null,
  ordersSummary: null,
  rmsLimits:     null,

  // set() merges the new values into state
  setToken:      (token) => set({ token, isAuthed: true }),
  setMarketOpen: (v)     => set({ isMarketOpen: v }),
  logout: ()             => set({ token: null, isAuthed: false }),
}));

// Usage in any component:
// const token = useAuthStore((s) => s.token);
// const setToken = useAuthStore((s) => s.setToken);
