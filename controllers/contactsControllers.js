import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const result = await contactsService.getAllContacts();

  res.json(result);
};

export const getOneContact = (req, res) => {
  const result = contactsService.getOneContact(req.params.id);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(result);
};

export const deleteContact = (req, res) => {
  const result = contactsService.deleteContact(req.params.id);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(result);
};

export const createContact = (req, res) => {
  const result = contactsService.createContact(req.body);
  res.status(201).json(result);
};

export const updateContact = (req, res) => {
  const result = contactsService.updateContact(
    req.params.id,
    req.body.name,
    req.body.email,
    req.body.phone
  );
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(result);
};
