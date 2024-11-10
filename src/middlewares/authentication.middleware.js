import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "./errorHandller.middleware.js";
import User from "../db/models/user.model.js";

const auth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.token && req.headers.token.startsWith("Bearer ")) {
    token = req.headers.token.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    return next(new ApiError("You are not login please login first", 401));
  }
  const decoded = jwt.decode(token, process.env.TOKEN_SECRET);
  console.log(decoded);

  if (!decoded.userId) {
    return next(new ApiError("Invalid token payload", 401));
  }
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }
  req.user = currentUser;
  next();
});

export default auth;
