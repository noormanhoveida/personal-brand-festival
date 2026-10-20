import http from "http";
import app from "./app";
import { env } from "./config/env";
import { initRealtime } from "./realtime/socket";

const httpServer = http.createServer(app);
initRealtime(httpServer);

httpServer.listen(env.port, () => {
  console.log(`✅ Backend running on http://localhost:${env.port}`);
  console.log(`✅ Realtime (Socket.IO) attached to the same server`);
});
