import React from "react";
import "../styles/Sentence.css";

function SwipeSentence() {
    const sentence = "Join us and enjoy your moments";
    const quote = "We Make Better Your Memories"; // ⬅️ NEW QUOTE
    const words = sentence.split(' ');

    const cinematicColors = [
        '#223743', // Dark Slate Blue
        '#680718', // Deep Crimson Red
        '#475962', // Medium Slate Gray
        '#A47816', // Metallic Gold/Bronze
        '#2C3E50', // Darker Blue-Gray
        '#34495E', // Another dark blue-gray
        '#7B241C', // Deepest Red
    ];

    return (
        <div className="premium-sentence-container cinematic-background">
            <p className="premium-sentence-wrapper">
                {words.map((word, index) => (
                    <span 
                        key={index}
                        className={`animated-word-block ${index % 2 === 0 ? 'from-top' : 'from-bottom'}`}
                        style={{
                            backgroundColor: cinematicColors[index % cinematicColors.length],
                            // Sequential delay
                            animationDelay: `${0.1 + index * 0.2}s`, 
                        }}
                    >
                        {word}
                    </span>
                ))}
            </p>
            
            {/* ⬅️ NEW QUOTE ELEMENT */}
            <p 
                className="cinematic-quote"
                style={{ animationDelay: `${0.1 + words.length * 0.2 + 0.5}s` }} 
                // This ensures the quote starts fading in after the last word (moments) has settled, plus a 0.5s pause.
            >
                {quote}
            </p>
        </div>
    );
}

export default SwipeSentence;