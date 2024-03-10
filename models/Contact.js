import { Schema, model } from "mongoose";

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  __v: { type: Number, select: false }, // Відключаємо поле "__v" відповіді за замовчуванням
});

const Contact = model("contact", contactSchema);

export default Contact;
