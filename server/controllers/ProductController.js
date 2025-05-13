const { Product, ProductImage, Category } = require("../models/index");
const { Op } = require("sequelize");
const qs = require("qs");

class ProductController {
  static async getProduct(req, res, next) {
    try {
      // /products?filter[categories]=1&q=Indo&page[number]=1&page[size]=10&sort[by]=title&sort[order]=asc
      const parsedQuery = qs.parse(req._parsedUrl.query);

      const { filter, q, page, sort } = parsedQuery;

      const categoryInclude = {
        model: Category,
        as: "Categories",
        attributes: ["name"],
        through: { attributes: [] },
      };

      const paramIncludeQuerySQL = [
        {
          model: ProductImage,
          as: "Images",
          attributes: ["image"],
        },
        categoryInclude,
      ];

      const paramQuerySQL = {
        include: paramIncludeQuerySQL,
        limit: 20,
        offset: 0,
        where: {},
      };

      if (q) {
        paramQuerySQL.where.name = {
          [Op.iLike]: `%${q}%`,
        };
      }

      if (filter && filter.categories) {
        categoryInclude.where = {
          id: filter.categories.split(","),
        };
      }

      if (page) {
        if (page.size) {
          paramQuerySQL.limit = page.size;
        }

        if (page.number) {
          paramQuerySQL.offset =
            page.number * paramQuerySQL.limit - paramQuerySQL.limit;
        }
      }

      if (sort) {
        paramQuerySQL.order = [[sort.by, sort.order]];
      }

      const { rows, count } = await Product.findAndCountAll(paramQuerySQL);

      res.status(200).json({
        data: rows,
        totalPages: Math.ceil(count / paramQuerySQL.limit),
        currentPage: Number(page?.number || 1),
        totalData: count,
        dataPerPage: +paramQuerySQL.limit,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      if (!req.params.id || isNaN(req.params.id)) {
        throw { name: "BadRequest", message: "id is not valid" };
      }

      const product = await Product.findOne({
        include: [
          {
            model: ProductImage,
            as: "Images",
            attributes: ["image"],
          },
          {
            model: Category,
            as: "Categories",
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
        where: {
          id: req.params.id,
        },
      });

      if (!product) {
        throw { name: "NotFound", message: `Product is not found` };
      }

      res.status(200).json({ data: product });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = ProductController;
