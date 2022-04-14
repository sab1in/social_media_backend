const supertest = require("supertest");
const app = require("../index");

// test for login
describe("auth/login", () => {
  test("should return a token with status 200 when correct email and password is given", async () => {
    const response = await supertest(app).post("/auth/login").send({
      email: "test@test10.test",
      password: "test123",
    });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  describe("when incorrect email or passeord is given ", () => {
    test("should return a status 404 when email is incorrect", async () => {
      const response = await supertest(app).post("/auth/login").send({
        email: "email.test",
        password: "test123",
      });
      expect(response.status).toBe(400);
    });
    test("should return a status 404 when password is incorrect", async () => {
      const response = await supertest(app).post("/auth/login").send({
        email: "test@test10.test",
        password: "password",
      });
      expect(response.status).toBe(400);
    });
    test("should return a status 404 when both email and password are incorrect", async () => {
      const response = await supertest(app).post("/auth/login").send({
        email: "tddflksjlfkj@test.test",
        password: "password",
      });
      expect(response.status).toBe(400);
    });
  });

  describe("when email or password is not given", () => {
    test("should return a 400 status when password is not given", async () => {
      const response = await supertest(app).post("/auth/login").send({
        email: "test@test10.test",
      });
      expect(response.status).toBe(400);
    });
    test("should return a 400 status when email is not given", async () => {
      const response = await supertest(app).post("/auth/login").send({
        password: "test123",
      });
      expect(response.status).toBe(400);
    });
    test("should return a 400 status when both email and password is not given", async () => {
      const response = await supertest(app).post("/auth/login").send({});
      expect(response.status).toBe(400);
    });
  });
});

//test for register
describe("auth/register", () => {
  // test("should return a status 201 when correct email and password is given", async () => {
  //   const response = await supertest(app).post("/auth/register").send({
  //     username: "test111",
  //     email: "test@test122.test",
  //     password: "Test@123",
  //   });
  //   expect(response.status).toBe(201);
  // });
  test("should return a status 400 when already used email is sent with message `User already exists`", async () => {
    const response = await supertest(app).post("/auth/register").send({
      username: "test111",
      email: "test@test10.test",
      password: "test123",
    });
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("User already exists");
  });
  test("should return a status 400 when incorrect email or password is given", async () => {
    const response = await supertest(app).post("/auth/register").send({
      username: "test111",
      email: "test",
      password: "test123",
    });
    expect(response.status).toBe(400);
  });
});
