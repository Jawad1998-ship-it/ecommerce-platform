import db from "../../../config/database.config.js";
import errorResponse from "../../../utils/errorResponse.js";
import successResponse from "../../../utils/successResponse.js";
import { redis } from "../../../lib/redis.js";
import cloudinary from "../../../lib/cloudinary.js";

const Product = db.model.Product;

export const createProduct = async (
  req,
  res
) => {
  try {
    const {
      category,
      name,
      description,
      price,
      originalPrice,
      brand,
      attributes,
      features,
      imageFiles,
      isInStock,
    } = req.body;

    // Validation
    if (
      !name ||
      !description ||
      !price ||
      !brand ||
      !category ||
      !features
    ) {
      return errorResponse(
        400,
        "VALIDATION_ERROR",
        "Please provide all required fields: name, description, price, brand, category, and features.",
        res
      );
    }

    if (
      !imageFiles ||
      imageFiles.length === 0
    ) {
      return errorResponse(
        400,
        "VALIDATION_ERROR",
        "At least one product image is required.",
        res
      );
    }

    // Validate image data structure
    const isValidImageData =
      imageFiles.every(
        (img) =>
          img.url &&
          img.publicId &&
          typeof img.url === "string"
      );

    if (!isValidImageData) {
      return errorResponse(
        400,
        "VALIDATION_ERROR",
        "Invalid image data format.",
        res
      );
    }

    // Validate attributes
    if (
      !attributes ||
      typeof attributes !== "object" ||
      Object.keys(attributes).length ===
        0
    ) {
      return errorResponse(
        400,
        "VALIDATION_ERROR",
        "Attributes must be a non-empty object.",
        res
      );
    }

    // Validate attribute values
    const isValidAttributes =
      Object.values(attributes).every(
        (value) =>
          Array.isArray(value)
            ? value.every(
                (item) =>
                  typeof item ===
                  "string"
              )
            : typeof value === "string"
      );

    if (!isValidAttributes) {
      return errorResponse(
        400,
        "VALIDATION_ERROR",
        "Attribute values must be strings or arrays of strings.",
        res
      );
    }

    // Extract image URLs for database storage
    const imageUrls = imageFiles.map(
      (img) => img.url
    );

    const newProductData = {
      category,
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice
        ? parseFloat(originalPrice)
        : null,
      brand,
      attributes, // Now stored as a Map
      features: Array.isArray(features)
        ? features
        : [],
      isInStock: Boolean(isInStock),
      imageUrls,
      cloudinaryPublicIds:
        imageFiles.map(
          (img) => img.publicId
        ),
    };

    const product =
      await Product.create(
        newProductData
      );

    successResponse(
      201,
      "SUCCESS",
      {
        product,
        message:
          "Product created successfully",
      },
      res
    );
  } catch (err) {
    console.error(
      "Error creating product:",
      err
    );
    errorResponse(
      500,
      "SERVER_ERROR",
      err.message ||
        "An unexpected error occurred while creating the product.",
      res
    );
  }
};

