import { createContext, useContext } from "react";
import {AdventurerService} from "../services/adventurer.service.ts";

const AdventurerServiceContext = createContext<AdventurerService | null>(null);

export const AdventurerServiceProvider = ({ children }: { children: React.ReactNode }) => {
    const service = new AdventurerService();
    return (
        <AdventurerServiceContext.Provider value={service}>
            {children}
        </AdventurerServiceContext.Provider>
    );
};

export const useAdventurerService = () => {
    const ctx = useContext(AdventurerServiceContext);
    if (!ctx) throw new Error("AdventurerService not found");
    return ctx;
};