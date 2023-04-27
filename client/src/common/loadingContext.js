import React, { useState, createContext } from "react";

export const LoadingContext = createContext("");

const Context = ({ children }) => {
    const [loadingData, setLoadingData] = useState("");

    return (
        <LoadingContext.Provider value={{ loadingData, setLoadingData }}>
            {children}
        </LoadingContext.Provider>
    );
};

export default Context;
