const {
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const {
  User,
  Category,
  Role,
  UserRole,
  sequelize,
} = require("../models/index");
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

let access_token;
let existingCategory;

beforeAll(async () => {
  const users = require("../data/users.json").map((el) => {
    el.createdAt = el.updatedAt = new Date();
    el.password = hashPassword(el.password);
    return el;
  });
  await sequelize.queryInterface.bulkInsert("Users", users);

  const dataRoles = require("../data/roles.json").map((el) => {
    el.createdAt = el.updatedAt = new Date();
    return el;
  });
  await sequelize.queryInterface.bulkInsert("Roles", dataRoles);

  const userRoles = require("../data/userRoles.json").map((el) => {
    el.createdAt = el.updatedAt = new Date();
    return el;
  });
  await sequelize.queryInterface.bulkInsert("UserRoles", userRoles);

  const categories = require("../data/categories.json").map((el) => {
    el.createdAt = el.updatedAt = new Date();
    return el;
  });
  await sequelize.queryInterface.bulkInsert("Categories", categories);

  const user = await User.findOne({
    include: {
      model: Role,
      as: "Roles",
      attributes: ["name"],
    },
    where: { email: "andika@email.com" },
  });
  const roles = Array.isArray(user.Roles)
    ? user.Roles.map((role) => role.name)
    : [];
  access_token = signToken({
    id: user.id,
    roles: roles,
  });

  existingCategory = await Category.findOne();
});

afterAll(async () => {
  await Category.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await UserRole.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await Role.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

const category = {
  name: "New Category",
};

const updateCategory = {
  name: "Uniq Category",
};

describe("Create, perlu melakukan pengecekan pada status dan response ketika", () => {
  test("a. Berhasil membuat entitas support", async () => {
    const response = await request(app)
      .post("/admin/categories")
      .set("Authorization", `Bearer ${access_token}`)
      .send(category);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data.id", expect.any(Number));
    expect(response.body).toHaveProperty("data.name", category.name);
    expect(response.body).toHaveProperty("data.createdAt", expect.any(String));
    expect(response.body).toHaveProperty("data.updatedAt", expect.any(String));
  });

  test("b. Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app)
      .post("/admin/categories")
      .send(category);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .post("/admin/categories")
      .set("Authorization", `Bearer ${access_token}invalid`)
      .send(category);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("d. Gagal ketika request body tidak sesuai (validation required)", async () => {
    const response = await request(app)
      .post("/admin/categories")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        names: "Apa saja makanan enak selain sawi ?",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Category name is required"
    );
  });
});

describe("Update PUT, perlu melakukan pengecekan pada status dan response ketika", () => {
  test("a. Berhasil mengupdate data Entitas Utama berdasarkan params id yang diberikan", async () => {
    const response = await request(app)
      .put(`/admin/categories/${existingCategory.id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send(updateCategory);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", existingCategory.id);
    expect(response.body).toHaveProperty("data.name", updateCategory.name);
    expect(response.body).toHaveProperty("data.createdAt", expect.any(String));
    expect(response.body).toHaveProperty("data.updatedAt", expect.any(String));
  });

  test("b. Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app)
      .put(`/admin/categories/${existingCategory.id}`)
      .send(category);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .put(`/admin/categories/${existingCategory.id}`)
      .set("Authorization", `Bearer ${access_token}invalid`)
      .send(category);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("d. Gagal karena id identity yang dikirim tidak terdapat di database", async () => {
    const response = await request(app)
      .put("/admin/categories/1000")
      .set("Authorization", `Bearer ${access_token}`)
      .send(category);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Category not found");
  });
});

describe("4. Read, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("a. Berhasil mendapatkan data Entitas Support", async () => {
    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data", expect.any(Array));
  });
});
