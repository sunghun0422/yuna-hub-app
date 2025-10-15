// File: /api/github-test-read.js

import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  try {
    const octokit = new Octokit({
      auth: process.env.GH_TOKEN,
    });

    // ✅ 테스트용: DB/01_HUB/YeoSi_YunaHub/12 폴더 내 파일 리스트 불러오기
    const repoOwner = "sunghun0422";
    const repoName = "yuna-hub-app";
    const path = "DB/01_HUB/YeoSi_YunaHub/12";

    const response = await octokit.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path,
    });

    // 파일 이름 목록만 추출
    const fileList = response.data.map((f) => f.name);

    res.status(200).json({
      status: "✅ GitHub DB 폴더 접근 성공",
      folder: path,
      files: fileList,
      message:
        "YunaHubPro가 GitHub DB 폴더 파일 목록을 정상적으로 불러왔습니다.",
    });
  } catch (error) {
    res.status(500).json({
      status: "❌ 오류 발생",
      error: error.message,
    });
  }
}
