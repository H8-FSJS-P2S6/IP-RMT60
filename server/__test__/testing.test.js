const request = require("supertest");
const express = require("express");
const app = require("../app");
const { sequelize } = require("../models");
const { User, XiaomiDevice, Favorite } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Mock untuk GoogleGenerativeAI
jest.mock("@google/generative-ai");

let access_token;

beforeAll(async () => {
  try {
    await Favorite.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await User.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await XiaomiDevice.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await User.create({
      username: "testuser",
      email: "test@example.com",
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await XiaomiDevice.create({
      key: "xiaomi-1",
      device_name: "Xiaomi Test Phone",
      device_image: "https://example.com/image.jpg",
      display_size: "6.5 inches",
      display_res: "1080 x 2400 pixels",
      camera: "48MP + 8MP + 5MP",
      video: "4K@30fps",
      ram: "6GB",
      chipset: "Snapdragon 732G",
      battery: "5000mAh",
      batteryType: "Li-Po",
      body: "Plastic back, plastic frame",
      os_type: "Android 11, MIUI 12",
      storage: "128GB",
      comment: "Excellent mid-range phone",
      price: 3000000,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await User.findOne({ where: { email: "test@example.com" } });
    access_token = createToken({ id: user.id, email: user.email });
  } catch (error) {
    console.error("Error in beforeAll:", error);
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe("User Authentication", () => {
  test("Register user baru dengan sukses", async () => {
    const response = await request(app).post("/register").send({
      username: "newuser",
      email: "new@example.com",
      password: "newpassword123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username", "newuser");
    expect(response.body).toHaveProperty("email", "new@example.com");
  });

  test("Gagal register karena email sudah digunakan", async () => {
    const response = await request(app).post("/register").send({
      username: "duplicateuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("Gagal register karena validasi Sequelize", async () => {
    const response = await request(app).post("/register").send({
      username: "",
      email: "invalid@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("Login dengan sukses", async () => {
    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(response.body).toHaveProperty("username", "testuser");
    access_token = response.body.access_token;
  });

  test("Gagal login karena data tidak lengkap", async () => {
    const response = await request(app).post("/login").send({
      email: "test@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Email and password are required"
    );
  });

  test("Gagal login karena password salah", async () => {
    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid password");
  });

  test("Gagal login karena email tidak ditemukan", async () => {
    const response = await request(app).post("/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  test("Google login error handling", async () => {
    const mockVerifyIdToken = jest
      .fn()
      .mockRejectedValue(new Error("Invalid token"));
    const mockOAuth2Client = {
      verifyIdToken: mockVerifyIdToken,
    };

    jest.mock("google-auth-library", () => ({
      OAuth2Client: jest.fn().mockImplementation(() => mockOAuth2Client),
    }));

    const response = await request(app).post("/login/google").send({
      googleToken: "invalid-token",
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");
  });

  test("Internal server error handling in register", async () => {
    jest.spyOn(User, "create").mockImplementationOnce(() => {
      throw new Error("Unexpected error");
    });

    const response = await request(app).post("/register").send({
      username: "erroruser",
      email: "error@example.com",
      password: "password123",
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });

  test("Internal server error handling in login", async () => {
    jest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("Unexpected error");
    });

    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });
});

describe("Public Routes", () => {
  test("Mendapatkan daftar device untuk public", async () => {
    const response = await request(app).get("/public/devices");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("device_name");
    expect(response.body[0]).toHaveProperty("price");
  });

  test("Mendapatkan daftar device dengan parameter query", async () => {
    const response = await request(app).get(
      "/public/devices?search=xiaomi&sort=price:asc&minPrice=1000000&maxPrice=5000000"
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Mendapatkan daftar device dengan sort tidak valid", async () => {
    const response = await request(app).get("/public/devices?sort=invalid:asc");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Mendapatkan daftar device dengan parameter minPrice saja", async () => {
    const response = await request(app).get("/public/devices?minPrice=1000000");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Mendapatkan daftar device dengan parameter maxPrice saja", async () => {
    const response = await request(app).get("/public/devices?maxPrice=5000000");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Mendapatkan detail device untuk public", async () => {
    const response = await request(app).get("/public/devices/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("device_name");
    expect(response.body).toHaveProperty("price");
    expect(response.body).toHaveProperty("camera");
  });

  test("Gagal mendapatkan detail device yang tidak ada untuk public", async () => {
    const response = await request(app).get("/public/devices/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Device tidak ditemukan");
  });

  test("Error handling pada public routes", async () => {
    jest.spyOn(XiaomiDevice, "findAll").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app).get("/public/devices");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });

  test("Error handling pada get device by id public route", async () => {
    jest.spyOn(XiaomiDevice, "findByPk").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app).get("/public/devices/1");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });
});

describe("Authenticated Endpoints", () => {
  test("Mendapatkan daftar device lengkap dengan sukses", async () => {
    const response = await request(app)
      .get("/devices")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("device_name");
    expect(response.body[0]).toHaveProperty("camera");
  });

  test("Mendapatkan daftar device tanpa token", async () => {
    const response = await request(app).get("/devices");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("device_name");
    expect(response.body[0]).not.toHaveProperty("camera");
  });

  test("Error handling pada get devices authenticated route", async () => {
    jest.spyOn(XiaomiDevice, "findAll").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .get("/devices")
      .set("access_token", access_token);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });

  test("Mendapatkan detail device lengkap dengan sukses", async () => {
    const response = await request(app)
      .get("/devices/1")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("device_name");
    expect(response.body).toHaveProperty("camera");
  });

  test("Mendapatkan detail device tanpa token", async () => {
    const response = await request(app).get("/devices/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("device_name");
    expect(response.body).not.toHaveProperty("camera");
  });

  test("Gagal mendapatkan detail device yang tidak ada", async () => {
    const response = await request(app)
      .get("/devices/999")
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Device tidak ditemukan");
  });

  test("Error handling pada get device by id authenticated route", async () => {
    jest.spyOn(XiaomiDevice, "findByPk").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .get("/devices/1")
      .set("access_token", access_token);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });

  test("Menambahkan device ke favorit dengan sukses", async () => {
    await Favorite.destroy({ where: { XiaomiDeviceId: 1 } });

    const response = await request(app)
      .post("/favorites/1")
      .set("access_token", access_token);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Device berhasil ditambahkan ke favorit"
    );
  });

  test("Gagal menambahkan device ke favorit karena sudah ada", async () => {
    const response = await request(app)
      .post("/favorites/1")
      .set("access_token", access_token);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Device sudah ada di daftar favorit Anda"
    );
  });

  test("Gagal menambahkan device yang tidak ada ke favorit", async () => {
    const response = await request(app)
      .post("/favorites/999")
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Device tidak ditemukan");
  });

  test("Error handling pada add to favorites route", async () => {
    jest.spyOn(XiaomiDevice, "findByPk").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .post("/favorites/1")
      .set("access_token", access_token);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });

  test("Mendapatkan daftar favorit dengan sukses", async () => {
    const response = await request(app)
      .get("/favorites")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("Error handling pada get favorites route", async () => {
    jest.spyOn(Favorite, "findAll").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .get("/favorites")
      .set("access_token", access_token);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });

  test("Menghapus device dari favorit dengan sukses", async () => {
    // Tambahkan kembali ke favorit untuk dihapus
    await Favorite.create({
      UserId: 1,
      XiaomiDeviceId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .delete("/favorites/1")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Device berhasil dihapus dari favorit"
    );
  });

  test("Gagal menghapus device dari favorit karena tidak ada", async () => {
    const response = await request(app)
      .delete("/favorites/1")
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Device tidak ada di daftar favorit Anda"
    );
  });

  test("Error handling pada remove from favorites route", async () => {
    jest.spyOn(Favorite, "findOne").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .delete("/favorites/1")
      .set("access_token", access_token);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });

  test("Update user profile dengan sukses", async () => {
    const response = await request(app)
      .put("/users/update")
      .set("access_token", access_token)
      .send({
        username: "updateduser",
        email: "updated@example.com",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User berhasil diupdate");
    expect(response.body.user).toHaveProperty("username", "updateduser");
    expect(response.body.user).toHaveProperty("email", "updated@example.com");
  });

  test("Gagal update user profile tanpa data", async () => {
    const response = await request(app)
      .put("/users/update")
      .set("access_token", access_token)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Tidak ada data yang diupdate"
    );
  });

  test("Gagal update user profile dengan user tidak ditemukan", async () => {
    jest.spyOn(User, "findByPk").mockResolvedValueOnce(null);

    const response = await request(app)
      .put("/users/update")
      .set("access_token", access_token)
      .send({
        username: "newname",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User tidak ditemukan");

    jest.restoreAllMocks();
  });

  test("Gagal update user profile karena validasi Sequelize", async () => {
    const validationError = {
      name: "SequelizeValidationError",
      errors: [{ message: "Username tidak boleh kosong" }],
    };

    jest.spyOn(User.prototype, "update").mockRejectedValueOnce(validationError);

    const response = await request(app)
      .put("/users/update")
      .set("access_token", access_token)
      .send({
        username: "",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Username tidak boleh kosong"
    );

    jest.restoreAllMocks();
  });

  test("Gagal update user profile karena unique constraint Sequelize", async () => {
    const uniqueError = {
      name: "SequelizeUniqueConstraintError",
      errors: [{ message: "Email sudah digunakan" }],
    };

    jest.spyOn(User.prototype, "update").mockRejectedValueOnce(uniqueError);

    const response = await request(app)
      .put("/users/update")
      .set("access_token", access_token)
      .send({
        email: "test@example.com",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email sudah digunakan");

    jest.restoreAllMocks();
  });

  test("Error handling pada update user route", async () => {
    jest.spyOn(User, "findByPk").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .put("/users/update")
      .set("access_token", access_token)
      .send({
        username: "newname",
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });
});

describe("Authentication Middleware", () => {
  test("Mengakses endpoint publik tanpa token", async () => {
    const response = await request(app).get("/public/devices");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Gagal mengakses endpoint terproteksi dengan token invalid", async () => {
    const response = await request(app)
      .get("/favorites")
      .set("access_token", "invalid-token");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal mengakses endpoint dengan user tidak ditemukan", async () => {
    const invalidToken = createToken({
      id: 999,
      email: "nonexist@example.com",
    });

    const response = await request(app)
      .get("/favorites")
      .set("access_token", invalidToken);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  test("Error handling di middleware authentication", async () => {
    jest.spyOn(User, "findByPk").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .get("/favorites")
      .set("access_token", access_token);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");

    jest.restoreAllMocks();
  });
});

describe("AI Endpoint", () => {
  beforeEach(() => {
    // Mock untuk Google Generative AI
    const mockModel = {
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => "Ini adalah respons dari Gemini API",
        },
      }),
    };

    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue(mockModel),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Mendapatkan respons AI dengan sukses", async () => {
    const response = await request(app).post("/ai").send({
      prompt: "Apa kelebihan HP Xiaomi?",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("response");
  });

  test("Gagal mendapatkan respons AI tanpa prompt", async () => {
    const response = await request(app).post("/ai").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Prompt diperlukan");
  });

  test("Error handling pada AI endpoint", async () => {
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockImplementation(() => {
        throw new Error("API error");
      }),
    }));

    const response = await request(app).post("/ai").send({
      prompt: "Apa kelebihan HP Xiaomi?",
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");
  });
});

describe("Testing Routes", () => {
  test("Health check endpoint", async () => {
    const response = await request(app).get("/testing/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "API is running");
  });
});

describe("Error Handler", () => {
  test("Global error handler", async () => {
    // Buat router express sederhana dengan error handler dari app.js
    const router = express();
    router.use((req, res, next) => {
      next(new Error("Test error"));
    });

    // Ekstrak error handler dari app.js
    const errorHandler = app._router.stack
      .filter((layer) => layer.handle && layer.handle.length === 4)
      .pop().handle;

    // Tambahkan error handler ke router
    router.use(errorHandler);

    // Test
    const response = await request(router).get("/");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");
  });
});

describe("App Error Handling", () => {
  // Simulasi error ketika server dijalankan
  test("Server error handler", () => {
    const mockServer = {
      listen: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "error") {
          // Simulasi error EADDRINUSE
          callback({ code: "EADDRINUSE" });
        }
        return mockServer;
      }),
    };

    const originalListen = app.listen;
    app.listen = jest.fn().mockReturnValue(mockServer);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Jalankan aplikasi
    const serverInstance = app.listen(3000, () => {});

    // Verifikasi bahwa on("error") dipanggil
    expect(serverInstance.on).toHaveBeenCalledWith(
      "error",
      expect.any(Function)
    );
    expect(consoleSpy).toHaveBeenCalled();

    // Simulasi error lain
    serverInstance.on.mock.calls[0][1]({ code: "OTHER_ERROR" });
    expect(consoleSpy).toHaveBeenCalledTimes(2);

    // Restore mocks
    consoleSpy.mockRestore();
    app.listen = originalListen;
  });

  test("Gemini API initialization error", () => {
    // Backup environment variable
    const originalApiKey = process.env.GOOGLE_API_KEY;

    // Simulasikan environment variable tidak ada
    delete process.env.GOOGLE_API_KEY;

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const processExitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation(() => {});

    // Require app.js lagi untuk menjalankan code initialization
    jest.isolateModules(() => {
      try {
        require("../app");
      } catch (error) {
        // Catch any errors
      }
    });

    // Restore environment variable
    process.env.GOOGLE_API_KEY = originalApiKey;

    consoleSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
