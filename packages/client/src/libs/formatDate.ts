function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const pad = (n: number) => String(n).padStart(2, "0");

  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${YYYY}/${MM}/${DD} ${hh}:${mm}:${ss}`;
}

export default formatDate;
