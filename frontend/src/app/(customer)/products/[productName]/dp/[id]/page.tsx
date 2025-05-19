"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/app/redux";
import RelatedProducts from "@/app/(components)/RelatedProducts";
import AddToCartSection from "@/app/(components)/Cart";
import ReviewsSection from "@/app/(components)/Review";
import ProductDetailsSection from "@/app/(components)/ProductDetails";
import ProductImageZoom from "@/app/(components)/ProductImageZoom";

// Product data
const products = [
  {
    id: 1,
    name: "Fashion Bags",
    price: 59.99,
    originalPrice: 79.99,
    image: "/images/bags.jpg",
    description: "Stylish and durable fashion bags for everyday use.",
    brand: "E-Shop",
    color: "Black",
    material: "Leather",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "12 x 8 x 4 inches",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Stylish design for everyday use.",
      "Durable leather material.",
      "Spacious compartments for all your essentials.",
      "Adjustable straps for comfort.",
    ],
  },
  {
    id: 2,
    name: "Stylish Glasses",
    price: 29.99,
    originalPrice: 39.99,
    image: "/images/glasses.jpg",
    description: "Trendy glasses to enhance your style.",
    brand: "E-Shop",
    color: "Black",
    material: "Plastic",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "5.5 x 2 x 1.5 inches",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Trendy design to enhance your style.",
      "Lightweight plastic frame.",
      "UV protection lenses.",
      "Comfortable fit for all-day wear.",
    ],
  },
  {
    id: 3,
    name: "Jackets",
    price: 89.99,
    originalPrice: 109.99,
    image: "/images/jackets.jpg",
    description: "Warm and fashionable jackets for all seasons.",
    brand: "E-Shop",
    color: "Navy Blue",
    material: "Polyester",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Warm and cozy for all seasons.",
      "Water-resistant polyester material.",
      "Multiple pockets for storage.",
      "Stylish design for casual wear.",
    ],
  },
  {
    id: 4,
    name: "Jeans",
    price: 49.99,
    originalPrice: 69.99,
    image: "/images/jeans.jpg",
    description: "Comfortable and stylish jeans for casual wear.",
    brand: "E-Shop",
    color: "Blue",
    material: "Denim",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Comfortable fit for all-day wear.",
      "Durable denim material.",
      "Classic blue color for versatility.",
      "Multiple pockets for convenience.",
    ],
  },
  {
    id: 5,
    name: "Shoes",
    price: 69.99,
    originalPrice: 89.99,
    image: "/images/shoes.jpg",
    description: "High-quality shoes for every occasion.",
    brand: "E-Shop",
    color: "Black",
    material: "Leather",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "High-quality leather material.",
      "Comfortable fit for every occasion.",
      "Non-slip sole for safety.",
      "Stylish design for formal and casual use.",
    ],
  },
  {
    id: 6,
    name: "Suits",
    price: 199.99,
    originalPrice: 249.99,
    image: "/images/suits.jpg",
    description: "Elegant suits for formal events.",
    brand: "E-Shop",
    color: "Black",
    material: "Wool",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Elegant design for formal events.",
      "High-quality wool material.",
      "Tailored fit for a sharp look.",
      "Breathable fabric for comfort.",
    ],
  },
  {
    id: 7,
    name: "Watches",
    price: 149.99,
    originalPrice: 199.99,
    image: "/images/suits.jpg",
    description: "Elegant watches for everyday use.",
    brand: "E-Shop",
    color: "Silver",
    material: "Stainless Steel",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "1.5 x 1.5 x 0.5 inches",
    batteryLife: "1 year",
    sensorType: "N/A",
    batteryDescription: "Replaceable coin cell",
    features: [
      "Elegant design for everyday use.",
      "Durable stainless steel material.",
      "Water-resistant up to 50 meters.",
      "Accurate timekeeping with quartz movement.",
    ],
  },
  {
    id: 8,
    name: "Hats",
    price: 24.99,
    originalPrice: 34.99,
    image: "/images/suits.jpg",
    description: "Stylish hats for all seasons.",
    brand: "E-Shop",
    color: "Gray",
    material: "Cotton",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Stylish design for all seasons.",
      "Comfortable cotton material.",
      "Adjustable strap for a perfect fit.",
      "Breathable fabric for warm weather.",
    ],
  },
  {
    id: 9,
    name: "T-shirts",
    price: 19.99,
    originalPrice: 29.99,
    image: "/images/suits.jpg",
    description: "Comfortable t-shirts for casual wear.",
    brand: "E-Shop",
    color: "White",
    material: "Cotton",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Comfortable fit for casual wear.",
      "Soft cotton material.",
      "Breathable fabric for all-day comfort.",
      "Classic white color for versatility.",
    ],
  },
  {
    id: 10,
    name: "Belts",
    price: 29.99,
    originalPrice: 39.99,
    image: "/images/suits.jpg",
    description: "Quality leather belts.",
    brand: "E-Shop",
    color: "Brown",
    material: "Leather",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "High-quality leather material.",
      "Durable and long-lasting.",
      "Adjustable buckle for a perfect fit.",
      "Classic brown color for versatility.",
    ],
  },
  {
    id: 11,
    name: "Socks",
    price: 9.99,
    originalPrice: 14.99,
    image: "/images/suits.jpg",
    description: "Comfortable socks for everyday use.",
    brand: "E-Shop",
    color: "Black",
    material: "Cotton Blend",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Comfortable fit for everyday use.",
      "Soft cotton blend material.",
      "Breathable fabric for all-day wear.",
      "Elastic cuff for a secure fit.",
    ],
  },
  {
    id: 12,
    name: "Scarves",
    price: 19.99,
    originalPrice: 29.99,
    image: "/images/suits.jpg",
    description: "Warm and stylish scarves for winter.",
    brand: "E-Shop",
    color: "Red",
    material: "Wool",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Warm and cozy for winter.",
      "Soft wool material.",
      "Stylish red color for a pop of style.",
      "Long length for versatile styling.",
    ],
  },
  {
    id: 13,
    name: "Gloves",
    price: 14.99,
    originalPrice: 24.99,
    image: "/images/suits.jpg",
    description: "Winter gloves for cold weather.",
    brand: "E-Shop",
    color: "Black",
    material: "Leather",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Warm and cozy for cold weather.",
      "Durable leather material.",
      "Soft lining for comfort.",
      "Grip-friendly design for practicality.",
    ],
  },
  {
    id: 14,
    name: "Swimwear",
    price: 34.99,
    originalPrice: 49.99,
    image: "/images/suits.jpg",
    description: "Stylish swimwear for beach days.",
    brand: "E-Shop",
    color: "Blue",
    material: "Polyester",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Stylish design for beach days.",
      "Quick-drying polyester material.",
      "Comfortable fit for swimming.",
      "Vibrant blue color for a bold look.",
    ],
  },
  {
    id: 15,
    name: "Sweaters",
    price: 49.99,
    originalPrice: 69.99,
    image: "/images/suits.jpg",
    description: "Warm sweaters for cold weather.",
    brand: "E-Shop",
    color: "Gray",
    material: "Wool",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Warm and cozy for cold weather.",
      "Soft wool material.",
      "Classic gray color for versatility.",
      "Comfortable fit for layering.",
    ],
  },
  {
    id: 16,
    name: "Coats",
    price: 129.99,
    originalPrice: 159.99,
    image: "/images/suits.jpg",
    description: "Winter coats for extreme cold.",
    brand: "E-Shop",
    color: "Black",
    material: "Polyester",
    compatibleDevices: "N/A",
    screenSize: "N/A",
    dimensions: "N/A",
    batteryLife: "N/A",
    sensorType: "N/A",
    batteryDescription: "N/A",
    features: [
      "Warm and cozy for extreme cold.",
      "Water-resistant polyester material.",
      "Hooded design for extra protection.",
      "Multiple pockets for storage.",
    ],
  },
];

