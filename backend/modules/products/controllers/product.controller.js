import db from "../../../config/database.config.js";
import errorResponse from "../../../utils/errorResponse.js";
import successResponse from "../../../utils/successResponse.js";
import { redis } from "../../../lib/redis.js";
import cloudinary from "../../../lib/cloudinary.js";

const Product = db.model.Product;

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse ? cloudinaryResponse.secure_url : "",
      category,
    });

    successResponse(
      201,
      "SUCCESS",
      {
        product,
      },
      res
    );
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while creating the product",
      res
    );
  }
};

export const findAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); //find all products
    successResponse(
      200,
      "SUCCESS",
      {
        products,
      },
      res
    );
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while finding products",
      res
    );
  }
};

export const findAllFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products"); //find featured products in redis
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    //if featured products not in redis
    featuredProducts = await Product.find({ isFeatured: true }).lean(); //find all featured products from database
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }
    //after finding store in redis
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    successResponse(
      200,
      "SUCCESS",
      {
        featuredProducts,
      },
      res
    );
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while finding featured products",
      res
    );
  }
};

export const findAllRecommendedProducts = async (req, res) => {
  try {
    const recommendedProducts = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    successResponse(
      200,
      "SUCCESS",
      {
        recommendedProducts,
      },
      res
    );
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while finding recommended products",
      res
    );
  }
};

export const findProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    successResponse(
      200,
      "SUCCESS",
      {
        products,
      },
      res
    );
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message ||
        "Some error occurred while finding the category of products",
      res
    );
  }
};

export const toggleFeaturedProducts = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();

      successResponse(
        200,
        "SUCCESS",
        {
          updatedProduct,
        },
        res
      );
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message ||
        "Some error occurred while updating the product to featured",
      res
    );
  }
};

export const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the product by ID
    const product = await Product.findById(id);
    if (product) {
      // Only delete the product
      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0]; // this will get the id of the image
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (error) {}
      }
      await Product.findByIdAndDelete(id);

      return res.json({
        data: product,
        message: "Product deleted successfully!",
      });
    } else {
      res.status(404).json({
        message: `Cannot delete Product with id=${id}. Product not found!`,
      });
    }
  } catch (err) {
    errorHandler(
      500,
      "ERROR",
      err.message || "Some error occurred while deleting the product.",
      res
    );
  }
};

export const uploadImage = async (req, res) => {
  try {
    let imageFiles = req.file;

    res.send(imageFiles);
  } catch (err) {
    errorHandler(
      500,
      "ERROR",
      err.message ||
        "Some error occurred while Finding Users By Date_of_Birth.",
      res
    );
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred in featured product update cache",
      res
    );
  }
}
