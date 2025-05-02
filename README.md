# 🚛 HacTruck

HacTruck adalah platform web yang mempertemukan supir truk dan pengguna umum untuk mempermudah pengangkutan muatan. Dengan fitur-fitur seperti pencarian, filter, AI rekomendasi truk, dan Google Maps, pengguna dapat dengan cepat menemukan solusi pengiriman yang efisien.

## 🛠️ Teknologi yang Digunakan

### Backend:
- **Express.js**
- **PostgreSQL** + Sequelize ORM
- **Google OAuth2**
- **JWT Authentication**
- **Swagger (API Documentation)**
- **Jest + Supertest (Testing)**
- **Google Maps**
- **Whatsapp Api**
- **AI Helper** (Rekomendasi jenis truk)

### Frontend:
- **Vite + React**
- **Redux Toolkit (State Management)**
- **React Router DOM**
- **TailwindCSS / Bootstrap**
- **Google Maps Embed**
- **WhatsApp Link Button**

## 📁 Struktur Proyek

### Backend
```
hac-truck-server/
├── config/
├── controllers/
├── middlewares/
├── migrations/
├── models/
├── routes/
├── seeders/
├── services/
├── tests/
├── app.js
├── server.js
├── .env
├── package.json
└── README.md
```

### Frontend
```
hac-truck-client/
├── src/
│   ├── api/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
└── vite.config.js
```

## 🔐 Fitur Autentikasi
- Google OAuth2 Login
- Role: `driver` dan `user`
- JWT untuk akses endpoint yang dilindungi

## 🚚 Fitur Backend
- CRUD Postingan Muatan (by Driver)
- Filtering & Sorting Endpoint
- AI Truck Recommendation (`POST /ai-recommend`)
- Integrasi Raja Ongkir API
- Google Maps support (via koordinat)
- Swagger API Docs (`/api-docs`)
- Testing: Jest + Supertest
- CORS Enabled

## 🌐 Fitur Frontend
- Google Login (popup atau redirect)
- Form Posting untuk Supir
- Halaman Pencarian (dengan filter: jenis truk, berat, harga)
- AI Assistant: rekomendasi jenis truk berdasarkan berat
- WhatsApp button langsung ke driver
- Embedded Google Maps
- State Management via Redux Toolkit
- Fetching data via `createAsyncThunk`

## 🧪 Testing

### Backend:
- Test endpoint login, CRUD postingan, AI recommend
- Mocking: Auth, RajaOngkir

### Frontend:
- Component testing (React Testing Library)
- Redux async thunk test

## 📦 Setup & Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/username/hac-truck.git
cd hac-truck
```

### 2. Setup Backend
```bash
cd hac-truck-server
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

### 3. Setup Frontend
```bash
cd hac-truck-client
npm install
npm run dev
```

## 🧠 AI Truck Recommender
Input berat → Output rekomendasi jenis truk (misal: pickup, box, trailer) berdasarkan rentang bobot preset atau model sederhana (bisa dikembangkan dengan OpenAI API / TensorFlow.js)

## 🗂️ API Endpoints (Contoh)
| Method | Endpoint              | Deskripsi                    |
|--------|-----------------------|------------------------------|
| POST   | /login-google         | Login via Google OAuth       |
| GET    | /posts                | Ambil semua muatan           |
| POST   | /posts                | Tambah muatan (Driver only) |
| GET    | /posts/:id            | Detail muatan                |
| PUT    | /posts/:id            | Edit muatan                  |
| DELETE | /posts/:id            | Hapus muatan                 |
| POST   | /ai-recommend         | Rekomendasi truk via berat   |

## 📄 Lisensi
MIT License

## 🙌 Kontribusi
Pull Request dan Issue sangat terbuka! Pastikan sesuai dengan konvensi dan gunakan branch-feature.

## 📍 Tim Developer
- 💻 Backend: iqballfarhan
- 💻 Frontend: iqballfarhan
- 🧠 AI Helper: iqballfarhan
