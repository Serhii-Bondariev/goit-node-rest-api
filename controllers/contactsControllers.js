import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  favoriteContactSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../models/Contact.js";
import mongoose from "mongoose";

export const getAllContacts = async (req, res) => {
  try {
    // Отримання параметрів пагінації з запиту
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100; // За замовчуванням 10 записів на сторінку

    // Обчислення значень skip та limit для запиту до бази даних
    const skip = (page - 1) * limit;

    // Отримання параметра фільтрації за улюбленими контактами
    const isFavorite = req.query.favorite === "true";

    // Умова для фільтрації за улюбленими контактами
    const filter = isFavorite ? { favorite: true } : {};

    // Запит до бази даних для отримання контактів з обмеженням за сторінкою, лімітом та фільтром
    const contacts = await Contact.find(filter).skip(skip).limit(limit);

    // Повернення результатів та інформації про пагінацію у відповідь
    res.status(200).json({
      page,
      limit,
      totalContacts: contacts.length, // Це може бути змінено на загальну кількість контактів у базі даних
      contacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFilteredContacts = async (req, res, next) => {
  try {
    const favorite = req.query.favorite;
    const filter = favorite ? { favorite: favorite === "true" } : {};
    const contacts = await Contact.find(filter).exec();

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new HttpError(404, "Not found");
    }

    const result = await contactsService.getOneContact(id);

    if (!result) {
      throw new HttpError(404, "Not found");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new HttpError(404, "Not found");
    }
    const result = await contactsService.deleteContact(req.params.id);
    if (!result) {
      throw new HttpError(404, "Contact not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }
    const result = await contactsService.createContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpError(404, "Not found");
    }

    if (Object.keys(req.body).length === 0) {
      throw new HttpError(400, "Body must have at least one field");
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }

    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw new HttpError(404, "Not found");
    }

    delete result.__v;

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const { error } = favoriteContactSchema.validate({ favorite });
    if (error) {
      throw new HttpError(400, error.message);
    }
    if (favorite === undefined || typeof favorite !== "boolean") {
      throw new HttpError(400, "Invalid favorite value");
    }
    const result = await contactsService.updateStatusContact(id, favorite);
    if (!result) {
      throw new HttpError(404, "Contact not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
