import { io, Socket } from "socket.io-client";
import { store } from "../store";

const socketUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

let socket: Socket | null = null;

/**
 * One shared socket per tab, connected lazily on first use and
 * re-authenticated with the current access token. Live-session pages
 * call this instead of constructing their own connection so a
 * participant navigating between the check-in screen and the group
 * chat screen doesn't reconnect (and doesn't miss a `group:assigned`
 * event that arrives in between).
 */
export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(socketUrl, {
    autoConnect: false,
    auth: (cb) => cb({ token: store.getState().auth.accessToken }),
  });
  socket.connect();
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
