import { useState } from "react";
import { LogEntry } from "./types";

interface LogTableProps {
  logs: LogEntry[];
  onSortChange?: (field: keyof LogEntry, order: "asc" | "desc") => void;
}

const levelTextColorMap: Record<string, string> = {
  ERROR: "text-red-500",
  WARN: "text-orange-500",
  INFO: "text-green-500",
  DEBUG: "text-blue-500",
};

//텍스트 색상
const getTextColor = (level: string) =>
  levelTextColorMap[level] || "text-gray-500";

const LogTable = ({ logs, onSortChange }: LogTableProps) => {
  const [sortField, setSortField] = useState<keyof LogEntry | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof LogEntry) => {
    let order: "asc" | "desc" = "asc";
    if (sortField === field) {
      order = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortField(field);
    setSortOrder(order);
    if (onSortChange) onSortChange(field, order);
  };

  const sortChange = (field: keyof LogEntry) => {
    if (sortField !== field) return "";
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="overflow-x-auto border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("timestamp")}
            >
              Time{sortChange("timestamp")}
            </th>
            <th
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("level")}
            >
              Level{sortChange("level")}
            </th>
            <th
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("service")}
            >
              Service{sortChange("service")}
            </th>
            <th
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("message")}
            >
              Message{sortChange("message")}
            </th>
            <th
              className="border p-2 text-left cursor-pointer"
              onClick={() => handleSort("userId")}
            >
              User ID{sortChange("userId")}
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.timestamp + log.userId} className="hover:bg-gray-50">
              <td className="border p-2 whitespace-nowrap">{log.timestamp}</td>
              <td className="border p-2">
                <span
                  className={`inline-block px-2 py-1 rounded font-semibold ${getTextColor(
                    log.level
                  )}`}
                >
                  {log.level}
                </span>
              </td>
              <td className="border p-2 whitespace-nowrap">{log.service}</td>
              <td className="border p-2 truncate max-w-xs">{log.message}</td>
              <td className="border p-2 whitespace-nowrap">{log.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
