"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPasswordInStringPath = void 0;
const getPasswordFromObject = (doc) => {
    const getPasswordField = (obj, currentPath = []) => {
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            if (key.toLowerCase() === "password") {
                return [[...currentPath, key].join("."), value];
            }
            if (value && typeof value === "object" && !Array.isArray(value)) {
                const nested = getPasswordField(value, [
                    ...currentPath,
                    key,
                ]);
                if (nested !== undefined) {
                    return nested;
                }
            }
        }
        return undefined;
    };
    if (!doc || Object.keys(doc).length < 1) {
        throw new Error("No Data Inserted");
    }
    const result = getPasswordField(doc);
    if (!result || typeof result[1] !== "string" || result[1].trim() === "") {
        throw new Error("Password Required!");
    }
    return result;
};
const setPasswordInStringPath = (obj, path, newValue) => {
    const keys = path.split(".");
    let curr = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!(k in curr))
            curr[k] = {};
        curr = curr[k];
    }
    curr[keys[keys.length - 1]] = newValue;
    return obj;
};
exports.setPasswordInStringPath = setPasswordInStringPath;
exports.default = getPasswordFromObject;
