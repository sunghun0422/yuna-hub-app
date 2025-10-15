import { Octokit } from "@octokit/rest";
import pdfParse from "pdf-parse";
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const octokit = new Octokit({
      auth: process.env.GH_TOKEN,
    });

    const owner = "sunghun0422";
    const repo = "yuna-hub-app";
    const path = "DB/01_HUB/YeoSi_YunaHub/12";

    const { data: files } = await octokit.repos.getContent({ owner, repo, path });

    const summaries = [];

    for (const file of files) {
      if (file.name.endsWith(".pdf")) {
        const pdfResponse = await fetch(file.download_url);
        const buffer = await pdfResponse.arrayBuffer();
        const parsed = await pdfParse(Buffer.from(buffer));
        summaries.push({
          name: file.name,
          text: parsed.text.substring(0, 1000) + "..."
        });
      } else if (file.name.endsWith(".md") || file.name.endsWith(".txt")) {
        const textResponse = await fetch(file.download_url);
        const text = await textResponse.text();
        summaries.push({
          name: file.name,
          text: text.substring(0, 1000) + "..."
        });
      }
    }

    res.status(200).json({
      ok: true,
      count: summaries.length,
      summaries,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
}
