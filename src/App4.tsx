import React from "react";

const NumberTile = (props: { value: number }) => {
  const defaultStyle: React.CSSProperties = {
    float: "left",
    width: "4rem",
    overflowX: "hidden",
    padding: "0.5rem",
    fontSize: "1.5rem",
    backgroundColor: "black",
    color: "#ff7777",
    marginRight: "0.5rem",
    marginBottom: "0.5rem"
  };

  return <div style={defaultStyle}>{props.value}</div>;
};

const NumberGrid = (props: { values: number[] }) => {
  const defaultStyle: React.CSSProperties = {
    float: "left",
    marginLeft: "0.5rem",
    marginTop: "0.5rem"
  };
  return (
    <div style={defaultStyle}>
      {props.values.map((value, index) => (
        <NumberTile key={index} value={value}></NumberTile>
      ))}
    </div>
  );
};

const App = () => {
  const [numValuesToGenerate, setNumValuesToGenerate] = React.useState<number>(
    1
  );

  const [numValuesToRemove, setNumValuesToRemove] = React.useState<number>(1);

  const [values, setValues] = React.useState<number[]>([]);

  const onChangeNumValuesToGenerate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = parseInt(event.target.value);
    setNumValuesToGenerate(Object.is(val, NaN) ? 0 : val);
  };
  const onChangeNumValuesToRemove = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = parseInt(event.target.value);
    setNumValuesToRemove(Object.is(val, NaN) ? 0 : val);
  };

  const removeValue = () => {
    setValues(oldValues =>
      oldValues.filter((value, index) => index >= numValuesToRemove)
    );
  };

  const addValue = () => {
    const newValues: number[] = [];
    for (let i = 0; i < numValuesToGenerate; i++)
      newValues.push(1 + Math.round(99 * Math.random()));

    setValues(oldValues =>
      [...oldValues, ...newValues].sort((a: number, b: number) => a - b)
    );
  };

  return (
    <>
      <div
        style={{
          marginLeft: "0.75rem",
          marginTop: "0.75rem"
        }}
      >
        <input
          type="text"
          value={numValuesToGenerate}
          onChange={onChangeNumValuesToGenerate}
        ></input>
        <button onClick={addValue}>Generate values</button>
      </div>
      <div
        style={{
          marginLeft: "0.75rem",
          marginTop: "0.75rem"
        }}
      >
        <input
          type="text"
          value={numValuesToRemove}
          onChange={onChangeNumValuesToRemove}
        ></input>
        <button onClick={removeValue}>Pop values</button>
      </div>
      <div>
        <NumberGrid values={values}></NumberGrid>
      </div>
    </>
  );
};

export default App;
