import "./AdventurerDetailPage.css";
import { useEffect, useState } from 'react';
import { auth } from '../../firebase'; // Your firebase.js file
import { onAuthStateChanged } from 'firebase/auth';
import type {AdventurerState} from "../../types/adventurer-state.ts";
import type { User } from 'firebase/auth';
import {useAdventurerService} from "../../providers/AdventuerServiceProvider.tsx";

export const AdventurerDetailPage = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null); // Stores Firebase Auth user
    const [adventurer, setAdventurer] = useState<AdventurerState | null>(null); // Stores Firestore adventurer data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const adventurerService = useAdventurerService();

    // 1. Listen for Firebase Auth state changes
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            // We don't set loading to false here yet, because we still need to fetch Firestore data
        });

        return () => unsubscribeAuth(); // Clean up auth listener
    }, []);

    // 2. Fetch adventurer data when currentUser changes (i.e., user logs in/out)
    useEffect(() => {
            if (currentUser) {
                setLoading(true);
                setError('');
                try {
                    adventurerService.fetchAdventurerData(currentUser.uid)
                        .then(res => {
                            if (res) {
                                setAdventurer(res)
                            } else {
                                setError('Not Found');
                            }
                        });
                } catch (err) {
                    console.error("Error fetching adventurer data:", err);
                    setError("Failed to load adventurer data.");
                } finally {
                    setLoading(false);
                }
            } else {
                // No user logged in, clear adventurer data and set loading to false
                setAdventurer(null);
                setLoading(false);
                setError('');
            }

    }, [currentUser]); // Re-run this effect whenever currentUser changes

    if (loading) {
        return <p>Loading adventurer profile...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    if (!currentUser) {
        return <p>Please log in to view your adventurer profile.</p>;
    }

    if (!adventurer) {
        return <p>Your adventurer profile could not be loaded or created.</p>;
    }
    return (
        <div className="adventurer-page__container">
            <h2>Adventurer Page</h2>
            <img src="/knight.jpeg" alt="" />
            {adventurer ? (
                <div className="adventurer-details__container">
                    <h3 className="adventurer-name__header">{adventurer.name}</h3>
                    <p className="adventurer-level__info">Level: {adventurer.level}</p>
                    <p className="adventurer-experience__info">Experience: {adventurer.xp} XP</p>
                </div>
            ) : (
                <p className="adventurer-no-selection__info">No adventurer selected.</p>
            )}
        </div>
    );
}