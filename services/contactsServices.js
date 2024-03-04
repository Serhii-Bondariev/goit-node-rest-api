import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import HttpError from "../helpers/HttpError.js";

const contactsPath = path.resolve("db", "contacts.json");

const getAllContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
};

const getOneContact = async (Id) => {
  const contacts = await getAllContacts();
  const result = contacts.find((contact) => contact.id === Id);
  return result || null;
};

const deleteContact = async (contactId) => {
  const contacts = await getAllContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

export const createContact = async (data) => {
  try {
    const contacts = await getAllContacts();
    const newContact = { id: nanoid(), ...data };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    throw new HttpError(500, `Failed to create contact: ${error.message}`);
  }
};

export const updateContact = async (Id, data) => {
  try {
    const contacts = await getAllContacts();
    const index = contacts.findIndex((contact) => contact.id === Id);
    if (index === -1) {
      return null;
    }
    const updatedContact = { id: contacts[index].id, ...data };
    contacts[index] = updatedContact;
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updatedContact;
  } catch (error) {
    throw new HttpError(500, `Failed to update contact: ${error.message}`);
  }
};

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
};
