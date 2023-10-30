const request = require("supertest");
const app = require("../routes/userRegister.js");

describe("User Registration API Tests", () => {
  it("should return 201 for successful registration", async () => {
    const response = await request(app).post("/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "securepassword",
      registrationType: "single",
      attendees: [],
    });

    expect(response.status).toBe(201);
  });
});
