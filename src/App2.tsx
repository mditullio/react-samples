import React from "react";
import { Observable } from "rxjs";
import { bufferTime } from "rxjs/operators";

const bigListGenerator = function*(size: number) {
  for (let i = 0; i < size; i++) yield Math.floor(Math.random() * 1000);
};

const createBigListObservable = (
  size: number = 100,
  spawnInterval: number = 60
) =>
  new Observable<number>(subscriber => {
    const startGenerating = async () => {
      try {
        let bigList = bigListGenerator(size);
        let next = bigList.next();
        while (!next.done) {
          let nextspawnInterval = spawnInterval * (0.5 + Math.random());
          await new Promise(resolve =>
            window.setTimeout(resolve, nextspawnInterval)
          );
          subscriber.next(next.value);
          next = bigList.next();
        }
        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    };
    startGenerating();
  });

const App = () => {
  console.log("Mount.");

  const [obs] = React.useState(() => createBigListObservable(1000, 20));

  const [obsBuffer, setObsBuffer] = React.useState<Observable<number[]>>();

  const [lastNumber, setLastNumber] = React.useState<number>();

  const [sumList, setSumList] = React.useState<
    { sum: number; count: number }[]
  >([]);

  const [complete, setComplete] = React.useState<boolean>(false);

  const [finalStat, setFinalStat] = React.useState<{
    avgSum: number;
    avgCount: number;
  }>();

  // Set obsBuffer when obs is initialize
  React.useEffect(() => {
    setObsBuffer(() => obs.pipe(bufferTime(1000, 1000)));
  }, [obs]);

  // Show an alert when it's completed and evaluate stats
  React.useEffect(() => {
    if (complete === true) {
      let finalStat = {
        avgSum: 0,
        avgCount: 0
      };
      sumList.forEach(element => {
        finalStat.avgSum += element.sum;
        finalStat.avgCount += element.count;
      });
      finalStat.avgCount /= sumList.length;
      finalStat.avgSum /= sumList.length;
      setFinalStat(finalStat);
      alert("Completed!");
    }
  }, [complete, sumList]);

  // Show the last number as soon as it's generated
  React.useEffect(() => {
    if (obs) {
      const subscriber = {
        next: (next: number) => setLastNumber(next)
      };
      const sub = obs.subscribe(subscriber);
      return () => sub.unsubscribe();
    }
  }, [obs]);

  // Buffer the values emitted at every interval and store sum & count
  React.useEffect(() => {
    if (obsBuffer) {
      const subscriber = {
        next: (next: number[]) => {
          let sum = 0;
          for (let i = 0; i < next.length; i++) sum += next[i];
          setSumList(curr => [...curr, { sum: sum, count: next.length }]);
        },
        complete: () => {
          setComplete(true);
        }
      };

      const sub = obsBuffer.subscribe(subscriber);
      return () => sub.unsubscribe();
    }
  }, [obsBuffer]);

  React.useEffect(() => {
    return () => console.log("Unmount.");
  }, []);

  return (
    <>
      {console.log("Render.")}
      <div
        style={{
          position: "fixed",
          right: "1rem;",
          backgroundColor: "black",
          color: "red",
          width: "10rem"
        }}
      >
        Last: {lastNumber ? lastNumber : "-"}
      </div>
      <div>
        {sumList.map((value, index) => (
          <p key={index}>
            {index} : {value.sum} ({value.count} spawns)
          </p>
        ))}
      </div>
      {complete && finalStat && (
        <div>
          Avg. sum : {finalStat.avgSum}, avg. count: {finalStat.avgCount}
        </div>
      )}
    </>
  );
};

export default App;
