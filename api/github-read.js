// /api/github-read.js
// 완전 서버리스 대응, GH_TOKEN 기반 PDF/텍스트 요약 API

import { Octokit } from "@octokit/rest";
import pdf from "pdf-parse";
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const octokit = new Octokit({ auth: process.env.GH_TOKEN });
    const owner = "sunghun0422";
    const repo = "yuna-hub-app";
    const path = "DB/01_HUB/YeoSi_YunaHub/12"; // PDF/Text 파일 경로

    const { data: files } = await octokit.repos.getContent({ owner, repo, path });
    const summaries = [];

    for (const file of files) {
      // PDF 처리
      if (file.name.endsWith(".pdf")) {
        const response = await fetch(file.download_url);
        const arrayBuffer = await response.arrayBuffer();
        const parsed = await pdf(Buffer.from(arrayBuffer));
        summaries.push({
          name: file.name,
          type: "pdf",
          text: parsed.text.slice(0, 1000) + "...",
        });
      }

      // 텍스트/마크다운 처리
      else if (file.name.endsWith(".md") || file.name.endsWith(".txt")) {
        const response = await fetch(file.download_url);
        const text = await response.text();
        summaries.push({
          name: file.name,
          type: "text",
          text: text.slice(0, 1000) + "...",
        });
      }
    }

    res.status(200).json({
      ok: true,
      total_files: summaries.length,
      summaries,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      ok: false,
      message: error.message,
      stack: error.stack,
    });
  }
}
