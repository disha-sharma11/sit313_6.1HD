
function Button(props) {
  return (
    <div>
      <button 
        type={props.type} 
        onClick={props.onClick} 
        className={props.className ? props.className : "Button"}>
        {props.text}
      </button>
    </div>
  );
}

export default Button;