// src/controllers/jurnalController.js
const Jurnal = require("../models/jurnal");

// Mendapatkan semua jurnal
const getAllJurnals = async (req, res) => {
  try {
    // Token information dapat diakses melalui req.user setelah melewati middleware otentikasi
    const jurnals = await Jurnal.find();
    res.status(200).json({ status: 200, message: "Success", data: jurnals });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// Mendapatkan jurnal berdasarkan ID
const getJurnalById = async (req, res) => {
  const { id } = req.params;

  try {
    const jurnal = await Jurnal.findById(id);
    if (!jurnal) {
      return res
        .status(404)
        .json({ status: 404, message: "Jurnal not found." });
    }

    res.status(200).json({ status: 200, message: "Success", data: jurnal });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// Membuat jurnal baru
const createJurnal = async (req, res) => {
  const {
    judul,
    insight,
    TLDR,
    conclusions,
    summarizedAbstract,
    results,
    methodsUsed,
    literatureSurvey,
    contributions,
    linkDokumen,
  } = req.body;

  const newJurnal = new Jurnal({
    judul,
    insight,
    TLDR,
    conclusions,
    summarizedAbstract,
    results,
    methodsUsed,
    literatureSurvey,
    contributions,
    linkDokumen,
  });

  try {
    // Token information dapat diakses melalui req.user setelah melewati middleware otentikasi
    const savedJurnal = await newJurnal.save();
    res.status(201).json(savedJurnal);
  } catch (error) {
    res.status(400).json({ message: "Bad Request. Check your request body." });
  }
};

// Mengupdate jurnal berdasarkan ID
const updateJurnal = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedJurnal = await Jurnal.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedJurnal) {
      return res.status(404).json({ message: "Jurnal not found." });
    }

    res.status(200).json(updatedJurnal);
  } catch (error) {
    res.status(400).json({ message: "Bad Request. Check your request body." });
  }
};

// Menghapus jurnal berdasarkan ID
const deleteJurnal = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJurnal = await Jurnal.findByIdAndDelete(id);
    if (!deletedJurnal) {
      return res.status(404).json({ message: "Jurnal not found." });
    }

    res.status(200).json({ message: "Jurnal deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllJurnals,
  getJurnalById,
  createJurnal,
  updateJurnal,
  deleteJurnal,
};
