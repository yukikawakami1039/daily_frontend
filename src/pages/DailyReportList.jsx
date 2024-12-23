import React, { useEffect, useState } from "react";

function DailyReportList() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/dailyReports");
        if (!response.ok) throw new Error("日報一覧取得に失敗しました");
        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div>
      <h1>日報一覧</h1>
      <ul>
        {reports.map((report) => (
          <li key={report._id}>
            <strong>{report.title}</strong>（{report.reportDate}）
            <p>{report.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DailyReportList;
