import "./CreateQuestForm.css";
import {useState} from "react";
import {useQuestService} from "../../../providers/QuestServiceProvider.tsx";
import {usePopUp} from "../../../providers/PopUpProvider.tsx";
import {useAuth} from "../../../providers/AuthProvider.tsx";

export const CreateQuestForm = ()  => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const questService = useQuestService();
    const { close } = usePopUp();
    const {user} = useAuth();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await questService.createNewQuestDefinition(
                {title, description, reward},
                user?.uid
            );
            close();
            setLoading(false);
            setError(null);
            window.location.reload();
        } catch(err: any) {
            console.log(err);
            setError(err);
            setLoading(false);
            return;
        }
    }

    return (
        <div className="create-request__container">
            <h1>New Quest</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text" // Changed to type="email"
                        id="title"
                        name="title"
                        value={title} // Controlled component
                        onChange={(e) => setTitle(e.target.value)} // Update state on change
                        required // Added required attribute
                        disabled={loading} // Disable inputs during loading
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="reward">Reward:</label>
                    <input
                        type="number"
                        id="reward"
                        name="reward"
                        value={reward === 0 ? "" : reward}
                        onChange={(e) => {
                            const val = e.target.value;
                            setReward(val === "" ? 0 : parseInt(val, 10));
                        }}
                        required
                        disabled={loading}
                    />

                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Quest...' : 'Create Quest'}
                </button>
            </form>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}