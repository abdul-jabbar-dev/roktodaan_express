"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUEST_SERVICE = void 0;
const db_1 = __importDefault(require("../../connection/db"));
const jwt_1 = __importDefault(require("../../lib/jwt"));
const publishRequest = async (data /*  Prisma.BloodRequestCreateInput */, token) => {
    try {
        const decoded = jwt_1.default.DecToken(token);
        const userId = decoded?.id;
        if (!userId)
            throw new Error("Invalid or missing user token.");
        const donationsData = Array.isArray(data.donations) && data.donations.length
            ? {
                create: data.donations.map((d) => {
                    const { id, ...rest } = d;
                    return rest;
                }),
            }
            : undefined;
        const newRequest = await db_1.default.bloodRequest.create({
            data: {
                ...data,
                userId,
                donations: donationsData,
            },
            include: { donations: true },
        });
        return newRequest;
    }
    catch (error) {
        console.error("Error publishing blood request:", error);
        return null;
    }
};
const getAllRequests = async () => {
    try {
        const requests = await db_1.default.bloodRequest.findMany({
            include: {
                donations: {
                    include: {
                        reserved: { include: { donor: { include: { profile: true } } } },
                    },
                    orderBy: {
                        date: "desc", // or 'asc' if you want oldest first
                    },
                },
            },
        });
        return requests;
    }
    catch (error) {
        console.error("Error fetching blood requests:", error);
        return [];
    }
};
const appointmentRequest = async (data) => {
    try {
        const donationUpdates = await Promise.all(data.request.map(async (d) => {
            const donor = d.isSelf
                ? { donorId: d.isSelf }
                : {
                    otherName: d.donorName,
                    otherPhoneNumber: d.donorPhoneNumber,
                    otherAddress: d.donorAddress,
                };
            const donation = await db_1.default.donation.findFirst({
                where: { bloodRequestId: d.bloodRequestId },
            });
            if (!donation)
                throw new Error("Donation not found for this blood request");
            const res = db_1.default.bloodRequestReservation.create({
                data: {
                    ...donor,
                    donationId: donation.id,
                },
            });
            await db_1.default.donation.update({
                where: { id: donation.id },
                data: { status: "Reserved" },
            });
            return res;
        }));
        return donationUpdates;
    }
    catch (error) {
        console.error("Error creating blood request reservations:", error);
        return [];
    }
};
exports.REQUEST_SERVICE = {
    publishRequest,
    getAllRequests,
    appointmentRequest,
};
