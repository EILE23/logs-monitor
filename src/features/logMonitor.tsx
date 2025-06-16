import { useEffect, useState } from "react";
import LogTable from "@/components/logtable";
import Panel from "@/components/panel";
import Boards from "@/components/boards";
import { LogEntry } from "../components/types";
import { renderPageNumbers } from "../../utils/pagenation";

const LogMonitor = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterRecentError, setFilterRecentError] = useState(false);
  const [filterLevels, setFilterLevels] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof LogEntry | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const pageSize = 10;

  useEffect(() => {
    fetch("/logs_20000.json")
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, []);

  const hourAgo = Date.now() - 60 * 60 * 1000;

  const logData = logs
    .filter((log) => {
      const timestamp = new Date(log.timestamp).getTime();
      if (filterRecentError && (log.level !== "ERROR" || timestamp < hourAgo)) {
        return false;
      }

      if (filterLevels.length > 0 && !filterLevels.includes(log.level)) {
        return false;
      }

      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        return (
          log.message.toLowerCase().includes(keyword) ||
          log.service.toLowerCase().includes(keyword) ||
          log.userId.toLowerCase().includes(keyword) ||
          log.level.toLowerCase().includes(keyword)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(logData.length / pageSize);
  const paginatedLogs = logData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDownload = () => {
    const headers = ["timestamp", "level", "service", "message", "userId"];
    const csvContent = [
      headers.join(","),
      ...logData.map((log) =>
        headers.map((field) => `"${log[field as keyof LogEntry]}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLevelChange = (level: string) => {
    setFilterLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, filterRecentError, filterLevels]);

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">로그 모니터링</h1>
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search logs..."
          className="px-3 py-2 border rounded w-64"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filterRecentError}
            onChange={() => setFilterRecentError(!filterRecentError)}
          />
          <span className="text-sm">최근 1시간 내 ERROR만 보기</span>
        </label>
        <div className="flex gap-2">
          {["ERROR", "WARN", "INFO", "DEBUG"].map((level) => (
            <label key={level} className="text-sm">
              <input
                type="checkbox"
                checked={filterLevels.includes(level)}
                onChange={() => handleLevelChange(level)}
                className="mr-1"
              />
              {level}
            </label>
          ))}
        </div>
        <button
          onClick={handleDownload}
          className="px-3 py-2 border rounded text-sm bg-blue-100 hover:bg-blue-200 cursor-pointer"
        >
          검색 결과 다운로드
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Panel logs={logData} />
        <Boards logs={logData} />
      </div>
      <LogTable
        logs={paginatedLogs}
        onSortChange={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
      />
      <div className="flex justify-center mt-4 flex-wrap gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          이전
        </button>
        {renderPageNumbers(currentPage, totalPages, setCurrentPage)}
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default LogMonitor;
