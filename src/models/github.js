// models/github.js
const axios = require("axios");

class GitHub {
  constructor(token, repoOwner, repoName, branch = "main") {
    this.token = token;
    this.repoOwner = repoOwner;
    this.repoName = repoName;
    this.branch = branch;
  }

  async uploadFile(fileName, content, sha) {
    try {
      const apiUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${fileName}`;
      const headers = {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      };

      // Check if the file exists before creating or updating
      const existingFileResponse = await axios.get(apiUrl, { headers });

      const requestBody = {
        message: "Upload new file",
        content: Buffer.from(content).toString("base64"),
        sha: sha || existingFileResponse.data.sha,
        branch: this.branch,
      };

      const response = await axios.put(apiUrl, requestBody, { headers });

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
  }
}

module.exports = GitHub;
