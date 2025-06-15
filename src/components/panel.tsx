import { LogEntry } from "./types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface PanelProps {
  logs: LogEntry[];
}

const COLORS = ["#f87171", "#fb923c", "#4ade80", "#60a5fa"];

const Panel = ({ logs }: PanelProps) => {
  const levelCounts = logs.reduce<Record<string, number>>((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(levelCounts).map(([level, count]) => ({
    name: level,
    value: count,
  }));

  return (
    <div className="w-full h-64 mb-6">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Panel;
