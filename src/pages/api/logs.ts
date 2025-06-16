import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import zlib from "zlib";
import path from "path";

// 메모리 캐시
let cache: any[] = [];

async function loadLogsFromGzip(): Promise<any[]> {
  if (cache.length > 0) return cache;

  const filePath = path.join(process.cwd(), "public", "logs_20000.json.gz");
  const gzipData = await fs.readFile(filePath);
  const jsonStr = zlib.gunzipSync(gzipData).toString("utf-8");
  cache = JSON.parse(jsonStr);
  return cache;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const logs = await loadLogsFromGzip();

  if (req.query.raw === "true") {
    return res.status(200).json({ data: logs });
  }

  const {
    page = "1",
    pageSize = "100",
    level,
    keyword,
    sort = "timestamp",
    order = "desc",
  } = req.query;

  const pageNum = parseInt(page as string);
  const size = parseInt(pageSize as string);
  const keywordStr = (keyword as string)?.toLowerCase() || "";

  // 필터링
  let filtered = logs;

  if (level && typeof level === "string") {
    filtered = filtered.filter((log) => log.level === level);
  }

  if (keyword && typeof keyword === "string") {
    filtered = filtered.filter((log) =>
      ["message", "service", "userId", "level"].some((field) =>
        (log[field] || "").toLowerCase().includes(keywordStr)
      )
    );
  }

  // 정렬
  filtered.sort((a, b) => {
    const aVal = a[sort as string];
    const bVal = b[sort as string];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });

  // 페이징
  const total = filtered.length;
  const paginated = filtered.slice((pageNum - 1) * size, pageNum * size);

  res.status(200).json({
    data: paginated,
    total,
    page: pageNum,
    pageSize: size,
  });
}
