import { defaultThrottleConfig } from "rxjs/internal/operators/throttle";

// const App = (props: any) => {
// // Do some stuff here
// return <Parent json={props.json}></Parent>;
// };

// const Parent = ({ myProp }: any) => {
// return (
//     <div>
//     <Child myProp={myProp}></Child>
//     </div>
// );
// };

// const Child = ({ myProp }: any) => {
// return (
//     <div>
//     <GrandChild myProp={myProp}></GrandChild>{" "}
//     </div>
// );
// };

// const GrandChild = ({ myProp }: any) => {
// return <div>The child </div>;
// };

// export default App;

const App = (props: any) => {
  // Do some stuff here
  return (
    <Parent>
      <GrandChild myProp={props.myProp}></GrandChild>
    </Parent>
  );
};

const Parent = (props: any) => {
  return (
    <div>
      <Child>{props.children}</Child>
    </div>
  );
};

const Child = (props: any) => {
  return <div>{props.children}</div>;
};

const GrandChild = ({ myProp }: any) => {
  return <div>The child using myProp</div>;
};

export default App;
