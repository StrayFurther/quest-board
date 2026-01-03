import {query, setDoc, getDocs, addDoc, collection, doc, getDoc, where} from "firebase/firestore";
import type {CreateQuestPayload} from "../types/payload/quest.ts";
import {db} from "../firebase.ts";
import type {Quest, AdventurerQuestInstance} from "../types/quest.ts";

export class QuestService {
    async createNewQuestDefinition(
        payload: CreateQuestPayload,
        creatorUid?: string
    ): Promise<string> {
        // Use addDoc to create a new document with an auto-generated ID in the "quests" collection
        const questRef = await addDoc(collection(db, "quests"), {
            title: payload.title,
            description: payload.description,
            reward: payload.reward,
            ...(creatorUid && { creatorId: creatorUid }), // Conditionally add creatorId
            createdAt: new Date(),
        });
        console.log("New quest definition created with ID:", questRef.id);
        return questRef.id;
    }

    async getAllQuests(): Promise<Quest[]> {
        const questsCollectionRef = collection(db, "quests");
        const q = query(questsCollectionRef); // You can add orderBy, limit, etc. here

        const querySnapshot = await getDocs(q);

        const quests: Quest[] = [];
        querySnapshot.forEach((doc) => {
            // Include the document ID in the returned object
            quests.push({ id: doc.id, ...doc.data() } as Quest);
        });
        console.log("Fetched all quest definitions:", quests);
        return quests;
    }

    async assignQuestToAdventurer(questDefinitionId: string, adventurerId: string): Promise<string> {
        if (!adventurerId || !questDefinitionId) {
            throw new Error("Both questDefinitionId and adventurerId are required to assign a quest.");
        }

        const userQuestRef = await addDoc(collection(db, "adventurersQuests"), { // Using "adventurersQuests"
            questId: questDefinitionId,
            adventurerId: adventurerId, // Using adventurerId field name
            status: 'active', // Default status when assigned
            startedAt: new Date(),
        });
        console.log(`Quest ${questDefinitionId} assigned to adventurer ${adventurerId} with instance ID: ${userQuestRef.id}`);
        return userQuestRef.id;
    }

    /**
     * Updates the status or progress of a specific user quest instance.
     * @param adventurerQuestInstanceId - The ID of the user's quest instance to update.
     * @param updates - An object containing the fields to update (e.g., { status: 'completed', progress: 100 }).
     */
    async updateAdventurerQuestInstance(adventurerQuestInstanceId: string, updates: Partial<AdventurerQuestInstance>): Promise<void> {
        if (!adventurerQuestInstanceId) {
            throw new Error("User quest instance ID is required for update.");
        }
        const adventurersQuestRef = doc(db, "adventurersQuests", adventurerQuestInstanceId);
        await setDoc(adventurersQuestRef, updates, { merge: true }); // Use merge: true to update specific fields
        console.log(`Adventurers quest instance ${adventurerQuestInstanceId} updated.`);
    }

    async getQuestDetailsById(questId: string): Promise<Quest | null> {
        if (!questId) {
            console.error("Quest ID is required to fetch a quest.");
            return null;
        }

        const questDocRef = doc(db, "quests", questId); // This is a DocumentReference
        const questDocSnap = await getDoc(questDocRef); // <-- Use getDoc() for a single document

        if (questDocSnap.exists()) { // <-- Use .exists() for a DocumentSnapshot
            // Return the quest data along with its ID
            return { id: questDocSnap.id, ...questDocSnap.data() } as Quest;
        } else {
            console.log(`No quest definition found with ID: ${questId}`);
            return null;
        }
    }

    async getUserQuestInstanceByAdventurerIdAndQuestId(adventurerId: string, questId: string): Promise<AdventurerQuestInstance | null> {
        if (!adventurerId || !questId) {
            console.error("Both adventurerId and questId are required to fetch a specific user quest instance.");
            return null;
        }

        const userQuestsCollectionRef = collection(db, "adventurersQuests");

        // Build a query with two 'where' clauses
        const q = query(
            userQuestsCollectionRef,
            where("adventurerId", "==", adventurerId),
            where("questId", "==", questId)
        );

        const querySnapshot = await getDocs(q); // Execute the query

        if (!querySnapshot.empty) {
            // Assuming there should only be one such instance for a given user and quest ID,
            // we'll take the first one found.
            const docSnap = querySnapshot.docs[0];
            return { id: docSnap.id, ...docSnap.data() } as AdventurerQuestInstance;
        } else {
            console.log(`No user quest instance found for adventurerId: ${adventurerId} and questId: ${questId}`);
            return null;
        }
    }

    async completeQuestForAdventurer(instanceId: string): Promise<void> {
        return this.updateAdventurerQuestInstance(instanceId, {
            status: 'completed',
            completedAt: new Date(),
        })
    }
}