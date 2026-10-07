const floor = (value: number, precision: number) => {
  const c = Math.pow(10, precision);
  return Math.floor(value * c) / c;
};

export default floor;