// Update product with image handling
export const updateProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      brand,
      color,
      material,
      compatibleDevices,
      screenSize,
      dimensions,
      features,
      imageFiles,
      isInStock,
      originalPrice,
      batteryLife,
      sensorType,
      batteryDescription,
    } = req.body;

    const existingProduct =
      await Product.findById(id);
    if (!existingProduct) {
      return errorResponse(
        404,
        "NOT_FOUND",
        "Product not found.",
        res
      );
    }

    const updateData = {
      name,
      description,
      price: price
        ? parseFloat(price)
        : existingProduct.price,
      brand,
      color,
      material,
      compatibleDevices,
      screenSize,
      dimensions,
      features: Array.isArray(features)
        ? features
        : existingProduct.features,
      isInStock:
        isInStock !== undefined
          ? Boolean(isInStock)
          : existingProduct.isInStock,
      originalPrice: originalPrice
        ? parseFloat(originalPrice)
        : existingProduct.originalPrice,
      batteryLife,
      sensorType,
      batteryDescription,
    };

    // Handle image updates if provided
    if (
      imageFiles &&
      Array.isArray(imageFiles)
    ) {
      const isValidImageData =
        imageFiles.every(
          (img) =>
            img.url &&
            img.publicId &&
            typeof img.url === "string"
        );

      if (!isValidImageData) {
        return errorResponse(
          400,
          "VALIDATION_ERROR",
          "Invalid image data format.",
          res
        );
      }

      updateData.imageUrls =
        imageFiles.map(
          (img) => img.url
        );
      updateData.cloudinaryPublicIds =
        imageFiles.map(
          (img) => img.publicId
        );
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    successResponse(
      200,
      "SUCCESS",
      {
        product: updatedProduct,
        message:
          "Product updated successfully",
      },
      res
    );
  } catch (err) {
    console.error(
      "Error updating product:",
      err
    );
    errorResponse(
      500,
      "SERVER_ERROR",
      err.message ||
        "An unexpected error occurred while updating the product.",
      res
    );
  }
};

// Delete image from Cloudinary
export const deleteImage = async (
  req,
  res
) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return errorResponse(
        400,
        "VALIDATION_ERROR",
        "Public ID is required.",
        res
      );
    }

    const result =
      await cloudinary.uploader.destroy(
        publicId
      );

    if (result.result === "ok") {
      successResponse(
        200,
        "SUCCESS",
        {
          message:
            "Image deleted successfully",
          publicId,
        },
        res
      );
    } else {
      errorResponse(
        400,
        "DELETE_FAILED",
        "Failed to delete image from Cloudinary.",
        res
      );
    }
  } catch (err) {
    console.error(
      "Error deleting image:",
      err
    );
    errorResponse(
      500,
      "SERVER_ERROR",
      err.message ||
        "An unexpected error occurred while deleting the image.",
      res
    );
  }
};

// Delete product with cleanup
export const deleteProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const product =
      await Product.findById(id);
    if (!product) {
      return errorResponse(
        404,
        "NOT_FOUND",
        "Product not found.",
        res
      );
    }

    // Delete associated images from Cloudinary
    if (
      product.cloudinaryPublicIds &&
      product.cloudinaryPublicIds
        .length > 0
    ) {
      try {
        await Promise.all(
          product.cloudinaryPublicIds.map(
            (publicId) =>
              cloudinary.uploader.destroy(
                publicId
              )
          )
        );
      } catch (cloudinaryError) {
        console.error(
          "Error deleting images from Cloudinary:",
          cloudinaryError
        );
        // Continue with product deletion even if image cleanup fails
      }
    }

    await Product.findByIdAndDelete(id);

    successResponse(
      200,
      "SUCCESS",
      {
        message:
          "Product and associated images deleted successfully",
      },
      res
    );
  } catch (err) {
    console.error(
      "Error deleting product:",
      err
    );
    errorResponse(
      500,
      "SERVER_ERROR",
      err.message ||
        "An unexpected error occurred while deleting the product.",
      res
    );
  }
};

// Get all products with pagination and filtering
export const getProducts = async (
  req,
  res
) => {
  try {
    const {
      page = 1,
      limit = 10,
      brand,
      color,
      minPrice,
      maxPrice,
      inStock,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    // Build filter query
    if (brand)
      query.brand = {
        $regex: brand,
        $options: "i",
      };
    if (color)
      query.color = {
        $regex: color,
        $options: "i",
      };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice)
        query.price.$gte =
          parseFloat(minPrice);
      if (maxPrice)
        query.price.$lte =
          parseFloat(maxPrice);
    }
    if (inStock !== undefined)
      query.isInStock =
        inStock === "true";
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip =
      (parseInt(page) - 1) *
      parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] =
      sortOrder === "desc" ? -1 : 1;

    const [products, total] =
      await Promise.all([
        Product.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Product.countDocuments(query),
      ]);

    const totalPages = Math.ceil(
      total / parseInt(limit)
    );

    successResponse(
      200,
      "SUCCESS",
      {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage:
            parseInt(page) < totalPages,
          hasPrevPage:
            parseInt(page) > 1,
        },
      },
      res
    );
  } catch (err) {
    console.error(
      "Error fetching products:",
      err
    );
    errorResponse(
      500,
      "SERVER_ERROR",
      err.message ||
        "An unexpected error occurred while fetching products.",
      res
    );
  }
};

