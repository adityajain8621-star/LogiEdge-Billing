export const generateInvoiceId = () => {
  const digits = Math.floor(100000 + Math.random() * 900000).toString();
  return `INVC${digits}`;
};

export const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

export const nextId = (prefix, list) => {
  const nums = list.map((x) => parseInt(x.id.replace(prefix, ""), 10));
  const max = nums.length ? Math.max(...nums) : 0;
  return `${prefix}${String(max + 1).padStart(5, "0")}`;
};