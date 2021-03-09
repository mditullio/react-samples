import React from "react";
import "./App6.css";

const TodoItem = (props: { label: string }) => {
  const [classes, setClasses] = React.useState(() => [
    "todo-item",
    "example-enter"
  ]);

  console.log("render");

  React.useEffect(() => {
    setClasses(["todo-item", "example-enter", "example-enter-active"]);
    return () =>
      setClasses(["todo-item", "example-leave", "example-leave-active"]);
  }, []);

  console.log(classes);

  return <div className={classes.join(" ")}>{props.label}</div>;
};

const App = () => {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <div className="clearfix">
        {show && <TodoItem label="Hello, world"></TodoItem>}
      </div>
      <div>
        <button onClick={() => setShow(show => !show)}>Show / hide</button>
      </div>
    </>
  );
};

export default App;
