import errorResponse from "../../../utils/errorResponse.js";
import successResponse from "../../../utils/successResponse.js";
import Payment from "../../payments/models/payment.model.js";
import Product from "../../products/models/product.model.js";
import User from "../../users/models/user.model.js";

const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Payment.aggregate([
    {
      $group: {
        _id: null, // if all documents are grouped together
        totalSales: {
          $sum: 1,
        },
        totalRevenue: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);
  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };
  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              date: "$createdAt",
              format: "%Y-%m-%d",
            },
          },
          sales: {
            $sum: 1,
          },
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    const dateArray = getDatesInRange(startDate, endDate);
    return dateArray?.map((date) => {
      const foundData = dailySalesData?.find((item) => item._id === date);
      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60);
    const dailySalesData = await getDailySalesData(startDate, endDate);

    successResponse(
      200,
      "SUCCESS",
      {
        analyticsData,
        dailySalesData,
      },
      res
    );
  } catch (error) {
    errorResponse(500, "ERROR", "Error in analytics data", res);
  }
};
