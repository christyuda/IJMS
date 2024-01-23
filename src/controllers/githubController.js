const axios = require("axios");

const uploadFileToGitHub = async (req, res) => {
  try {
    const { content, fileName } = req.body;
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepoOwner = process.env.GITHUB_REPO_OWNER;
    const githubRepoName = process.env.GITHUB_REPO_NAME;
    const branchName = process.env.GITHUB_BRANCH || "main";

    const githubApiUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/contents/${fileName}`;
    const githubHeaders = {
      Authorization: `Bearer ${githubToken}`,
      "Content-Type": "application/json",
    };

    console.log("GitHub API URL:", githubApiUrl);
    console.log("GitHub Headers:", githubHeaders);

    // Check if the file exists before creating or updating
    let existingFileResponse;
    try {
      existingFileResponse = await axios.get(githubApiUrl, {
        headers: githubHeaders,
      });
    } catch (error) {
      // If the file doesn't exist, the API will return a 404 status
      if (error.response && error.response.status === 404) {
        console.log("File not found. It will be created.");
      } else {
        throw error; // Re-throw other errors
      }
    }

    const githubRequestBody = {
      message: "add new file",
      content: Buffer.from(content).toString("base64"),
      sha: existingFileResponse ? existingFileResponse.data.sha : undefined, // If updating an existing file
      branch: branchName, // Specify the branch
    };

    const response = await axios.put(githubApiUrl, githubRequestBody, {
      headers: githubHeaders,
    });

    console.log("File updated successfully:", response.data);

    // Format the response in the desired structure
    const formattedResponse = {
      status: response.status,
      message: "File updated successfully",
      data: [
        {
          content: Buffer.from(content).toString("base64"),
          namafile: fileName,
        },
      ],
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error uploading file to GitHub:", error.message);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error("No response received:", error.request);
      res.status(500).json({ error: "No response received from GitHub API" });
    } else {
      console.error("Error setting up the request:", error.message);
      res
        .status(500)
        .json({ error: "Error setting up the request to GitHub API" });
    }
  }
};

module.exports = {
  uploadFileToGitHub,
};
