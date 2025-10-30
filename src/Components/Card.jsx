import './Card.css';

function Card(props) {
    return (
        <div className="card">
            <img src={props.image} alt={props.title} className="card-image" />
            <h2 className="card-title">{props.title}</h2>
            <p className="card-description">{props.description}</p>
            <p className="card-example">{props.example}</p>
            <p className="card-rating">⭐ {props.rating} STARS </p>
            <p className="card-author">By {props.author}</p>
        </div>
    );
}

export default Card;