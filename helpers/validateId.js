import HttpError from "./HttpError.js";
import mongoose from "mongoose";

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return next(new HttpError(404, "Not found"));
  }
  next();
};

export default validateId;
