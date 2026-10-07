function floorToPowerOfTen(n: number): number {
  if (n < 10) return 0;
  const magnitude = Math.pow(10, Math.floor(Math.log10(n)));
  return magnitude;
}

export default floorToPowerOfTen;
