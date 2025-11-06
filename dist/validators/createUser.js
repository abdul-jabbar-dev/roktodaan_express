"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const v = __importStar(require("valibot"));
// import { GENDER } from "../prisma/app/generated/prisma/client";
const BloodGroupLabel = {
    A_POS: "A+",
    A_NEG: "A-",
    B_POS: "B+",
    B_NEG: "B-",
    O_POS: "O+",
    O_NEG: "O-",
    AB_POS: "AB+",
    AB_NEG: "AB-",
};
const createUserSchema = v.object({
    credential: v.object({ password: v.string() }),
    profile: v.object({
        fullName: v.string(),
        age: v.number(),
        email: v.string(),
        phoneNumber: v.string(),
        weight: v.number(),
        gender: v.enum(client_1.GENDER),
        bloodGroup: v.enum(BloodGroupLabel),
    }),
    address: v.object({
        division: v.string(),
        district: v.string(),
        upazila: v.string(),
    }),
    donationExperience: v.optional(v.array(v.object({
        lastDonationDate: v.string(),
        lastDonationLocation: v.string(),
    }))),
});
exports.default = createUserSchema;
