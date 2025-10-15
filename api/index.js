import { Octokit } from "@octokit/rest";
import pdfParse from "pdf-parse";

export default async function handler(req, res) {
  const octokit = new Octokit({ auth: process.env.GH_TOKEN });
  const owner = "sunghun0422";
  const repo = "yuna-hub-app";
  const path = "DB/01_HUB/YeoSi_YunaHub/12/";

  try {
    const { data: files } = await octokit.repos.getContent({ owner, repo, path });
    const summaries = [];

    for (const file of files) {
      if (file.name.endsWith(".pdf")) {
        const pdfData = await fetch(file.download_url);
        const buffer = await pdfData.arrayBuffer();
        const parsed = await pdfParse(Buffer.from(buffer));
        summaries.push({
          file: file.name,
          type: "pdf",
          content: parsed.text.substring(0, 800) + "...",
        });
      } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const textData = await fetch(file.download_url);
        const text = await textData.text();
        summaries.push({
          file: file.name,
          type: "text",
          content: text.substring(0, 800) + "...",
        });
      }
    }

    res.status(200).json({
      ok: true,
      total: summaries.length,
      summaries,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      step: "indexing",
    });
  }
}
