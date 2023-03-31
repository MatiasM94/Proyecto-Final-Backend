import Route from "./router.js";
import ProductManager from "../dao/managerMongo/product.managerMongo.js";

const productsClass = new ProductManager();

class ProductRouter extends Route {
  init() {
    this.get("/", ["user", "admin"], async (req, res) => {
      try {
        const { limit, page, sort, ...rest } = req.query;
        const productsInDb = await productsClass.find(limit, page, sort, rest);

        if (productsInDb.docs.length > 0) {
          res.sendSucces({ status: "Sucess", payload: productsInDb });
          return;
        }
        res.sendUserError(`peticion include an incorrect parm`, rest);
      } catch (error) {
        res.sendServerError(error.message);
      }
    });

    this.get("/:pid", ["user", "admin"], async (req, res) => {
      try {
        const { pid } = req.params;

        const filteredProduct = await productsClass.findById(pid);

        if (filteredProduct) return res.send({ filteredProduct });

        res.send({ Error: `The product with id ${pid} does not exist` });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.post("/allproducts", ["admin"], async (req, res) => {
      try {
        const productsFileManager = new FilesManager("Products.json");
        const products = await productsFileManager.loadItems();

        await Product.insertMany(products);

        res.status(201).json({ message: "products added successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.post("/", ["admin"], async (req, res) => {
      try {
        const {
          title,
          description,
          price,
          status,
          thumbnails,
          code,
          stock,
          category,
        } = req.body;
        const newProduct = {
          title,
          description,
          price,
          status,
          thumbnails,
          code,
          stock,
          category,
        };
        if (
          title &&
          description &&
          price &&
          status &&
          thumbnails &&
          code &&
          stock &&
          category
        ) {
          return (await productsClass.create(newProduct))
            ? res.status(201).json({ message: "Added product" })
            : res.status(400).json({ message: "Repeat product" });
        }

        res
          .status(400)
          .json({ message: "Invalid format, missing fields to complete" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.put("/:pid", ["admin"], async (req, res) => {
      try {
        const { pid } = req.params;
        console.log(pid);
        const {
          title,
          description,
          price,
          status,
          thumbnails,
          code,
          stock,
          category,
        } = req.body;
        const updatedProduct = {
          title,
          description,
          price,
          status,
          thumbnails,
          code,
          stock,
          category,
        };

        if (
          title &&
          description &&
          price &&
          status &&
          thumbnails &&
          code &&
          stock &&
          category
        ) {
          const updateProduct = await productsClass.updateOne(
            pid,
            updatedProduct
          );

          return updateProduct
            ? res.sendSucces({ message: "successfully modified product" })
            : res.sendUserError({
                message: `The product with id ${pid} does not exist`,
              });
        }

        res.sendUserError({
          message: "Invalid format, missing fields to complete",
        });
      } catch (error) {
        res.sendServerError({ error: error.message });
      }
    });

    this.delete("/delete/:pid", ["admin"], async (req, res) => {
      try {
        const { pid } = req.params;
        const deleteProduct = await productsClass.deleteOne(pid);

        if (deleteProduct) {
          return res.sendSucces({ message: "Product successfully removed" });
        }

        res.sendUserError({
          message: `The product with id ${pid} does not exist`,
        });
      } catch (error) {
        res.sendServerError({ error: error.message });
      }
    });

    this.delete("/allproducts", ["admin"], async (req, res) => {
      try {
        await productsClass.deleteMany();

        res.sendSucces({ message: "all products have been removed" });
      } catch (error) {
        res.sendServerError({ error: error.message });
      }
    });
  }
}

export default ProductRouter;
