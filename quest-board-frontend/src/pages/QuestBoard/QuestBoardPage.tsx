import './QuestBoardPage.css';
import {useEffect, useState} from "react";
import type {Quest} from "../../types/quest.ts";
import {Board} from "../../components/Board/Board.tsx";
import {useQuestService} from "../../providers/QuestServiceProvider.tsx";

export const QuestBoardPage = () => {
    const questService = useQuestService();
    const [quests, setQuests] = useState<Quest[]>([]);

    useEffect(() => {
        questService.getAllQuests()
            .then((quests) => {setQuests(quests.filter(q => !q.completed));})
    },[]);

    return (
        <div className="quest-board-page__container">
            <Board quests={quests}/>
        </div>
    );
}