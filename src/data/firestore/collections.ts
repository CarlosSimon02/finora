import { adminFirestore } from "@/infrastructure/firebase/firebaseAdmin";

export type CollectionName =
  | "budgets"
  | "incomes"
  | "transactions"
  | "categories"
  | "pots";

export const userCollection = () => adminFirestore.collection("users");

export const userSubcollection = (userId: string, name: CollectionName) =>
  userCollection().doc(userId).collection(name);
