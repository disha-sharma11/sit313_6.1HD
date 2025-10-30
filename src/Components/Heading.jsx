import './Heading.css';

function Heading(props) {
  return (
    <h1 className="heading">{props.title}</h1>
  );
}

export default Heading;