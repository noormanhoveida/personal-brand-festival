import { sendDailyChatDigest } from './modules/email-templates/email-template.service';
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

// Daily Chat Digest Runner (Checks every hour, sends at 20:00 / 8 PM Iran time once a day)
let lastDigestDate = '';
setInterval(async () => {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const hour = (now.getUTCHours() + 3.5) % 24; // Iran approximate UTC+3.5
  if (Math.floor(hour) === 20 && lastDigestDate !== todayStr) {
    lastDigestDate = todayStr;
    console.log('[cron] Triggering daily chat digest...');
    try {
      await sendDailyChatDigest();
    } catch (e) {
      console.error('[cron] Chat digest run failed:', e);
    }
  }
}, 60 * 60 * 1000);
