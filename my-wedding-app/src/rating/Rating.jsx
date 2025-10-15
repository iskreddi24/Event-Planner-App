import React from "react";
import { FaStar } from "react-icons/fa";

function Rating({ value = 0, max = 5, onChange, readOnly = false }) {
    const stars = [];
    for (let i = 1; i <= max; i++) {
        stars.push(
            <button
                key={i}
                type="button"
                onClick={() => !readOnly && onChange && onChange(i)}
                disabled={readOnly}
                className={`text-2xl focus:outline-none ${i <= value ? "text-yellow-400" : "text-gray-300"
                    } ${!readOnly ? "cursor-pointer hover:text-yellow-300" : "cursor-default"}`}
                aria-label={`Rate ${i} stars`}
            >
                <FaStar />
            </button>
        );
    }

    return <div className="flex space-x-1">{stars}</div>;
}

export default Rating;