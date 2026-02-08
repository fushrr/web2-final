const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, required: true, enum: ["dog", "cat", "other"] },
    breed: { type: String, trim: true },
    age: { type: Number, min: 0 },
    gender: { type: String, enum: ["male", "female", "unknown"], default: "unknown" },
    description: { type: String, trim: true },
    status: { type: String, enum: ["available", "pending", "adopted"], default: "available" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
