import React from "react";
import DailyReportForm from "../components/DailyReportForm";

function DailyReport() {
  const handleSubmit = async (reportData) => {
    try {
      const response = await fetch("/api/dailyReports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });
      if (!response.ok) throw new Error("日報の保存に失敗しました");
      alert("日報を登録しました");
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました");
    }
  };

  return (
    <div>
      <h1>日報作成</h1>
      <DailyReportForm onSubmit={handleSubmit} />
    </div>
  );
}

export default DailyReport;
