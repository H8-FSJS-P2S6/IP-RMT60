const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios"); // Untuk GitHub login
const client = new OAuth2Client();

class UserController {
  static async googleLogin(req, res) {
    try {
      const { googleToken } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      let user = await User.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        user = await User.create({
          username: payload.name,
          email: payload.email,
          password: payload.sub,
        });
      }

      const tokenPayload = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      const token = createToken(tokenPayload);
      res.status(200).json({
        access_token: token,
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async githubLogin(req, res) {
    try {
      const { code } = req.body;

      // Step 1: Tukar kode otorisasi dengan access token
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const { access_token } = tokenResponse.data;

      // Step 2: Gunakan access token untuk mendapatkan informasi user
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });

      const githubUser = userResponse.data;

      // Step 3: Email tidak selalu tersedia di GitHub API, coba ambil email
      let email;
      try {
        const emailsResponse = await axios.get(
          "https://api.github.com/user/emails",
          {
            headers: {
              Authorization: `token ${access_token}`,
            },
          }
        );

        // Cari email yang primary dan verified
        const primaryEmail = emailsResponse.data.find(
          (email) => email.primary && email.verified
        );
        email = primaryEmail
          ? primaryEmail.email
          : emailsResponse.data[0].email;
      } catch (error) {
        // Jika tidak bisa mendapatkan email, gunakan fallback
        email = `${githubUser.login}@github.com`;
      }

      // Step 4: Cari user dengan email tersebut atau buat user baru
      let user = await User.findOne({
        where: { email },
      });

      if (!user) {
        user = await User.create({
          username: githubUser.name || githubUser.login,
          email,
          password: githubUser.id.toString(), // Gunakan id GitHub sebagai password
        });
      }

      // Step 5: Buat token JWT
      const tokenPayload = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      const token = createToken(tokenPayload);

      res.status(200).json({
        access_token: token,
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      console.error("GitHub login error:", error);
      res.status(500).json({ message: "Gagal login menggunakan GitHub" });
    }
  }

  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      const newUser = await User.create({
        username,
        email,
        password,
      });

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      const token = createToken(payload);

      res.status(200).json({
        access_token: token,
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateUser(req, res) {
    try {
      const userId = req.user.id;
      const { username, email } = req.body;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      const updateFields = {};

      if (username) updateFields.username = username;
      if (email) updateFields.email = email;

      if (Object.keys(updateFields).length === 0) {
        return res
          .status(400)
          .json({ message: "Tidak ada data yang diupdate" });
      }

      await user.update(updateFields);

      res.status(200).json({
        message: "User berhasil diupdate",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}

module.exports = UserController;
