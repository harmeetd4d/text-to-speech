import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TextToAudioForm from "./pages/TextToAudioForm";


function App() {
  return (
    <div className="app">
      <div className="container" >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/text-to-audio" element={<TextToAudioForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
