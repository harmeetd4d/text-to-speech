import { createContext, useState } from 'react';

// Define the context with a consistent initial value
const FileContext = createContext({
    filesUrl: {
        json: "",
        audio: ""
    },
    setFilesUrl: () => { } // Placeholder function
});

const FileProvider = ({ children }) => {
    const [filesUrl, setFilesUrl] = useState({
        json: "audios/audio_1738586907975.json",
        audio: "audios/audio_1738586907975.ogg"
    });

    return (
        <FileContext.Provider value={{ filesUrl, setFilesUrl }}>
            {children}
        </FileContext.Provider>
    );
};

export { FileContext, FileProvider };
