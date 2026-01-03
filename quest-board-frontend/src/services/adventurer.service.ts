import {doc, getDoc, setDoc} from "firebase/firestore";
import {db} from "../firebase.ts";
import type {AdventurerState} from "../types/adventurer-state.ts";

export class AdventurerService {
    async fetchAdventurerData(userId: string): Promise<AdventurerState | null> {
        if (!userId) {
            console.error("User ID is required to fetch adventurer data.");
            return null;
        }

        try {
            const adventurerDocRef = doc(db, "adventurers", userId);
            const adventurerDocSnap = await getDoc(adventurerDocRef);

            if (adventurerDocSnap.exists()) {
                // Combine the document ID (userId) with the document data
                return { id: adventurerDocSnap.id, ...adventurerDocSnap.data() } as AdventurerState;
            } else {
                console.log(`No adventurer document found for user ID: ${userId}`);
                return null;
            }
        } catch (err) {
            console.error("Error fetching adventurer data:", err);
            return null;
        }
    }

    async updateAdventurerData(userId: string, updates: Partial<AdventurerState>): Promise<void> {
        if (!userId) {
            throw new Error("User ID is required to update adventurer data.");
        }
        const adventurerRef = doc(db, "adventurers", userId);
        await setDoc(adventurerRef, updates, { merge: true }); // Use merge: true to update specific fields
        console.log(`Adventurer data for user ${userId} updated.`);
    }
}