import { useMemo } from "react";
import { LogEntry } from "./types";

interface Props {
  logs: LogEntry[];
}

const Boards = ({ logs }: Props) => {
  const totalCount = logs.length;

  const topUser = useMemo(() => {
    const userCount = logs.reduce((acc: Record<string, number>, log) => {
      acc[log.userId] = (acc[log.userId] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(userCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [logs]);

  const commonLevel = useMemo(() => {
    const levelCount = logs.reduce((acc: Record<string, number>, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(levelCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [logs]);

  const topService = useMemo(() => {
    const serviceCount = logs.reduce((acc: Record<string, number>, log) => {
      acc[log.service] = (acc[log.service] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [logs]);

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      <div className="p-4 border rounded shadow bg-white">
        <h3 className="text-sm text-gray-500">총 로그 수</h3>
        <p className="text-xl font-bold">{totalCount.toLocaleString()}</p>
      </div>
      <div className="p-4 border rounded shadow bg-white">
        <h3 className="text-sm text-gray-500">최다 User ID</h3>
        <p className="text-xl font-bold">{topUser}</p>
      </div>
      <div className="p-4 border rounded shadow bg-white">
        <h3 className="text-sm text-gray-500">최다 Level</h3>
        <p className="text-xl font-bold">{commonLevel}</p>
      </div>
      <div className="p-4 border rounded shadow bg-white">
        <h3 className="text-sm text-gray-500">최다 Service</h3>
        <p className="text-xl font-bold">{topService}</p>
      </div>
    </div>
  );
};

export default Boards;
