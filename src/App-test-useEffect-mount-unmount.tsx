import React, { useState, Suspense } from "react";

const AppInner = () => {
  console.log("mount");

  let [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    console.log("useEffect on mount");
    return () => console.log("useEffect on unmount");
  }, []);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      {console.log("render")}
      <div>Count: {count}</div>
      <button onClick={increment}>+</button>{" "}
      <button onClick={decrement}>-</button>
    </div>
  );
};

const App = () => {
  const [key, setKey] = React.useState(0);

  return (
    <>
      <AppInner key={key}></AppInner>
      <button onClick={() => setKey(key + 1)}>Re-init</button>
    </>
  );
};

export default App;
