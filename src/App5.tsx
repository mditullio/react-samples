import React from "react";
import { Observable, interval, merge, Subscription } from "rxjs";
import { map, take, bufferTime } from "rxjs/operators";
import { number } from "prop-types";

const DistributionGraph = (props: {
  baseWidth?: number;
  widthUnit?: string;
  occurs: { [value: number]: number };
}) => {
  let total: number = 0;
  let children = [];

  for (const value in props.occurs) {
    if (props.occurs.hasOwnProperty(value)) {
      const element = props.occurs[value];
      total += element;
    }
  }
  let normalizedOccurs = { ...props.occurs };

  let baseWidth = props.baseWidth || 100;
  let widthUnit = props.widthUnit || "rem";

  for (const value in normalizedOccurs) {
    if (normalizedOccurs.hasOwnProperty(value)) {
      const element = normalizedOccurs[value] / total;
      normalizedOccurs[value] = element;

      let currWidth = (element * baseWidth).toString() + widthUnit;
      children.push(
        <div
          style={{
            height: "2rem",
            borderStyle: "solid",
            borderWidth: "0.25rem",
            borderColor: "gray",
            borderTopWidth: "0"
          }}
          key={value}
        >
          <div
            style={{
              position: "absolute",
              height: "2rem",
              width: currWidth,
              backgroundColor: "red",
              transition: "width 200ms"
            }}
          ></div>
          <div
            style={{
              position: "absolute"
            }}
          >
            {value}: {(element * 100).toPrecision(2)}%
          </div>
        </div>
      );
    }
  }

  return <div>{children}</div>;
};

const App = () => {
  console.log("Render.");

  const [occursTotal, setOccursTotal] = React.useState<number>(0);

  const [occurs, setOccurs] = React.useState<{ [key: number]: number }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0
  });

  const [subscription, setSubscription] = React.useState<Subscription>();

  // Start observables
  React.useEffect(() => {
    const multi = 0.25;

    const obs1 = interval(multi * 10).pipe(
      map(
        x =>
          1 +
          ((Math.floor(1 + Math.random() * 10) + (x % 300 < 150 ? 1 : -1)) % 10)
      )
    );
    const obs2 = interval(multi * 20).pipe(
      map(x => Math.floor(4 + Math.random() * 2))
    );
    const obs3 = interval(multi * 15).pipe(
      map(x => Math.floor(1 + Math.random() * 3))
    );
    const obs4 = interval(multi * 40).pipe(
      map(x => Math.floor(6 + Math.random() * 4))
    );
    const obs5 = interval(multi * 80).pipe(
      map(
        x =>
          1 +
          ((Math.floor(9 + Math.random() * 2) +
            (x % (300 + x / 5) < 150 ? 3 : -3)) %
            10)
      )
    );
    const obs6 = interval(multi * 35).pipe(
      map(x => 6 + (x % 300 < 150 ? 4 : 0))
    );

    const obsMerge = merge(obs1, obs2, obs3, obs4, obs5, obs6).pipe(
      bufferTime(100)
    );

    const subscription = obsMerge.subscribe({
      next: next => {
        setOccurs((occurs: { [key: number]: number }) => {
          const newOccurrs = { ...occurs };
          for (let i = 0; i < next.length; i++) {
            const key = next[i];
            const value = newOccurrs.hasOwnProperty(key)
              ? newOccurrs[key] + 1
              : 1;
            newOccurrs[key] = value;
          }
          return newOccurrs;
        });
        setOccursTotal(currTotal => currTotal + next.length);
      }
    });

    console.log("Observable created.");
    setSubscription(subscription);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <DistributionGraph occurs={occurs}></DistributionGraph>
      <div>Total : {occursTotal}</div>
      <button onClick={() => subscription && subscription.unsubscribe()}>
        Stop
      </button>
    </>
  );
};

export default App;
