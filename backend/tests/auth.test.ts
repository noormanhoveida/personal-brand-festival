import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/db";

/**
 * These are real integration tests against a running Postgres instance
 * (not mocked) — run `docker compose up -d postgres && npx prisma
 * migrate dev` first. See README "Testing" section.
 */
describe("Auth flow", () => {
  const email = `test-${Date.now()}@festival.test`;
  const password = "Passw0rd!";
  let accessToken: string;
  let refreshCookie: string;

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it("registers a new user and returns an access token + refresh cookie", async () => {
    const res = await request(app).post("/auth/register").send({ email, password });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(res.body.role).toBe("PARTICIPANT");

    const cookies = res.headers["set-cookie"] as unknown as string[];
    expect(cookies?.some((c) => c.startsWith("brand_festival_rt="))).toBe(true);

    accessToken = res.body.accessToken;
    refreshCookie = cookies.find((c) => c.startsWith("brand_festival_rt="))!;
  });

  it("rejects duplicate registration", async () => {
    const res = await request(app).post("/auth/register").send({ email, password });
    expect(res.status).toBe(409);
  });

  it("rejects login with the wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email, password: "wrong-password" });
    expect(res.status).toBe(401);
  });

  it("logs in with the correct password", async () => {
    const res = await request(app).post("/auth/login").send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toEqual(expect.any(String));
  });

  it("rejects an unauthenticated request to a protected route", async () => {
    const res = await request(app).get("/profile");
    expect(res.status).toBe(401);
  });

  it("allows a protected route with a valid access token", async () => {
    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.onboardingComplete).toBe(false);
  });

  it("rotates the refresh token and returns a new access token", async () => {
    const res = await request(app).post("/auth/refresh").set("Cookie", refreshCookie);

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toEqual(expect.any(String));

    // Rotation means the OLD refresh token is now revoked and unusable.
    const reused = await request(app).post("/auth/refresh").set("Cookie", refreshCookie);
    expect(reused.status).toBe(401);
  });

  it("logs out and revokes the refresh token", async () => {
    const login = await request(app).post("/auth/login").send({ email, password });
    const cookies = login.headers["set-cookie"] as unknown as string[];
    const cookie = cookies.find((c) => c.startsWith("brand_festival_rt="))!;

    const logoutRes = await request(app).post("/auth/logout").set("Cookie", cookie);
    expect(logoutRes.status).toBe(204);

    const refreshAfterLogout = await request(app)
      .post("/auth/refresh")
      .set("Cookie", cookie);
    expect(refreshAfterLogout.status).toBe(401);
  });
});
