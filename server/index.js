// index.js

import React from 'react';

export default function HomePage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🌸 유나 허브에 오신 걸 환영합니다!</h1>
      <p>이 앱은 정리방, 기억방, 캘린더, 요약 기능을 제공합니다.</p>

      <h3>📂 기능 목록</h3>
      <ul>
        <li><a href="/calendar">📅 캘린더 보기</a></li>
        <li><a href="/docs">📁 문서 목록</a></li>
        <li><a href="/summarize">🧠 텍스트 요약</a></li>
      </ul>

      <p style={{ marginTop: '40px', fontSize: '0.9rem', color: '#888' }}>
        © 2025 YunaHub. All rights reserved.
      </p>
    </div>
  );
}
