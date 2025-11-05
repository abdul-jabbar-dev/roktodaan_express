"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeEmail = void 0;
const normalizeEmail = (e) => {
    e = e.trim().toLowerCase();
    const [l, d] = e.split('@');
    return /^(gmail|googlemail)\.com$/.test(d)
        ? `${l.replace(/\+.*$/, '').replace(/\./g, '')}@gmail.com`
        : `${l}@${d}`;
};
exports.normalizeEmail = normalizeEmail;
