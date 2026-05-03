process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../src/app");
const AppDataSource = require("../src/config/data-source");

describe("POST /users Integration Test", () => {
  let userRepository;

  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "123456"
  };

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    userRepository = AppDataSource.getRepository("User");

    await userRepository.delete({
      email: testUser.email
    });
  });

  afterEach(async () => {
    await userRepository.delete({
      email: testUser.email
    });
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  test("should create a new user and store it in PostgreSQL database", async () => {
    const response = await request(app)
      .post("/users")
      .send(testUser);

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User registered successfully");

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.name).toBe(testUser.name);
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user.role).toBe("customer");

    const userInDatabase = await userRepository.findOne({
      where: {
        email: testUser.email
      }
    });

    expect(userInDatabase).not.toBeNull();
    expect(userInDatabase.name).toBe(testUser.name);
    expect(userInDatabase.email).toBe(testUser.email);

    expect(userInDatabase.password).not.toBe(testUser.password);
  });
});