// Get single product
export const getProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const product =
      await Product.findById(id).lean();
    if (!product) {
      return errorResponse(
        404,
        "NOT_FOUND",
        "Product not found.",
        res
      );
    }

    successResponse(
      200,
      "SUCCESS",
      { product },
      res
    );
  } catch (err) {
    console.error(
      "Error fetching product:",
      err
    );
    errorResponse(
      500,
      "SERVER_ERROR",
      err.message ||
        "An unexpected error occurred while fetching the product.",
      res
    );
  }
};

export const findAllProducts = async (
  req,
  res
) => {
  try {
    const products = await Product.find(
      {}
    );
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
        "Some error occurred while finding products",
      res
    );
  }
};

export const findAllFeaturedProducts =
  async (req, res) => {
    try {
      let featuredProducts =
        await redis.get(
          "featured_products"
        ); //find featured products in redis
      if (featuredProducts) {
        return res.json(
          JSON.parse(featuredProducts)
        );
      }
      //if featured products not in redis
      featuredProducts =
        await Product.find({
          isFeatured: true,
        }).lean(); //find all featured products from database
      if (!featuredProducts) {
        return res.status(404).json({
          message:
            "No featured products found",
        });
      }
      //after finding store in redis
      await redis.set(
        "featured_products",
        JSON.stringify(featuredProducts)
      );
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
        err.message ||
          "Some error occurred while finding featured products",
        res
      );
    }
  };

export const findAllRecommendedProducts =
  async (req, res) => {
    try {
      const recommendedProducts =
        await Product.aggregate([
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
        err.message ||
          "Some error occurred while finding recommended products",
        res
      );
    }
  };

export const findProductsByCategory =
  async (req, res) => {
    const { category } = req.params;
    try {
      const products =
        await Product.find({
          category,
        });
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

export const toggleFeaturedProducts =
  async (req, res) => {
    const id = req.params.id;
    try {
      const product =
        await Product.findById(id);
      if (product) {
        product.isFeatured =
          !product.isFeatured;
        const updatedProduct =
          await product.save();
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
        res.status(404).json({
          message: "Product not found",
        });
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

export const deleteOne = async (
  req,
  res
) => {
  try {
    const id = req.params.id;

    // Find the product by ID
    const product =
      await Product.findById(id);
    if (product) {
      // Only delete the product
      if (product.image) {
        const publicId = product.image
          .split("/")
          .pop()
          .split(".")[0]; // this will get the id of the image
        try {
          await cloudinary.uploader.destroy(
            `products/${publicId}`
          );
        } catch (error) {}
      }
      await Product.findByIdAndDelete(
        id
      );

      return res.json({
        data: product,
        message:
          "Product deleted successfully!",
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
      err.message ||
        "Some error occurred while deleting the product.",
      res
    );
  }
};

export const uploadImage = async (
  req,
  res
) => {
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
    const featuredProducts =
      await Product.find({
        isFeatured: true,
      }).lean();
    await redis.set(
      "featured_products",
      JSON.stringify(featuredProducts)
    );
  } catch (error) {
    errorResponse(
      500,
      "ERROR",
      err.message ||
        "Some error occurred in featured product update cache",
      res
    );
  }
}

export const tryOn = (req, res) => {
  // AI model logic will go here
  res.status(200).json({
    message:
      "This is a placeholder for the try-on feature.",
    imageUrl:
      "https://via.placeholder.com/512", // Placeholder image
  });
};
