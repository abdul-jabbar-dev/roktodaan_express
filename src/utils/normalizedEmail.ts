export const normalizeEmail = (e:string) => {
  e = e.trim().toLowerCase();
  const [l, d] = e.split('@');
  return /^(gmail|googlemail)\.com$/.test(d)
    ? `${l.replace(/\+.*$/, '').replace(/\./g, '')}@gmail.com`
    : `${l}@${d}`;
};