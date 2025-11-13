import { Prisma, BloodRequest, Donation } from "@prisma/client";
import prisma from "../../connection/db";
import JWT from "../../lib/jwt";
import { JwtPayload } from "jsonwebtoken";

const publishRequest = async (
  data: any /*  Prisma.BloodRequestCreateInput */,
  token: string
): Promise<BloodRequest | null> => {
  try {
    const decoded = JWT.DecToken(token) as JwtPayload | null;
    const userId = decoded?.id;

    if (!userId) throw new Error("Invalid or missing user token.");

    const donationsData =
      Array.isArray((data as any).donations) && (data as any).donations.length
        ? {
            create: (data as any).donations.map((d: Donation) => {
              const { id, ...rest } = d;
              return rest;
            }),
          }
        : undefined;

    const newRequest = await prisma.bloodRequest.create({
      data: {
        ...data,
        userId,
        donations: donationsData,
      },
      include: { donations: true }, 
    });

    return newRequest;
  } catch (error) {
    console.error("Error publishing blood request:", error);
    return null;
  }
};

const getAllRequests = async (): Promise<BloodRequest[]> => {
  try {
    const requests = await prisma.bloodRequest.findMany({
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
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    return [];
  }
};

const appointmentRequest = async (data: {
  request: {
    bloodRequestId: string;
    donorName: string;
    donorPhoneNumber: string;
    donorAddress: string;
    isSelf?: string;
  }[];
  requestId: string;
}) => {
  try {
    const donationUpdates = await Promise.all(
      data.request.map(async (d) => {
        const donor: {
          otherName?: string;
          otherPhoneNumber?: string;
          otherAddress?: string;
          donorId?: string;
        } = d.isSelf
          ? { donorId: d.isSelf }
          : {
              otherName: d.donorName,
              otherPhoneNumber: d.donorPhoneNumber,
              otherAddress: d.donorAddress,
            };

        const donation = await prisma.donation.findFirst({
          where: { bloodRequestId: d.bloodRequestId },
        });
        if (!donation)
          throw new Error("Donation not found for this blood request");

        const res = prisma.bloodRequestReservation.create({
          data: {
            ...donor,
            donationId: donation.id,
          },
        });
        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: "Reserved" },
        });
        return res;
      })
    );

    return donationUpdates;
  } catch (error) {
    console.error("Error creating blood request reservations:", error);
    return [];
  }
};

export const REQUEST_SERVICE = {
  publishRequest,
  getAllRequests,
  appointmentRequest,
};
