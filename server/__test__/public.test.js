const {
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, Category, Product, sequelize } = require("../models/index");
const { hashPassword } = require("../helpers/bcrypt");

let productNumber1Size20;
const number = 1;
const size = 20;
const limit = size;
const offset = number * limit - limit;
let product;

beforeAll(async () => {
  const users = require("../data/users.json").map((el) => {
    el.createdAt = el.updatedAt = new Date();
    el.password = hashPassword(el.password);
    return el;
  });
  await sequelize.queryInterface.bulkInsert("Users", users);

  const categories = require("../data/categories.json").map((el) => {
    el.createdAt = el.updatedAt = new Date();
    return el;
  });
  await sequelize.queryInterface.bulkInsert("Categories", categories);

  const products = require("../data/products.json").map((el) => {
    el.createdAt = el.updatedAt = new Date();
    return el;
  });
  await sequelize.queryInterface.bulkInsert("Products", products);

  productNumber1Size20 = await Product.findAll({
    include: {
      model: Category,
      as: "Categories",
    },
    limit,
    offset,
  });

  product = await Product.findOne();
});

afterAll(async () => {
  await Product.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await Category.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("Endpoint List pada public site, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("a. Berhasil mendapatkan Entitas Utama tanpa menggunakan query filter parameter", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data", expect.any(Array));
    expect(response.body).toHaveProperty("totalPages", expect.any(Number));
    expect(response.body).toHaveProperty("currentPage", expect.any(Number));
    expect(response.body).toHaveProperty("totalData", expect.any(Number));
    expect(response.body).toHaveProperty("dataPerPage", expect.any(Number));
  });

  test("b. Berhasil mendapatkan Entitas Utama dengan 1 query filter parameter", async () => {
    const response = await request(app).get(`/products?filter[categories]=1`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data", expect.any(Array));
    expect(response.body).toHaveProperty("totalPages", expect.any(Number));
    expect(response.body).toHaveProperty("currentPage", expect.any(Number));
    expect(response.body).toHaveProperty("totalData", expect.any(Number));
    expect(response.body).toHaveProperty("dataPerPage", expect.any(Number));
  });

  test("c. Berhasil mendapatkan Entitas Utama serta panjang yang sesuai ketika memberikan page tertentu (cek pagination-nya)", async () => {
    const response = await request(app).get(
      `/products?page[number]=${number}&page[size]=${size}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data", expect.any(Array));
    expect(response.body).toHaveProperty("totalPages", expect.any(Number));
    expect(response.body).toHaveProperty("currentPage", expect.any(Number));
    expect(response.body).toHaveProperty("totalData", expect.any(Number));
    expect(response.body).toHaveProperty("dataPerPage", expect.any(Number));
    expect(response.body.data.length).toBe(productNumber1Size20.length);
  });
});

describe("Endpoint Detail pada public site, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("a. Berhasil mendapatkan 1 Entitas Utama sesuai dengan params id yang diberikan", async () => {
    const response = await request(app).get(`/products/${product.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", product.id);
    expect(response.body).toHaveProperty("data.name", product.name);
    expect(response.body).toHaveProperty(
      "data.description",
      product.description
    );
    expect(response.body).toHaveProperty("data.price", product.price);
    expect(response.body).toHaveProperty("data.stock", product.stock);
    expect(response.body).toHaveProperty("data.UserId", product.UserId);
    expect(response.body).toHaveProperty(
      "data.createdAt",
      product.createdAt.toISOString()
    );
    expect(response.body).toHaveProperty(
      "data.updatedAt",
      product.updatedAt.toISOString()
    );
  });

  test("b. Gagal mendapatkan Entitas Utama karena params id yang diberikan tidak ada di database / invalid", async () => {
    const response = await request(app).get("/products/1000");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product is not found");
  });
});
