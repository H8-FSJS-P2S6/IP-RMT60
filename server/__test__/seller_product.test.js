const {
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, Product, Role, UserRole, sequelize } = require("../models/index");
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

let access_token;
let sellerProduct;
let newSellerProduct;

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

  const products = require("../data/products.json").map((el) => {
    el.createdAt = el.updatedAt = new Date();
    return el;
  });
  await sequelize.queryInterface.bulkInsert("Products", products);

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

  sellerProduct = await Product.findOne({
    where: {
      UserId: user.id,
    },
  });

  newSellerProduct = await Product.findOne({
    order: [["name", "DESC"]],
    where: {
      UserId: user.id,
    },
  });
});

afterAll(async () => {
  await Product.destroy({
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

const product = {
  name: "Makanan Enak",
  description: "Apa saja makanan enak selain sawi ?",
  price: 12000,
  stock: 20,
};

describe("Create, perlu melakukan pengecekan pada status dan response ketika", () => {
  test("a. Berhasil membuat entitas utama", async () => {
    const response = await request(app)
      .post("/seller/products")
      .set("Authorization", `Bearer ${access_token}`)
      .send(product);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data.id", expect.any(Number));
    expect(response.body).toHaveProperty("data.name", product.name);
    expect(response.body).toHaveProperty(
      "data.description",
      product.description
    );
    expect(response.body).toHaveProperty("data.price", product.price);
    expect(response.body).toHaveProperty("data.stock", product.stock);
    expect(response.body).toHaveProperty("data.UserId", expect.any(Number));
    expect(response.body).toHaveProperty("data.createdAt", expect.any(String));
    expect(response.body).toHaveProperty("data.updatedAt", expect.any(String));
  });

  test("b. Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).post("/seller/products").send(product);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .post("/seller/products")
      .set("Authorization", `Bearer ${access_token}invalid`)
      .send(product);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("d. Gagal ketika request body tidak sesuai (validation required)", async () => {
    const response = await request(app)
      .post("/seller/products")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Apa saja makanan enak selain sawi ?",
        price: 12000,
        stock: 20,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "description is required");
  });
});

describe("Update PUT, perlu melakukan pengecekan pada status dan response ketika", () => {
  test("a. Berhasil mengupdate data Entitas Utama berdasarkan params id yang diberikan", async () => {
    const response = await request(app)
      .put(`/seller/products/${sellerProduct.id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send(product);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", sellerProduct.id);
    expect(response.body).toHaveProperty("data.name", product.name);
    expect(response.body).toHaveProperty(
      "data.description",
      product.description
    );
    expect(response.body).toHaveProperty("data.price", product.price);
    expect(response.body).toHaveProperty("data.stock", product.stock);
    expect(response.body).toHaveProperty("data.UserId", expect.any(Number));
    expect(response.body).toHaveProperty("data.createdAt", expect.any(String));
    expect(response.body).toHaveProperty("data.updatedAt", expect.any(String));
  });

  test("b. Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app)
      .put(`/seller/products/${sellerProduct.id}`)
      .send(product);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .put(`/seller/products/${sellerProduct.id}`)
      .set("Authorization", `Bearer ${access_token}invalid`)
      .send(product);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("d. Gagal karena id identity yang dikirim tidak terdapat di database", async () => {
    const response = await request(app)
      .put("/seller/products/1000")
      .set("Authorization", `Bearer ${access_token}`)
      .send(product);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found");
  });

  test("e. Gagal menjalankan fitur ketika seller mengolah data entity yang bukan miliknya", async () => {
    const response = await request(app)
      .put(`/seller/products/${sellerProduct.id + 1}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send(product);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found");
  });

  test("f. Gagal ketika request body yang diberika tidak sesuai", async () => {
    const response = await request(app)
      .put(`/seller/products/${sellerProduct.id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        description: "Apa saja makanan enak selain sawi ?",
        price: 12000,
        stock: 20,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "name is required");
  });
});

describe("Delete, perlu melakukan pengecekan pada status dan response ketika", () => {
  test("a. Berhasil menghapus data Entitas Utama berdasarkan params id yang diberikan", async () => {
    const response = await request(app)
      .delete(`/seller/products/${sellerProduct.id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      `${product.name} success to delete`
    );
  });

  test("b. Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app)
      .delete(`/seller/products/${sellerProduct.id}`)
      .send();

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .delete(`/seller/products/${sellerProduct.id}`)
      .set("Authorization", `Bearer ${access_token}invalid`)
      .send();

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("d. Gagal karena id identity yang dikirim tidak terdapat di database", async () => {
    const response = await request(app)
      .delete("/seller/products/1000")
      .set("Authorization", `Bearer ${access_token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found");
  });

  test("e. Gagal menjalankan fitur ketika seller mengolah data entity yang bukan miliknya", async () => {
    const response = await request(app)
      .delete(`/seller/products/${sellerProduct.id + 1}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found");
  });
});

describe("4. Read, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("a. Berhasil mendapatkan data Entitas Utama", async () => {
    const response = await request(app)
      .get("/seller/products")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data", expect.any(Array));
    expect(response.body).not.toHaveProperty("totalPages");
    expect(response.body).not.toHaveProperty("currentPage");
    expect(response.body).not.toHaveProperty("totalData");
    expect(response.body).not.toHaveProperty("dataPerPage");
  });
  test("b. Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).get("/seller/products");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
  test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .get("/seller/products")
      .set("Authorization", `Bearer ${access_token}invalid`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});

describe("5. Read Detail, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("a. Berhasil mendapatkan 1 Entitas Utama sesuai dengan params id yang diberikan", async () => {
    const response = await request(app)
      .get(`/seller/products/${newSellerProduct.id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data", expect.any(Object));
    expect(response.body).toHaveProperty("data.id", newSellerProduct.id);
    expect(response.body).toHaveProperty("data.name", newSellerProduct.name);
    expect(response.body).toHaveProperty(
      "data.description",
      newSellerProduct.description
    );
    expect(response.body).toHaveProperty("data.price", newSellerProduct.price);
    expect(response.body).toHaveProperty("data.stock", newSellerProduct.stock);
    expect(response.body).toHaveProperty(
      "data.UserId",
      newSellerProduct.UserId
    );
    expect(response.body).toHaveProperty(
      "data.createdAt",
      newSellerProduct.createdAt.toISOString()
    );
    expect(response.body).toHaveProperty("data.updatedAt", expect.any(String));
  });
  test("b. Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).get(
      `/seller/products/${sellerProduct.id}`
    );

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
  test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .get(`/seller/products/${sellerProduct.id}`)
      .set("Authorization", `Bearer ${access_token}invalid`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
  test("d. Gagal mendapatkan Entitas Utama karena params id yang diberikan tidak ada di database / invalid", async () => {
    const response = await request(app)
      .get(`/seller/products/1000`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found");
  });
});