// Mock data for reviews
const reviews = [
  {
    id: 1,
    reviewer: "John Doe",
    rating: 5,
    comment: "This jacket is amazing! Keeps me warm and looks stylish.",
    date: "March 15, 2025",
  },
  {
    id: 2,
    reviewer: "Jane Smith",
    rating: 4,
    comment: "Good quality, but the fit is a bit tight for me.",
    date: "March 10, 2025",
  },
  {
    id: 3,
    reviewer: "Alex Brown",
    rating: 3,
    comment: "Decent jacket, but the zipper feels a bit flimsy.",
    date: "March 5, 2025",
  },
];

const ProductDetails = () => {
  const params = useParams();
  const { id, productName } = params;

  // Get user from Redux store
  const user = useAppSelector((state) => state.global.currentUser);

  const rating = 4.3;
  const totalRatings = 10087;
  const ratingDistribution = [6657, 1513, 908, 303, 706]; // 5★, 4★, 3★, 2★, 1★

  // Find the product by ID - handle non-numeric ID safely
  const productId = id ? parseInt(id, 10) : null;
  const product = productId ? products.find((p) => p.id === productId) : null;

  if (!product || (productName && product.name.toLowerCase() !== productName)) {
    return (
      <div className={`min-h-screen`}>
        <main className="mainContainer mx-auto py-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Product Not Found
          </h1>
          <Link
            href="/"
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            Return to Home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="mainContainer mx-auto py-8 flex-grow">
        <div className="flex gap-8">
          {/* Left Section: Product Image with Zoom */}
          <ProductImageZoom imageSrc={product.image} imageAlt={product.name} />

          {/* Middle Section: Product Details - Now a separate component */}
          <ProductDetailsSection
            product={product}
            rating={rating}
            totalRatings={totalRatings}
            ratingDistribution={ratingDistribution}
          />

          {/* Right Section: Add to Cart/Buy Now */}
          <AddToCartSection product={product} />
        </div>

        {/* Seller Promotion Section */}
        <div className="mt-12">
          <p className="text-gray-600 dark:text-gray-300">
            New to Amazon: Introducing Michael Kors{" "}
            <Link href="#" className="text-blue-500 hover:underline">
              Shop now
            </Link>
          </p>
        </div>

        {/* Reviews Section */}
        <ReviewsSection
          rating={rating}
          totalRatings={totalRatings}
          ratingDistribution={ratingDistribution}
          reviews={reviews}
          user={user}
          productName={productName}
          id={id}
        />

        {/* Related Products Section */}
        <RelatedProducts products={products} />
      </main>
    </div>
  );
};

export default ProductDetails;
