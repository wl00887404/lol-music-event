const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchAllData<T>(
  getData: ({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }) => Promise<{ data: T[]; total: number }>,
  onProgress?: (fetched: number, total: number) => void,
): Promise<T[]> {
  const PAGE_SIZE = 100;
  const DELAY_MS = 1000;

  let offset = 0;
  let total = Infinity;
  const results: T[] = [];

  while (offset < total) {
    const { data, total: totalCount } = await getData({
      offset,
      limit: PAGE_SIZE,
    });

    results.push(...data);
    total = totalCount;
    offset += PAGE_SIZE;

    onProgress?.(results.length, total);

    // 如果已經抓完，或這頁回傳筆數小於 PAGE_SIZE（保險判斷，避免無限迴圈）
    if (data.length < PAGE_SIZE) break;

    if (offset < total) {
      await sleep(DELAY_MS);
    }
  }

  return results;
}
