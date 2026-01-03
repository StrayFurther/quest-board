import {createContext, useContext, useEffect, useState} from 'react';
import type { ReactNode } from 'react';

import "./PopUp.css";


export type PopUpContextType = {
    isOpen: boolean;
    content: ReactNode;
    open: (content: ReactNode) => void;
    close: () => void;
};

const PopUpContext = createContext<PopUpContextType | undefined>(undefined);

export const PopUpProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode>(null);

    const open = (popupContent: ReactNode) => {
        setContent(popupContent);
        setIsOpen(true);
    };
    const close = () => {
        setIsOpen(false);
        setContent(null);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <PopUpContext.Provider value={{ isOpen, content, open, close }}>
            {children}
            {isOpen && (
                <div className="popup">
                    {content}
                    <button className="close-popup__button" onClick={close}>Close</button>
                </div>
            )}
        </PopUpContext.Provider>
    );
};

export const usePopUp = () => {
    const context = useContext(PopUpContext);
    if (!context) throw new Error('usePopUp must be used within a PopUpProvider');
    return context;
};
