import React, { useState, useRef, useContext } from "react";
import { FileContext } from "../contexts/FileContext";

const TextToSpeech = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const { filesUrl, setFilesUrl } = useContext(FileContext);

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await fetch('https://text-to-speech-backend-seven.vercel.app/api/generate-lipsync', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setFilesUrl({json: data.jsonFilePath, audio: data.audioFilePath })

    } catch (error) {
      console.error('Error generating lip sync JSON:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://text-to-speech-backend-seven.vercel.app/api/convertTextToSpeech', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      // Get the audio file path from the response
      setAudioUrl(`https://text-to-speech-backend-seven.vercel.app/${response.data.audioFilePath}`);
    } catch (err) {
      setError('Error generating audio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "10rem" }}>
        <h1>Text to Speech</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter text"
            rows="5"
            style={{ width: "100%" }}
          ></textarea>
          <button type="submit" disabled={loading}>Convert to Speech</button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {audioUrl && (
          <div>
            <h3>Generated Audio</h3>
            <audio controls>
              <source src={audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>

      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <input type="file" accept="audio/*" onChange={handleFileUpload} />
        <button onClick={handleGenerate} disabled={!audioFile}>
          Generate Lip Sync
        </button>
      </div>
    </>
  );
};

export default TextToSpeech;
