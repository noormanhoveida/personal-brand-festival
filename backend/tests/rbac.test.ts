import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/db";

describe("RBAC on admin routes", () => {
  const email = `rbac-test-${Date.now()}@festival.test`;
  const password = "Passw0rd!";
  let accessToken: string;

  beforeAll(async () => {
    const res = await request(app).post("/auth/register").send({ email, password });
    accessToken = res.body.accessToken; // registers as PARTICIPANT by default
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it("blocks a PARTICIPANT from the admin overview endpoint", async () => {
    const res = await request(app)
      .get("/admin/overview")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(403);
  });

  it("blocks an unauthenticated request outright", async () => {
    const res = await request(app).get("/admin/overview");
    expect(res.status).toBe(401);
  });
});
