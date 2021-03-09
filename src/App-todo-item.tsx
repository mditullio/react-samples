import React from "react";
import "./App6.css";

const TodoItem = (props: { label: string; show?: boolean }) => {
  const [classes, setClasses] = React.useState(() =>
    props.show ? ["todo-item", "example-leave"] : ["todo-item", "example-enter"]
  );

  const [firstShow, setFirstShow] = React.useState(true);

  console.log("render");

  React.useEffect(() => {
    if (firstShow) {
      setFirstShow(false);
      return;
    }
    console.log("doing animation");
    if (props.show) {
      setClasses(["todo-item", "example-enter", "example-enter-active"]);
    } else {
      setClasses(["todo-item", "example-leave", "example-leave-active"]);
    }
  }, [props.show]);

  console.log(classes);

  return <div className={classes.join(" ")}>{props.label}</div>;
};

const App = () => {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <div className="clearfix">
        <TodoItem show={show} label="Hello, world"></TodoItem>
      </div>
      <div>
        <button onClick={() => setShow(show => !show)}>Show / hide</button>
      </div>
    </>
  );
};

export default App;
