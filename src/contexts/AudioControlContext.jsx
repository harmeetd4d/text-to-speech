import { createContext, useState } from 'react';

// Define the context with a consistent initial value
const AudioControlContext = createContext({
    playAudio: false,
    setPlayAudio: () => { } 
});

const AudioControlProvider = ({ children }) => {
    const [playAudio, setPlayAudio] = useState(false);

    return (
        <AudioControlContext.Provider value={{ playAudio, setPlayAudio }}>
            {children}
        </AudioControlContext.Provider>
    );
};

export { AudioControlContext, AudioControlProvider };
