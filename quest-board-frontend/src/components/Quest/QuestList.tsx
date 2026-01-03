import "./QuestList.css";
import type {Quest} from "../../types/quest.ts";
import {QuestItem} from "./QuestItem.tsx";

export const QuestList = ({quests}: {quests: Quest[]}) => {
    return (
        <div className="quest-list">
            <div className="quest-list-items">
                {quests.map((quest) => (
                    <QuestItem quest={quest} key={"quest-" + quest.id}/>
                ))}
            </div>
        </div>
    );
}