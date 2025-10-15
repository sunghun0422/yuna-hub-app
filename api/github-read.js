// /api/github-read.js (안정화 패치 버전)
import { Octokit } from "@octokit/rest";
import pdfParse from "pdf-parse";
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const token = process.env.GH_TOKEN;

    if (!token) {
      console.warn("⚠️ GH_TOKEN not found in environment variables");
    }

    const octokit = new Octokit({
      auth: token || undefined, // fallback to unauthenticated
    });

    const owner = "sunghun0422";
    const repo = "yuna-hub-app";
    const path = "DB/01_HUB/YeoSi_YunaHub/12";

    console.log("🔍 Fetching repo content:", `${owner}/${repo}/${path}`);

    const { data: files } = await octokit.repos.getContent({ owner, repo, path });

    const summaries = [];

    for (const file of files) {
      try {
        if (file.name.endsWith(".pdf")) {
          if (file.size > 2_000_000) {
            console.warn(`⚠️ Skipping large PDF: ${file.name} (${file.size} bytes)`);
            continue;
          }
          const pdfResponse = await fetch(file.download_url);
          const buffer = await pdfResponse.arrayBuffer();
          const parsed = await pdfParse(Buffer.from(buffer));
          summaries.push({
            name: file.name,
            type: "pdf",
            text: parsed.text.substring(0, 1000) + "...",
          });
        } else if (file.name.endsWith(".md") || file.name.endsWith(".txt")) {
          const textResponse = await fetch(file.download_url);
          const text = await textResponse.text();
          summaries.push({
            name: file.name,
            type: "text",
            text: text.substring(0, 1000) + "...",
          });
        }
      } catch (innerError) {
        console.error(`❌ Failed to parse ${file.name}:`, innerError.message);
      }
    }

    res.status(200).json({
      ok: true,
      total_files: summaries.length,
      summaries,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("🔥 Critical Error in /api/github-read:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
      hint: "Check GH_TOKEN and PDF size limits.",
    });
  }
}
