"use strict";
// import { BloodGroup } from "../prisma/app/generated/prisma/client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBloodGroupEnumToLabel = exports.mapBloodGroupLabelToEnum = void 0;
const mapBloodGroupLabelToEnum = (label) => {
    const mapping = {
        "A+": "A_POS",
        "A-": "A_NEG",
        "B+": "B_POS",
        "B-": "B_NEG",
        "O+": "O_POS",
        "O-": "O_NEG",
        "AB+": "AB_POS",
        "AB-": "AB_NEG",
    };
    return mapping[label];
};
exports.mapBloodGroupLabelToEnum = mapBloodGroupLabelToEnum;
const mapBloodGroupEnumToLabel = (Enum) => {
    const mapping = {
        "A_POS": "A+",
        "A_NEG": "A-",
        "B_POS": "B+",
        "B_NEG": "B-",
        "O_POS": "O+",
        "O_NEG": "O-",
        "AB_POS": "AB+",
        "AB_NEG": "AB-",
    };
    return mapping[Enum];
};
exports.mapBloodGroupEnumToLabel = mapBloodGroupEnumToLabel;
