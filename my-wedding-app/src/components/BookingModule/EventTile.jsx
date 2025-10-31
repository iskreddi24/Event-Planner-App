import "../../styles/bookingStyles.css"; 

export default function EventTile({ event, onSelect, isSelected }) {
    // Uses the CSS class 'event-tile' and the 'selected' modifier
    const tileClasses = `event-tile ${isSelected ? 'selected' : ''}`;
    return (
        <div
            onClick={onSelect}
            className={tileClasses}
        >
            {/* Note: In a real app, use absolute paths or import images */}
            <img src={event.img} alt={event.name} /> 
            <h3>{event.name}</h3>
        </div>
    );
}
