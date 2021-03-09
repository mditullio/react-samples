import React from "react";

interface Person {
    LastName: string,
    FirstName: string,
    Age: number
}

export const Marco: Person = {
    LastName: "Di Tullio",
    FirstName: "Marco",
    Age: 31
}

const PersonDisplay = (props: { person: Person }) => {

    const [state, setState] = React.useState(0);

    const onRerenderClick = () => {
        setState(state + 1);
        console.log("State = ", state);
    }

    return (
        <>
            <div>FirstName : {props.person.FirstName}</div>
            <div>LastName : {props.person.LastName}</div>
            <div>Age : {props.person.Age}</div>
            <button onClick={onRerenderClick}>Re-render</button>
        </>
    );
}

const App = () => <div><PersonDisplay person={Marco}></PersonDisplay></div>

export default App;

