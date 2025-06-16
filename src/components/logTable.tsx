import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { LogEntry } from "./types";
import { useMemo } from "react";

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

const getTextColor = (level: string) =>
  levelTextColorMap[level] || "text-gray-500";

const LogTable = ({ logs, onSortChange }: LogTableProps) => {
  const Row = ({ index, style }: ListChildComponentProps) => {
    const log = logs[index];
    return (
      <div
        style={style}
        className="grid grid-cols-[200px_100px_150px_1fr_150px] border-b text-sm items-center hover:bg-gray-50 px-2"
      >
        <div className="whitespace-nowrap">{log.timestamp}</div>
        <div className={`${getTextColor(log.level)} font-semibold`}>
          {log.level}
        </div>
        <div className="whitespace-nowrap">{log.service}</div>
        <div className="truncate">{log.message}</div>
        <div className="whitespace-nowrap">{log.userId}</div>
      </div>
    );
  };

  const header = useMemo(
    () => (
      <div className="grid grid-cols-[200px_100px_150px_1fr_150px] bg-gray-100 text-sm font-semibold px-2 py-2 border-b">
        <div
          className="cursor-pointer"
          onClick={() => onSortChange?.("timestamp", "asc")}
        >
          Time
        </div>
        <div
          className="cursor-pointer"
          onClick={() => onSortChange?.("level", "asc")}
        >
          Level
        </div>
        <div
          className="cursor-pointer"
          onClick={() => onSortChange?.("service", "asc")}
        >
          Service
        </div>
        <div
          className="cursor-pointer"
          onClick={() => onSortChange?.("message", "asc")}
        >
          Message
        </div>
        <div
          className="cursor-pointer"
          onClick={() => onSortChange?.("userId", "asc")}
        >
          User ID
        </div>
      </div>
    ),
    [onSortChange]
  );

  return (
    <div className="border border-gray-200 max-h-[600px] overflow-hidden">
      {header}
      <List height={500} itemCount={logs.length} itemSize={48} width="100%">
        {Row}
      </List>
    </div>
  );
};

export default LogTable;
