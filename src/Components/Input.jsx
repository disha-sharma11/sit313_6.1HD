import './Input.css';

function Input(props) {
    return (
        <div style={{width: "100%"}}>
            <input
            name={props.name}
            type={props.what === "Password" ? "password" : "text"}
            className={props.className}
            placeholder={`Type ${props.placeholder}`}
            value={props.value}
            onChange={props.onChange} />
        </div>
    );
}

export default Input;