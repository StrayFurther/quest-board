import "./QuestDetailPage.css";
import {useEffect, useState} from "react";
import type {AdventurerQuestInstance, Quest} from "../../types/quest.ts";
import {useQuestService} from "../../providers/QuestServiceProvider.tsx";
import {useAdventurerService} from "../../providers/AdventuerServiceProvider.tsx";
import {useAuth} from "../../providers/AuthProvider.tsx";

export const QuestDetailPage = () => {
    const [details, setDetails] = useState<Quest | null>(null);
    const [id, setId] = useState<string | null>(null);
    const {user} = useAuth();
    const questService = useQuestService();
    const adventurerService = useAdventurerService();
    const [error, setError] = useState<string | null>(null);
    const [adventurer, setAdventurer] = useState<any>(null);
    const [adventurerQuest, setAdventurerQuest] = useState<AdventurerQuestInstance | null>(null);
    useEffect(() => {
            setId(window.location.href.split("/").pop() ?? null); // "kfjEfaaIjA9glK8fy3Q3"
        }
    , [])

    useEffect(() => {
        try {
            if (id && user) {
                questService.getQuestDetailsById(id).then(fetchedQuest => {
                    if (fetchedQuest) {
                        setDetails(fetchedQuest);
                        console.log("HOW", fetchedQuest)
                        if (!user) {
                            setError("User not authenticated.");
                            return;
                        }
                        adventurerService.fetchAdventurerData(user.uid).then(adventurer => {
                            console.log(adventurer);
                            setAdventurer(adventurer);
                            if (adventurer) {
                                questService.getUserQuestInstanceByAdventurerIdAndQuestId(adventurer.id, fetchedQuest.id)
                                    .then(adventurerQuest => {
                                        console.log("ADVENTURER QUEST", adventurerQuest)
                                        console.log(adventurer);
                                        setAdventurerQuest(adventurerQuest);
                                    })
                            }
                        });
                    } else {
                        setError("Quest not found.");
                    }
                });
            }
        } catch (e: any) {
            setError("Failed to load quest details. Please try again.");
        }
    }, [id, user]);

    const acceptRequest = async () => {
        try {
            // Assuming 'id' is the questDefinitionId from props or state
            // And 'adventurer' is the AdventurerState object
            if (id && adventurer && adventurer.id) { // Check that adventurer and its ID exist
                await questService.assignQuestToAdventurer(id, adventurer.id); // Pass adventurer.id
                // Add success feedback here, e.g., a toast notification or state update
                console.log(`Quest ${id} successfully assigned to adventurer ${adventurer.name}`);
            } else {
                // Be more specific about the error
                if (!id) setError("Quest ID is missing.");
                else if (!adventurer) setError("Adventurer data is missing.");
                else if (!adventurer.id) setError("Adventurer ID is missing from the adventurer object.");
                else setError("An unknown issue occurred with IDs.");
            }
        } catch (e: any) { // Catch the actual error
            console.error("Failed to accept the quest:", e); // Log the full error
            setError(e.message || "Failed to accept the quest. Please try again."); // Display specific error message if available
        }
    }

    const completeRequest = async () => {
        try {
            if (id && adventurer) {
               await questService.completeQuestForAdventurer(id);
               await adventurerService.updateAdventurerData(adventurer.id, {
                   xp: (adventurer.experience || 0) + (details?.reward || 0)
               });
            } else {
                setError("User not authenticated or invalid quest ID.");
            }
        } catch (e) {
            setError("Failed to complete the quest. Please try again.");
        }
    }

    return (
        <div className="quest-detail-page">
            <h2>Quest Details</h2>
            {details ? (
                <div className="quest-detail">
                    <h3 className="quest-title">Title: {details.title}</h3>
                    <p className="quest-description">Description: {details.description}</p>
                    <p className="quest-reward">Reward: {details.reward} XP</p>
                    <p className="quest-status">Status: {details.completed ? "Completed" : "Incomplete"}</p>
                    {!details.completed && (!adventurerQuest || adventurerQuest.status !== 'active')
                        &&  <button onClick={acceptRequest}>Accept Request</button>
                    }
                    {!details.completed && adventurerQuest && adventurerQuest.status === 'active'
                        && adventurerQuest.adventurerId === adventurer.id
                        &&  <button onClick={completeRequest}>Complete</button>
                    }
                </div>
            ) : (
                <p>Select a quest to see the details.</p>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}