import React from 'react'

const TextDisplay = () => {

    // function startReading() {
    //     const textElement = document.getElementById("text");
    //     let text = textElement?.innerText; // innerText ignores tags and extracts only visible text
    //     let words = text?.split(/\s+/); // Split by whitespace
    //     let currentIndex = 0;

    //     // Speech Synthesis API
    //     let utterance = new SpeechSynthesisUtterance(text);
    //     let voices = speechSynthesis.getVoices();
    //     utterance.voice = voices[0];

    //     utterance.onboundary = (event) => {
    //         let word = words[currentIndex];
    //         textElement.innerHTML = words
    //             .map((w, i) => (i === currentIndex ? `<span class="highlight">${w}</span>` : w))
    //             .join(" ");
    //         currentIndex++;
    //     };

    //     speechSynthesis.speak(utterance);
    // }
    // startReading();


    return (
        <div>
            <div id="text">
                <p>
                    Welcome to Week 1 of your journey into the medical staffing industry! This week, we’ll start by building a strong foundation. You’ll learn what the medical staffing industry is, how it has evolved, and why it plays such a critical role in today’s healthcare landscape. Understanding these basics will set the stage for developing your own successful staffing agency.
                </p>

                <h3>1. Definition and Scope of Medical Staffing</h3>

                <p>Medical staffing refers to the process of connecting healthcare facilities, like long-term care facilities, nursing homes, rehabilitation centers, assisted living facilities, hospitals and clinics, with qualified healthcare professionals who can fill temporary, permanent, or per-diem roles. These professionals range from Certified Nursing Assistants (CNAs) and Nurses to specialized physicians and allied health workers.</p>

                <p>Think of medical staffing agencies as matchmakers. For example, if a long-term care facility or hospital experiences a sudden influx of patients, they might turn to a staffing agency to provide additional Certified Nursing Assistants (CNAs) or nurses on short notice. Agencies ensure facilities maintain quality care without the time-consuming process of direct hiring.</p>

            </div>
        </div >
    )
}

export default TextDisplay