 
import { BloodGroup } from "../prisma/app/generated/prisma/client";

export const mapBloodGroupLabelToEnum = (label: string): BloodGroup => {
  const mapping: Record<string, BloodGroup> = {
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
 
export const mapBloodGroupEnumToLabel = (Enum: BloodGroup) => {
  const mapping: Record<BloodGroup, string> = {
     "A_POS":"A+",
     "A_NEG":"A-",
     "B_POS":"B+",
     "B_NEG":"B-",
     "O_POS":"O+",
     "O_NEG":"O-",
     "AB_POS":"AB+",
     "AB_NEG":"AB-",
  };

  return mapping[Enum ];
};
 