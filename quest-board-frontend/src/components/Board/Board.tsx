import "./Board.css";
import type {BoardProperties} from "../../types/board-properties.ts";
import {QuestList} from "../Quest/QuestList.tsx";
import {usePopUp} from "../../providers/PopUpProvider.tsx";
import {CreateQuestForm} from "../Quest/CreateQuest/CreateQuestForm.tsx";

export const Board = ({quests}: BoardProperties) => {
    const { open } = usePopUp();

    const onClickAddNewQuest = () => {
        open(<CreateQuestForm />);
    };

    return (
        <div className="board-container">
            <h2>Ye Ol' Quest Board</h2>
            <button onClick={onClickAddNewQuest}>Add Quest</button>
            <QuestList quests={quests} />
        </div>
    );
}