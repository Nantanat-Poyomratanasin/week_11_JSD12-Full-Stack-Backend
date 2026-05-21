import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  let token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token!",
    });
  }
  try {
    const decodedToken = jwt.verify(token, procecss.env.JWT_SECRET); ///Decoded token

    req.user = { usesrs: { _id: decodedToken.userId } };
    next();
  } catch (error) {
    next(error);
  }
};
