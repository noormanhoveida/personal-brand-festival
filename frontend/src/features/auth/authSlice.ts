import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role =
  | "VISITOR"
  | "PARTICIPANT"
  | "EVALUATOR"
  | "BOOTCAMP_MANAGER"
  | "ADMIN";

interface AuthState {
  accessToken: string | null;
  role: Role | null;
  status: "idle" | "authenticating" | "authenticated" | "guest";
}

const savedToken = localStorage.getItem("token") || localStorage.getItem("auth_token");
const savedRole = localStorage.getItem("role") as Role | null;

const initialState: AuthState = {
  accessToken: savedToken || null,
  role: savedRole || null,
  status: savedToken ? "authenticated" : "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ accessToken: string; role: Role }>) {
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;
      state.status = "authenticated";
      localStorage.setItem("token", action.payload.accessToken);
      localStorage.setItem("auth_token", action.payload.accessToken);
      localStorage.setItem("role", action.payload.role);
    },
    clearSession(state) {
      state.accessToken = null;
      state.role = null;
      state.status = "guest";
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("role");
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
