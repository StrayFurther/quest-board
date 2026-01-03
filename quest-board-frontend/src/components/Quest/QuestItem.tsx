import "./QuestItem.css";
import { useNavigate } from 'react-router-dom';
import type {Quest} from "../../types/quest.ts";

export const QuestItem = ({quest}: {quest: Quest}) => {
    const navigate = useNavigate();
    const viewDetails = () => {
        navigate("/quest/" + quest.id);
    }

    return (
        <div className="quest-item">
            <h3 className="quest-title">{quest.title}</h3>
            <p className="quest-reward">Reward: {quest.reward} XP</p>
            <p className="quest-status">Status: {quest.completed ? "Completed" : "Incomplete"}</p>
            <button onClick={viewDetails}>Details</button>
        </div>
    );
}