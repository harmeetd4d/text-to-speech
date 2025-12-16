import { useContext, useState } from "react";
import { Canvas } from "@react-three/fiber";
import TextDisplay from "../components/TextDisplay";
import { AudioControlContext } from "../contexts/AudioControlContext";
import SpeakerBot from "../components/SpeakerBot";
import { Environment } from "@react-three/drei";


function Home() {
    const [audioLink, setAudioLink] = useState("")
    const [showAvatar, setShowAvatar] = useState(false)
    const ELEVENLABS_API_URL = import.meta.env.VITE_API_ELEVENLABS_API_URL
    const ELEVENLABS_API_KEY = import.meta.env.VITE_API_ELEVENLABS_API_KEY;
    const { playAudio, setPlayAudio } = useContext(AudioControlContext)

    async function generateSpeech(text) {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9', {
            method: 'POST',
            headers: {
                "Accept": 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': 'sk_ef2fc819c4755c7f2fc6916d239046b02d1eafbf8ca23583',
            },

            body: JSON.stringify({ "text": text, "model_id": "eleven_multilingual_v2", "voice_settings": { "stability": 0.5, "similarity_boost": 0.7, "style": 0, "use_speaker_boost": true } }),
        });
        if (!response.ok) throw new Error("Failed to generate speech");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        console.log("///", url)
        setAudioLink(url)
        return response
    }

    const CustomButton = ({ label, onClick }) => {
        return (
            <>
                <button
                    onClick={onClick}
                    className="play-pause-btn"
                >
                    {label == "Stop" ? (
                        <img src="/images/pause.svg" />
                    ) : (
                        <img src="/images/play.svg" />
                    )}
                    {label}
                </button>
            </>
        );
    };


    return (
        <>
            <div className="inner-box" >
                <div className="content-box">
                    <TextDisplay />
                </div>
                <div className="speaker-box" >
                    {showAvatar && <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }} className="canvas-box">
                        <ambientLight intensity={0.5} />
                        <color attach="background" args={["#ececec"]} />
                        <SpeakerBot position={[0, -3, 6]} scale={2} />
                        <Environment preset="sunset" />
                    </Canvas>}
                </div>
            </div>

            <CustomButton
                label={playAudio ? 'Stop' : 'Play'}
                onClick={() => {
                    setShowAvatar(true);
                    setPlayAudio(!playAudio);
                }}
            />

            {/* <button onClick={() => generateSpeech(text)} className="btn">Create Audio Link</button> 
                    <h3>{audioLink}</h3>
                    <audio src={"https://s5-3.ttsmaker-file.com/file/2025-01-22-174513_137756.mp3"} controls autoPlay/> */}
        </>
    );
}

export default Home;
