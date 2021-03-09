import React, { useCallback, useState } from "react";
import * as ix from "ix";

function* mySeq() {
  let I = [1, 2];
  yield I[0];
  yield I[1];
  while (true) {
    I = [I[1], I[0] + I[1]];
    yield I[1];
  }
}

var seqTransform = (seq: () => IterableIterator<number>) => {
  return ix.Iterable.from(
    ix.Iterable.from(seq())
      .pipe(ix.iterablePipe.map(x => x + x))
      .skip(1)
  );
};

const iterable = mySeq();
const ixIterablePtr = {
  value: seqTransform(mySeq)
};

const App = () => {
  const getNext10Elems1 = useCallback(() => {
    let result: number[] = [];
    while (result.length < 10) {
      result.push(iterable.next().value);
    }
    return result;
  }, []);

  const getNext10Elems2 = useCallback(() => {
    let result: number[] = ixIterablePtr.value
      .take(5)
      .take(10)
      .toArray();
    return result;
  }, []);

  const [next10Elems1, setNext10Elems1] = useState(() => getNext10Elems1());
  const [next10Elems2, setNext10Elems2] = useState(() => getNext10Elems2());

  const button_onClick = useCallback(() => {
    setNext10Elems1(getNext10Elems1());
    setNext10Elems2(getNext10Elems2());
  }, [setNext10Elems1, getNext10Elems1, setNext10Elems2, getNext10Elems2]);

  return (
    <div>
      <div>
        <div>1)</div>
        {next10Elems1.map(value => (
          <span>{value};</span>
        ))}
      </div>
      <div>
        <div>2)</div>
        {next10Elems2.map(value => (
          <span>{value};</span>
        ))}
      </div>
      <button onClick={button_onClick}>Next</button>
    </div>
  );
};

export default App;
