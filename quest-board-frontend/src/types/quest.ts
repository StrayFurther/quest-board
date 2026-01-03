export type Quest = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    reward: number; // XP
    createdAt: number;
};

export interface AdventurerQuestInstance {
    id?: string; // Optional, will be the Firestore document ID for this user's quest instance
    questId: string; // The ID of the QuestDefinition this instance refers to
    adventurerId: string; // The ID of the user who has this quest
    status: 'active' | 'completed' | 'failed' | 'abandoned';
    startedAt: Date;
    completedAt?: Date;
}
