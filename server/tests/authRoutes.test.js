// __tests__/authRoutes.test.js

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const authRoutes = require("../src/routes/authRoutes");
const User = require("../src/models/UserModel");
const jwt = require("jsonwebtoken");

let mongoServer;
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Authentication Routes", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/api/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("firstName", "John");

      const user = await User.findOne({ email: "john@example.com" });
      expect(user).not.toBeNull();
    });

    it("should not register a user with an existing email", async () => {
      await User.create({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "password123",
      });

      const response = await request(app).post("/api/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "jane@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "User already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login an existing user", async () => {
      await User.create({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "password123",
      });

      const response = await request(app).post("/api/auth/login").send({
        email: "jane@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("email", "jane@example.com");
    });

    it("should not login with incorrect credentials", async () => {
      await User.create({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "password123",
      });

      const response = await request(app).post("/api/auth/login").send({
        email: "jane@example.com",
        password: "wrongpassword",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
  });

  // If you have implemented Google OAuth, you can add tests for it here
  // However, testing OAuth flows often requires mocking external services
  // and is generally more complex
});
