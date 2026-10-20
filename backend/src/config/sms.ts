// SMS adapter. KAVENEGAR_API_KEY unset => codes are logged to the
// console (dev fallback), mirroring config/mailer.ts behavior.
import { env } from "./env";

export async function sendSms(to: string, text: string): Promise<void> {
  if (!env.kavenegarApiKey) {
    console.log(`\n[sms:DEV] --- would send SMS to ${to} ---`);
    console.log(text);
    console.log("--- end sms ---\n");
    return;
  }
  const url =
    `https://api.kavenegar.com/v1/${env.kavenegarApiKey}/sms/send.json` +
    `?receptor=${encodeURIComponent(to)}&sender=${env.kavenegarSender}` +
    `&message=${encodeURIComponent(text)}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Kavenegar SMS failed: ${res.status}`);
  }
}

export async function sendVerificationSms(to: string, code: string): Promise<void> {
  await sendSms(to, `فستیوال برند شخصی\nکد تأیید شما: ${code}\nاین کد ۱۵ دقیقه معتبر است.`);
}
