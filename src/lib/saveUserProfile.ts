// src/lib/saveUserProfile.ts

import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export interface ProfilePayload {
  uid: string;
  role: "student" | "company";
  fullName: string;
  bio: string;
  skills: string;
  qualifications: string;
  interests: string;
  experienceLevel: string;
  location: string;
}

export const saveUserProfile = async (payload: ProfilePayload) => {
  const { uid, ...rest } = payload;

  const userRef = doc(db, "users", uid);

  await setDoc(userRef, {
    ...rest,
    completedProfile: true,
    updatedAt: new Date(),
  }, { merge: true });
};
