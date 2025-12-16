import React, { useState, useEffect, useContext } from "react";
import { FileContext } from "../contexts/FileContext";

const TextToAudio = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioPath, setAudioPath] = useState(null);
  const [error, setError] = useState("");
  const { filesUrl, setFilesUrl } = useContext(FileContext);

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      alert('Please enter some text.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/text-to-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio.');
      }

      const data = await response.json();
      setAudioPath(data.audioPath);
      setFilesUrl({ json: data.jsonFilePath, audio: data.audioFilePath })

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-audio-converter-box">
      <h2 >Text-to-Audio Converter</h2>
      <div className="flex">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here"
          rows="6"
        />
        <br />
        <button className="submit-btn" onClick={handleGenerateAudio} disabled={isLoading} >
          {isLoading ? "Generating Audio..." : "Generate Audio"}
        </button>
      </div>
    </div>
  );
};

export default TextToAudio;
