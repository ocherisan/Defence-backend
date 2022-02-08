const { Schema, model, Types } = require("mongoose");

const taskSchema = new Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  descriptionCode: { type: String, required: false },
  variants: { type: [String], required: false },
  variansAnswer: { type: Number, required: false },
  textAnswer: { type: String, required: false },
});

const partSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  tasks: [taskSchema],
});

const partModel = model("Part", partSchema);

module.exports = partModel;
