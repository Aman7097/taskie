// __tests__/taskRoutes.test.js

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const taskRoutes = require("../src/routes/taskRoutes");
const Task = require("../src/models/TaskModel");
const User = require("../src/models/UserModel"); // Assuming you have a User model
const jwt = require("jsonwebtoken"); // For creating test tokens

let mongoServer;
const app = express();

app.use(express.json());
app.use("/api/tasks", taskRoutes);

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
  await Task.deleteMany({});
  await User.deleteMany({});
});

// Helper function to create a test user and generate a token
async function createUserAndGetToken() {
  const user = new User({
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "password123",
  });
  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "testsecret",
    { expiresIn: "1h" }
  );
  return { user, token };
}

describe("Task Routes", () => {
  let token;
  let userId;

  beforeEach(async () => {
    const testUser = await createUserAndGetToken();
    token = testUser.token;
    userId = testUser.user._id;
  });

  describe("GET /api/tasks/getAll", () => {
    it("should get all tasks for authenticated user", async () => {
      await Task.create([
        { title: "Task 1", owner: userId },
        { title: "Task 2", owner: userId },
      ]);

      const response = await request(app)
        .get("/api/tasks/getAll")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should get a specific task", async () => {
      const task = await Task.create({ title: "Specific Task", owner: userId });

      const response = await request(app)
        .get(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe("Specific Task");
    });

    it("should return 404 for non-existent task", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/tasks/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("POST /api/tasks/create", () => {
    it("should create a new task", async () => {
      const newTask = {
        title: "New Task",
        description: "Task description",
        status: "To Do",
      };

      const response = await request(app)
        .post("/api/tasks/create")
        .set("Authorization", `Bearer ${token}`)
        .send(newTask);

      expect(response.statusCode).toBe(201);
      expect(response.body.title).toBe("New Task");

      const savedTask = await Task.findById(response.body._id);
      expect(savedTask).not.toBeNull();
    });
  });

  describe("PUT /api/tasks/update/:id", () => {
    it("should update a task", async () => {
      const task = await Task.create({
        title: "Original Title",
        owner: userId,
      });

      const response = await request(app)
        .put(`/api/tasks/update/${task._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Title" });

      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe("Updated Title");

      const updatedTask = await Task.findById(task._id);
      expect(updatedTask.title).toBe("Updated Title");
    });
  });

  describe("DELETE /api/tasks/delete/:id", () => {
    it("should delete a task", async () => {
      const task = await Task.create({
        title: "Task to Delete",
        owner: userId,
      });

      const response = await request(app)
        .delete(`/api/tasks/delete/${task._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(204);

      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });
  });
});
