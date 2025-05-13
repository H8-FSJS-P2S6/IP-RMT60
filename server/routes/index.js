const router = require("express").Router();
const routerSeller = require("./seller");
const routerAdmin = require("./admin");
const PublicController = require("../controllers/PublicController");
const authentication = require("../middleware/authentication");
const { guardAdmin, guardSeller } = require("../middleware/authorization");
const ProductController = require("../controllers/ProductController");
const CategoryController = require("../controllers/CategoryController");

// Auth
router.post("/register", PublicController.register);
router.post("/login", PublicController.login);
router.post("/login/google", PublicController.googleLogin);
router.post("/chat", PublicController.chatWithAI);
router.get("/favicon.ico", (req, res, next) => res.status(204).end());

router.get("/products", ProductController.getProduct);
router.get("/products/:id", ProductController.getProductById);
router.get("/categories", CategoryController.getCategories);

router.use(authentication);
router.post("/shipping", PublicController.createShippingAddress);
router.use("/admin", guardAdmin, routerAdmin);
router.use("/seller", guardSeller, routerSeller);

module.exports = router;
