import './CardDisplay.css';

function CardDisplay({ children }) {
    return (
        <div className="card-container">
            {children}
        </div>
    );
}

export default CardDisplay;
