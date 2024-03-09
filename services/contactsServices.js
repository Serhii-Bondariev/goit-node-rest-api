import Contact from "../models/Contact.js";

const getAllContacts = () => Contact.find();
const getOneContact = (id) => Contact.findById(id);
const createContact = (body) => Contact.create(body);
const updateContact = (id, body) => Contact.findByIdAndUpdate(id, body);
const deleteContact = (id) => Contact.findByIdAndRemove(id);
const updateStatusContact = async (id, favorite) => {
  return Contact.findByIdAndUpdate(id, { favorite }, { new: true });
};

export default {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
  updateStatusContact,
};
