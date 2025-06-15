import { LogEntry } from "./types";

interface Props {
  logs: LogEntry[];
}

const Boards = ({ logs }: Props) => {
  const totalCount = logs.length;

  const recentHour = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentErrors = logs.filter(
    (log) =>
      log.level === "ERROR" && new Date(log.timestamp).getTime() >= recentHour
  ).length;

  //숫자 합산
  const levelCount = logs.reduce((acc: Record<string, number>, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {});

  const commonLevel = Object.entries(levelCount).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  const serviceCount = logs.reduce((acc: Record<string, number>, log) => {
    acc[log.service] = (acc[log.service] || 0) + 1;
    return acc;
  }, {});

  const topService = Object.entries(serviceCount).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      <div className="p-4 border rounded shadow bg-white">
        <h3 className="text-sm text-gray-500">총 로그 수</h3>
        <p className="text-xl font-bold">{totalCount.toLocaleString()}</p>
      </div>
      <div className="p-4 border rounded shadow bg-white">
        <h3 className="text-sm text-gray-500">최근 7일 내 ERROR</h3>
        <p className="text-xl font-bold text-red-600">{recentErrors}</p>
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
