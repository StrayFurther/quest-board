import { createContext, useContext } from "react";
import { QuestService } from "../services/quest.service.ts";

const QuestServiceContext = createContext<QuestService | null>(null);

export const QuestServiceProvider = ({ children }: { children: React.ReactNode }) => {
    const service = new QuestService();
    return (
        <QuestServiceContext.Provider value={service}>
            {children}
        </QuestServiceContext.Provider>
    );
};

export const useQuestService = () => {
    const ctx = useContext(QuestServiceContext);
    if (!ctx) throw new Error("QuestService not found");
    return ctx;
};