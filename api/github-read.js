// /api/github-read.js
import { Octokit } from "@octokit/rest";
import pdf from "pdf-parse";
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const octokit = new Octokit({ auth: process.env.GH_TOKEN });
    const owner = "sunghun0422";
    const repo = "yuna-hub-app";
    const path = "DB/01_HUB/YeoSi_YunaHub/12";

    // 1️⃣ 파일 목록 가져오기
    const { data: files } = await octokit.repos.getContent({ owner, repo, path });
    const summaries = [];

    for (const file of files) {
      if (file.name.endsWith(".pdf")) {
        const response = await fetch(file.download_url);
        const arrayBuffer = await response.arrayBuffer();
        const parsed = await pdf(Buffer.from(arrayBuffer));
        summaries.push({
          name: file.name,
          type: "pdf",
          text: parsed.text.slice(0, 500).replace(/\n+/g, " ") + "...",
        });
      } else if (file.name.endsWith(".md") || file.name.endsWith(".txt")) {
        const response = await fetch(file.download_url);
        const text = await response.text();
        summaries.push({
          name: file.name,
          type: "text",
          text: text.slice(0, 500).replace(/\n+/g, " ") + "...",
        });
      }
    }

    // 2️⃣ CSV 생성
    const header = "filename,type,summary\n";
    const csvRows = summaries.map(s =>
      `"${s.name}","${s.type}","${s.text.replace(/"/g, '""')}"`
    );
    const csvContent = header + csvRows.join("\n");

    // 3️⃣ 기존 manifest_latest.csv SHA 가져오기
    let existingSha = null;
    try {
      const { data: existing } = await octokit.repos.getContent({
        owner,
        repo,
        path: `${path}/manifest_latest.csv`,
      });
      existingSha = existing.sha;
    } catch (err) {
      console.log("manifest_latest.csv not found, creating new.");
    }

    // 4️⃣ manifest_latest.csv 업데이트
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `${path}/manifest_latest.csv`,
      message: `auto: update manifest_latest.csv (${new Date().toISOString()})`,
      content: Buffer.from(csvContent, "utf8").toString("base64"),
      sha: existingSha || undefined,
      committer: {
        name: "YunaHub AutoCommit Bot",
        email: "auto@yuna-hub.app",
      },
      author: {
        name: "YunaHub Bot",
        email: "auto@yuna-hub.app",
      },
    });

    // 5️⃣ 응답 반환
    res.status(200).json({
      ok: true,
      total_files: summaries.length,
      updated_manifest: true,
      summaries,
      manifest_path: `${path}/manifest_latest.csv`,
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
