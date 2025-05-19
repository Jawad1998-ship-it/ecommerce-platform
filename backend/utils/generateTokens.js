import jwt from "jsonwebtoken";

const generateToken = (userId, userRole, userVerified) => {
  const accessToken = jwt.sign(
    { userId, userRole, userVerified },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { userId, userRole, userVerified },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};

export default generateToken;
