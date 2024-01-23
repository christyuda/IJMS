// src/controllers/jurnalController.js
const axios = require("axios");
const Jurnal = require("../models/jurnal");
const fs = require("fs");

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
const uploadFileToGitHub = async (content, fileName) => {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepoOwner = process.env.GITHUB_REPO_OWNER;
    const githubRepoName = process.env.GITHUB_REPO_NAME;
    const branchName = process.env.GITHUB_BRANCH || "main";

    const githubApiUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/contents/${fileName}`;
    const githubHeaders = {
      Authorization: `Bearer ${githubToken}`,
      "Content-Type": "application/json",
    };

    // Check if the file exists before creating or updating
    const existingFileResponse = await axios.get(githubApiUrl, {
      headers: githubHeaders,
    });

    const githubRequestBody = {
      message: "Upload new file",
      content: Buffer.from(content).toString("base64"),
      sha: existingFileResponse.data.sha,
      branch: branchName,
    };

    const response = await axios.put(githubApiUrl, githubRequestBody, {
      headers: githubHeaders,
    });

    console.log("File updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading file to GitHub:", error.message);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      throw new Error(`GitHub API error: ${error.response.status}`);
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("No response received from GitHub API");
    } else {
      console.error("Error setting up the request:", error.message);
      throw new Error("Error setting up the request to GitHub API");
    }
  }
};
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
    pdfContent,
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

    // Pastikan pdfContent terdefinisi dan memiliki panjang lebih dari 0
    if (pdfContent && pdfContent.length > 0) {
      // Simpan file PDF ke GitHub
      const fileName = `${savedJurnal._id}.pdf`; // Nama file menggunakan ID jurnal dengan ekstensi pdf

      // Simpan konten PDF ke file lokal
      const filePath = `./pdfs/${fileName}`;
      fs.writeFileSync(filePath, pdfContent, { encoding: "base64" });

      // Upload file PDF ke GitHub
      await uploadFileToGitHub(filePath, fileName);

      // Hapus file lokal setelah diupload
      fs.unlinkSync(filePath);
    }

    res.status(201).json(savedJurnal);
  } catch (error) {
    console.error(error);
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
