import Contact from "../models/Contact.js";
import HttpError from "../helpers/HttpError.js";

// Функція для перевірки доступу до контактів
export const authorizeContactAccess = async (req, res, next) => {
  try {
    // Перевірка чи існує контакт з вказаним ID
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      throw new HttpError(404, "Contact not found");
    }

    next();
  } catch (error) {
    next(error);
  }
};
