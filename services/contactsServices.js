import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function getAllContacts() {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
}

async function getOneContact(Id) {
  const contacts = await getAllContacts();
  const result = contacts.find((contact) => contact.id === Id);
  return result || null;
}

async function deleteContact(contactId) {
  const contacts = await getAllContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

async function createContact(name, email, phone) {
  const contacts = await getAllContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateContact(Id, name, email, phone) {
  const contacts = await getAllContacts();
  const index = contacts.findIndex((contact) => contact.id === Id);
  if (index === -1) {
    return null;
  }
  const updatedContact = { id: Id, name, email, phone };
  contacts[index] = updatedContact;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return updatedContact;
}

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
};
