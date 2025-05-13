const CategoryController = require("../controllers/CategoryController");

const router = require("express").Router();
// const UserController = require("../controllers/UserController");
// const ProductController = require("../controllers/ProductController");

// router.get("/users", UserController.getUsers);
// router.get("/users/:id", UserController.getUserById);
// router.post("/users/:id", UserController.createUser);
// router.put("/users/:id", UserController.updateUserById);
// router.delete("/users/:id", UserController.deleteUserById);

// router.get("/products", ProductController.getProducts);
// router.get("/products/:id", ProductController.getProductById);
// router.post("/products/:id", ProductController.createProduct);
// router.put("/products/:id", ProductController.updateProductById);
// router.delete("/products/:id", ProductController.deleteProductById);

router.post("/categories", CategoryController.createCategory);
router.put("/categories/:id", CategoryController.updateCategoryById);

module.exports = router;
