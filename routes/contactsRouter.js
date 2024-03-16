import express from "express";
import {
  getAllContacts,
  getFilteredContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateStatusContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import errorHandler from "../helpers/errorHandler.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);
contactsRouter.get("/filter", getFilteredContacts);
contactsRouter.get("/:id", getOneContact);
contactsRouter.delete("/:id", deleteContact);
contactsRouter.post("/", createContact);
contactsRouter.put("/:id", updateContact);
contactsRouter.patch("/:id/favorite", validateObjectId, updateStatusContact);

contactsRouter.use(errorHandler);

export default contactsRouter;
