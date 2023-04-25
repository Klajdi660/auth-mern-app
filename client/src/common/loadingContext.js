import React, { useState, createContext } from "react";

export const LoadingContext = createContext("");

const Context = ({ children }) => {
    const [loading, setLoading] = useState("");

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export default Context;
