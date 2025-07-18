import {
  SSLCommerzPayment,
  sslCommerzConfig,
} from "../../../../libs/sslcommerz.js";

export default async function handler(
  req,
  res
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      orderData,
      customerData,
      orderItems,
    } = req.body;

    // Generate unique transaction ID
    const tran_id = `TXN_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const data = {
      total_amount: orderData.total,
      currency: "BDT", // or 'USD' depending on your requirement
      tran_id: tran_id,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/ipn`,
      shipping_method: "Courier",
      product_name: `Order #${tran_id}`,
      product_category: "Electronic",
      product_profile: "general",

      // Customer information
      cus_name: `${customerData.firstName} ${customerData.lastName}`,
      cus_email: customerData.email,
      cus_add1: customerData.address,
      cus_add2: customerData.address,
      cus_city: customerData.city,
      cus_state: customerData.city,
      cus_postcode: "1000",
      cus_country: customerData.country,
      cus_phone: customerData.phone,
      cus_fax: customerData.phone,

      // Shipping information
      ship_name: `${customerData.firstName} ${customerData.lastName}`,
      ship_add1: customerData.address,
      ship_add2: customerData.address,
      ship_city: customerData.city,
      ship_state: customerData.city,
      ship_postcode: "1000",
      ship_country:
        customerData.country,

      // Optional parameters
      value_a:
        JSON.stringify(orderItems), // Store order items for reference
      value_b:
        customerData.orderNotes || "",
      value_c: "",
      value_d: "",
    };

    const sslcz = new SSLCommerzPayment(
      sslCommerzConfig.store_id,
      sslCommerzConfig.store_passwd,
      sslCommerzConfig.is_live
    );

    const apiResponse =
      await sslcz.init(data);

    if (
      apiResponse.status === "SUCCESS"
    ) {
      res.status(200).json({
        success: true,
        redirectUrl:
          apiResponse.redirectGatewayURL,
        sessionkey:
          apiResponse.sessionkey,
        transaction_id: tran_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message:
          "Payment initialization failed",
        error: apiResponse,
      });
    }
  } catch (error) {
    console.error(
      "SSLCommerz initialization error:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
