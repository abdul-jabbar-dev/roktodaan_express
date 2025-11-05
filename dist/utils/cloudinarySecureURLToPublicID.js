"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPublicIdFromUrl = void 0;
const extractPublicIdFromUrl = (secureUrl) => {
    if (!secureUrl || typeof secureUrl !== "string")
        return undefined;
    try {
        // remove query params (if any)
        const cleanUrl = secureUrl.split("?")[0];
        // split by `/upload/` to isolate folder+file
        const parts = cleanUrl.split("/upload/");
        if (parts.length < 2)
            return undefined;
        // get everything after version number (v123456)
        const afterUpload = parts[1];
        const pathSegments = afterUpload.split("/");
        // remove version if exists (starts with "v123...")
        if (pathSegments[0].startsWith("v") &&
            !isNaN(Number(pathSegments[0].substring(1)))) {
            pathSegments.shift();
        }
        // join remaining parts and remove file extension
        const filePath = pathSegments.join("/");
        const withoutExt = filePath.replace(/\.[^/.]+$/, ""); // remove .png/.jpg etc
        return withoutExt;
    }
    catch {
        return undefined;
    }
};
exports.extractPublicIdFromUrl = extractPublicIdFromUrl;
