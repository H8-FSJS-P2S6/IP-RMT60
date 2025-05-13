const {
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, sequelize } = require("../models/index");
const { hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

let access_token;

const newUser = {
  name: "new user",
  email: "newuser@email.com",
  password: "password",
};

beforeAll(async () => {
  const users = require("../data/users.json").map((el) => {
    el.createdAt = el.updatedAt = new Date();
    el.password = hashPassword(el.password);
    return el;
  });
  await sequelize.queryInterface.bulkInsert("Users", users);

  const user = await User.findOne({
    where: {
      email: "admin@email.com",
    },
  });
  access_token = signToken({ id: user.id });
});

afterAll(async () => {
  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("Login, perlu melakukan pengecekan pada status dan response ketika", () => {
  test("a. Berhasil login dan mengakses access_token", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@email.com",
      password: "password",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });

  test("b. Email tidak diberikan / tidak diinput", async () => {
    const response = await request(app).post("/login").send({
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "email is required");
  });

  test("c. Password tidak diberikan / tidak diinput", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@email.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "password is required");
  });

  test("d. Email diberikan invalid / tidak terdaftar", async () => {
    const response = await request(app).post("/login").send({
      email: "adminemail.com",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "invalid email format");
  });

  test("e. Password diberikan salah / tidak match", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@email.com",
      password: "passwordsalah",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});

describe("2. /register, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("a. Berhasil menambahkan user", async () => {
    const response = await request(app).post("/register").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data", expect.any(Object));
    expect(response.body).toHaveProperty("data.id", expect.any(Number));
    expect(response.body).toHaveProperty("data.name", newUser.name);
    expect(response.body).toHaveProperty("data.email", newUser.email);
    expect(response.body).toHaveProperty("data.createdAt", expect.any(String));
    expect(response.body).toHaveProperty("data.updatedAt", expect.any(String));
  });

  test("b. Email tidak diberikan / tidak diinput", async () => {
    const response = await request(app).post("/register").send({
      name: newUser.name,
      password: newUser.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("c. Password tidak diberikan / tidak diinput", async () => {
    const response = await request(app).post("/register").send({
      name: newUser.name,
      email: newUser.email,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("d. Email diberikan string kosong", async () => {
    const response = await request(app).post("/register").send({
      name: newUser.name,
      email: "",
      password: newUser.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid email format");
  });

  test("e. Password diberikan string kosong", async () => {
    const response = await request(app).post("/register").send({
      name: newUser.name,
      email: newUser.email,
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Password must be at least 8 characters"
    );
  });

  test("f. Email sudah terdaftar", async () => {
    const response = await request(app).post("/register").send({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "email must be unique");
  });

  test("g. Format Email salah / invalid", async () => {
    const response = await request(app).post("/register").send({
      name: newUser.name,
      email: "invalidemail@email",
      password: newUser.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid email format");
  });
});
