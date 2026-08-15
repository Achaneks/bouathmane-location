/**
 * @jest-environment node
 */
import { GET, PATCH } from "@/app/api/settings/route";
import { db } from "@/lib/db";
import { auth } from "@/auth";

jest.mock("@/lib/db", () => ({
  db: {
    settings: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

const mockFindUnique = db.settings.findUnique as jest.Mock;
const mockUpdate = db.settings.update as jest.Mock;
const mockAuth = auth as jest.Mock;

const fakeSettings = {
  id: "singleton",
  phone: "+212 6 00 00 00 00",
  email: "contact@bouathmanelocation.com",
  tagline: "Luxury car rentals, redefined.",
  socialUrls: {},
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/settings", () => {
  it("returns 200 with the settings data", async () => {
    mockFindUnique.mockResolvedValue(fakeSettings);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(fakeSettings);
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: "singleton" } });
  });
});

describe("PATCH /api/settings", () => {
  it("returns 401 when there is no auth session", async () => {
    mockAuth.mockResolvedValue(null);

    const request = new Request("http://localhost/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: "+212 6 11 22 33 44",
        email: "new@bouathmanelocation.com",
        tagline: "New tagline",
        socialUrls: {},
      }),
    });

    const response = await PATCH(request);

    expect(response.status).toBe(401);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 when authenticated but the body is invalid", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1", email: "admin@bouathmanelocation.com" } });

    const request = new Request("http://localhost/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "x", email: "x" }),
    });

    const response = await PATCH(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Invalid settings payload" });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns 200 and updates the row when authenticated with a valid body", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1", email: "admin@bouathmanelocation.com" } });
    const updated = { ...fakeSettings, phone: "+212 6 11 22 33 44", tagline: "New tagline" };
    mockUpdate.mockResolvedValue(updated);

    const request = new Request("http://localhost/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: "+212 6 11 22 33 44",
        email: "contact@bouathmanelocation.com",
        tagline: "New tagline",
        socialUrls: { instagram: "https://instagram.com/bouathmane" },
      }),
    });

    const response = await PATCH(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(updated);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "singleton" },
      data: {
        phone: "+212 6 11 22 33 44",
        email: "contact@bouathmanelocation.com",
        tagline: "New tagline",
        socialUrls: { instagram: "https://instagram.com/bouathmane" },
      },
    });
  });
});
