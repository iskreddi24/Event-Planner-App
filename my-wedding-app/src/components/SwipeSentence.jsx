import React from "react";
import "../styles/Sentence.css"; 

function SwipeSentence() {
    const sentence = "Join us and enjoy your moments";
    const quote = "We Make Better Your Memories";
    const words = sentence.split(" ");

    const cinematicColors = [
        "#223743",
        "#680718",
        "#475962",
        "#A47816",
        "#2C3E50",
        "#34495E",
        "#7B241C",
    ];

    return (
        <div className="swipe-container">
            <p className="swipe-sentence">
                {words.map((word, index) => (
                    <span
                        key={index}
                        className={`swipe-word ${index % 2 === 0 ? "slide-top" : "slide-bottom"}`}
                        style={{
                            backgroundColor: cinematicColors[index % cinematicColors.length],
                            animationDelay: `${0.1 + index * 0.2}s`,
                        }}
                    >
                        {word}
                    </span>
                ))}
            </p>

            <p
                className="swipe-quote"
                style={{
                    animationDelay: `${0.1 + words.length * 0.2 + 0.5}s`,
                }}
            >
                {quote}
            </p>
        </div>
    );
}

export default SwipeSentence;
