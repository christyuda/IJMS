// src/models/jurnal.js
const mongoose = require("mongoose");

const jurnalSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true,
  },
  insight: {
    type: String,
    required: true,
  },
  TLDR: String,
  conclusions: String,
  summarizedAbstract: String,
  results: String,
  methodsUsed: String,
  literatureSurvey: String,
  contributions: String,
  linkDokumen: String,
  file: String,
});

module.exports = mongoose.model("Jurnal", jurnalSchema);
