export default async function handler(
  req,
  res
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({
        error: "Method not allowed",
      });
  }

  try {
    const {
      val_id,
      store_amount,
      store_passwd,
      tran_id,
    } = req.body;

    // Verify the payment with SSLCommerz
    const sslcz = new SSLCommerzPayment(
      process.env.SSLCOMMERZ_STORE_ID,
      process.env.SSLCOMMERZ_STORE_PASSWORD,
      process.env.NODE_ENV ===
        "production"
    );

    const validation =
      await sslcz.validate({
        val_id: val_id,
        store_id:
          process.env
            .SSLCOMMERZ_STORE_ID,
        store_passwd:
          process.env
            .SSLCOMMERZ_STORE_PASSWORD,
        v1: val_id,
        v2: store_amount,
        format: "json",
      });

    if (validation.status === "VALID") {
      // Update order status in your database
      // await updateOrderStatus(tran_id, 'paid');

      res
        .status(200)
        .json({
          message:
            "Payment validated successfully",
        });
    } else {
      res
        .status(400)
        .json({
          error:
            "Payment validation failed",
        });
    }
  } catch (error) {
    console.error(
      "IPN validation error:",
      error
    );
    res
      .status(500)
      .json({
        error: "Internal server error",
      });
  }
}
