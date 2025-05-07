if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const authentication = require("./middlewares/authentication");
const UserController = require("./controllers/UserController");
const Controller = require("./controllers/Controller");
const PubController = require("./controllers/PubController");
const testingRoutes = require("./routes/testing");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Pastikan API key tersedia
if (!process.env.GOOGLE_API_KEY) {
  console.error("GOOGLE_API_KEY tidak ditemukan di environment variables");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function geminiApi({ prompt }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Modifikasi prompt untuk membatasi konteks ke HP Xiaomi saja
    const enhancedPrompt = `
    Kamu adalah asisten yang hanya membahas tentang HP Xiaomi.
    Berikan jawaban hanya seputar HP Xiaomi saja.
    Jangan pernah menyebutkan atau merekomendasikan merk smartphone lain atau gadget lain selain Xiaomi.
    Jika ditanya tentang merk lain, arahkan pembicaraan kembali ke Xiaomi.

    Fokuskan jawaban pada informasi spesifikasi, fitur, dan kelebihan HP Xiaomi sesuai dengan kebutuhan pengguna.
    Berikan jawaban singkat, padat, dan informatif.

    Pertanyaan: ${prompt}
    `;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in geminiApi:", error);
    throw error;
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Testing routes
app.use("/testing", testingRoutes);

// Route untuk public (tanpa login)
app.get("/public/devices", PubController.getAllDevices);
app.get("/public/devices/:id", PubController.getDeviceById);

// Route untuk AI
app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt diperlukan" });
    }
    const response = await geminiApi({ prompt });
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error in AI route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route untuk user (login & register)
app.post("/register", UserController.register);
app.post("/login", UserController.login);
app.post("/login/google", UserController.googleLogin);
app.post("/login/github", UserController.githubLogin);

// Middleware authentication untuk semua rute dibawah ini
app.use(authentication);

// Routes that require authentication
app.get("/devices", Controller.getAllDevices);
app.get("/devices/:id", Controller.getDeviceById);
app.put("/users/update", UserController.updateUser);
app.post("/favorites/:XiaomiDeviceId", Controller.addToFavorites);
app.get("/favorites", Controller.getFavorites);
app.delete("/favorites/:XiaomiDeviceId", Controller.removeFromFavorites);

// Error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server with error handling
app
  .listen(port, () => {
    console.log(`Server successfully running on port ${port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${port} is already in use. Please use a different port or free up port ${port}.`
      );
    } else {
      console.error("Failed to start server:", err);
    }
  });

module.exports = app;
