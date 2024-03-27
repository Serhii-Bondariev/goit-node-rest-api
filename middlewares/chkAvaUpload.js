// import HttpError from "../helpers/HttpError.js";

// const chkAvaUpload = (req, res, next) => {
//   if (!req.file) {
//     return next(new HttpError(400, "Avatar not found"));
//   }

//   next();
// };

// export default chkAvaUpload;

import HttpError from "../helpers/HttpError.js";

const chkAvaUpload = (req, res, next) => {
  // Перевіряємо, чи є поле для завантаження аватарки у запиті
  if (req.file && req.file.fieldname === "avatar") {
    // Якщо аватарка знайдена, продовжуємо виконання наступних мідлварів
    next();
  } else {
    // Якщо аватарка не знайдена, просто продовжуємо виконання наступних мідлварів
    console.log("Avatar not found in the request");
    next();
  }
};

export default chkAvaUpload;
