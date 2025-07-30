import SsSslcommerz from "ss-sslcommerz";

const sslCommerzConfig = {
  store_id:
    process.env.SSLCOMMERZ_STORE_ID,
  store_passwd:
    process.env
      .SSLCOMMERZ_STORE_PASSWORD,
  is_live: false, // true for live, false for sandbox
};

export {
  SsSslcommerz,
  sslCommerzConfig,
};
