import React, { useCallback, useState, ChangeEvent } from "react";

interface BitmapGridCellProps {
  value: boolean;
  size: number;
  sizeUM: "rem" | "px";
  onClick: () => any;
}

const BitmapGridCell = ({ value, size, sizeUM, onClick }: BitmapGridCellProps) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: "table-cell",
        width: size.toString() + sizeUM,
        height: size.toString() + sizeUM,
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "red",
        backgroundColor: value ? "black" : "white"
      }}
    ></div>
  );
};

interface BitmapGridRowProps {
  values: boolean[];
  cellSize: number;
  sizeUM: "rem" | "px";
  onCellClick: (col: number) => any;
}

const BitmapGridRow = ({ values, cellSize, sizeUM, onCellClick }: BitmapGridRowProps) => {
  return (
    <div style={{ display: "table-row" }}>
      {values.map((value, index) => (
        <BitmapGridCell
          key={index}
          value={value}
          size={cellSize}
          sizeUM={sizeUM}
          onClick={() => onCellClick(index)}
        ></BitmapGridCell>
      ))}
    </div>
  );
};

interface BitmapGridProps {
  values: boolean[][];
  cellSize: number;
  sizeUM: "rem" | "px";
  onCellClick: (row: number, col: number) => any;
}

const BitmapGrid = ({ values, cellSize, sizeUM, onCellClick }: BitmapGridProps) => {
  return (
    <div
      style={{
        display: "table",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "red"
      }}
    >
      {values.map((value, index) => (
        <BitmapGridRow
          key={index}
          values={value}
          cellSize={cellSize}
          sizeUM={sizeUM}
          onCellClick={col => onCellClick(index, col)}
        ></BitmapGridRow>
      ))}
    </div>
  );
};

interface BitmapGridState {
  grid: boolean[][];
  undoStack: boolean[][][];
  redoStack: boolean[][][];
  cellSize: number;
  sizeUM: "rem" | "px";
}

const BitmapGridState_Default: BitmapGridState = {
  grid: [
    [false, false, true, false, false],
    [false, true, false, true, false],
    [true, false, false, false, true],
    [false, true, false, true, false],
    [false, false, true, false, false]
  ],
  undoStack: [],
  redoStack: [],
  cellSize: 2,
  sizeUM: "rem"
};

const BitmapGridState_InitValues = (Rows: number, Cols: number) => {
  const grid: boolean[][] = [];
  for (let i = 0; i < Rows; i++) {
    const currRow: boolean[] = [];
    for (let j = 0; j < Cols; j++) {
      currRow.push(false);
    }
    grid.push(currRow);
  }
  console.log(grid);
  return grid;
};

type BitmapGridOperation = [
  string,
  (grid: boolean[][], row: number, col: number) => boolean[][]
];

const BitmapGridOperations: BitmapGridOperation[] = [
  [
    "Alert",
    (grid, row, col) => {
      alert(`Coordinates : Row ${row}, Col ${col}`);
      return grid;
    }
  ],
  [
    "Black pencil",
    (grid, row, col) => {
      const result = grid.map((currRowValues, currRow) =>
        currRowValues.map((currValue, currCol) =>
          currRow === row && currCol === col ? true : currValue
        )
      );
      return result;
    }
  ],
  [
    "White pencil",
    (grid, row, col) => {
      const result = grid.map((currRowValues, currRow) =>
        currRowValues.map((currValue, currCol) =>
          currRow === row && currCol === col ? false : currValue
        )
      );
      return result;
    }
  ],
  [
    "Toggle pencil",
    (grid, row, col) => {
      const result = grid.map((currRowValues, currRow) =>
        currRowValues.map((currValue, currCol) =>
          currRow === row && currCol === col ? !currValue : currValue
        )
      );
      return result;
    }
  ],
  [
    "Fill Boundary",
    (grid, row, col) => {
      const result = grid.map(currRowValues =>
        currRowValues.map(currValue => currValue)
      );

      const stack: { row: number; col: number }[] = [{ row, col }];

      while (stack.length > 0) {
        const curr = stack.pop();
        if (!curr) continue;
        if (result[curr.row][curr.col] === false) {
          result[curr.row][curr.col] = true;
          if (
            curr.row + 1 < grid.length &&
            result[curr.row + 1][curr.col] === false
          )
            stack.push({ row: curr.row + 1, col: curr.col });
          if (curr.row - 1 >= 0 && result[curr.row - 1][curr.col] === false)
            stack.push({ row: curr.row - 1, col: curr.col });
          if (
            curr.col + 1 < grid[0].length &&
            result[curr.row][curr.col + 1] === false
          )
            stack.push({ row: curr.row, col: curr.col + 1 });
          if (curr.col - 1 >= 0 && result[curr.row][curr.col - 1] === false)
            stack.push({ row: curr.row, col: curr.col - 1 });
        }
      }

      return result;
    }
  ]
];

const App = () => {
  const [bitmapGridState, setBitmapGridState] = React.useState<BitmapGridState>(
    BitmapGridState_Default
  );

  const bitmapGridState_updateGrid = useCallback((grid: boolean[][]) => {
    setBitmapGridState(currState => {
      if (Object.is(currState.grid, grid)) return currState;
      const undoStack = [...currState.undoStack, currState.grid];
      return {
        ...currState,
        undoStack,
        redoStack: [],
        grid
      };
    });
  }, []);

  const bitmapGridState_undo = useCallback(() => {
    setBitmapGridState(currState => {
      const undoStack = [...currState.undoStack];
      const grid = undoStack.pop();
      if (grid) {
        const redoStack = [...currState.redoStack, currState.grid];
        return {
          ...currState,
          undoStack,
          redoStack,
          grid
        };
      } else return currState;
    });
  }, []);

  const bitmapGridState_redo = useCallback(() => {
    setBitmapGridState(currState => {
      const redoStack = [...currState.redoStack];
      const grid = redoStack.pop();

      if (grid) {
        const undoStack = [...currState.undoStack, currState.grid];
        return {
          ...currState,
          undoStack,
          redoStack,
          grid
        };
      } else return currState;
    });
  }, []);

  const [cellSize, setCellSize] = React.useState(
    BitmapGridState_Default.cellSize.toString()
  );

  const cellSizeInput_onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setCellSize(event.target.value),
    []
  );

  const [gridDimension, setGridDimension] = useState<{
    Rows: string;
    Cols: string;
  }>({
    Rows: BitmapGridState_Default.grid.length.toString(),
    Cols: BitmapGridState_Default.grid[0].length.toString()
  });

  const gridDimensionInput_Rows_onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const X = event.target.value;
      setGridDimension(currGridDimension => {
        return { ...currGridDimension, Rows: X };
      });
    },
    []
  );

  const gridDimensionInput_Cols_onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const Y = event.target.value;
      setGridDimension(currGridDimension => {
        return { ...currGridDimension, Cols: Y };
      });
    },
    []
  );

  const [selectedOperation, setSelectedOperation] = useState(0);

  const operationSelect_onChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) =>
      setSelectedOperation(parseInt(event.target.value)),
    []
  );

  const updateViewButton_onClick = useCallback(
    () =>
      setBitmapGridState((currState: BitmapGridState) => {
        const _cellSize = parseFloat(cellSize);
        if ([_cellSize].map(v => isNaN(v)).indexOf(true) >= 0) {
          alert("Not a valid number.");
          return currState;
        }
        return {
          ...currState,
          cellSize: _cellSize
        };
      }),
    [cellSize]
  );

  const resetGridButton_onClick = useCallback(
    () =>
      setBitmapGridState((currState: BitmapGridState) => {
        const _X = parseInt(gridDimension.Rows);
        const _Y = parseInt(gridDimension.Cols);
        if ([_X, _Y].map(v => isNaN(v)).indexOf(true) >= 0) {
          alert("Not a valid number.");
          return currState;
        }
        return {
          ...currState,
          grid: BitmapGridState_InitValues(_X, _Y)
        };
      }),
    [gridDimension]
  );

  const bitmapGridCell_onClick = useCallback(
    (row: number, col: number) => {
      console.log("update grid");
      const newGrid = BitmapGridOperations[selectedOperation][1](
        bitmapGridState.grid,
        row,
        col
      );
      console.log("update grid");
      bitmapGridState_updateGrid(newGrid);
    },
    [bitmapGridState.grid, bitmapGridState_updateGrid, selectedOperation]
  );

  return (
    <div style={{ margin: "15px" }}>
      <div style={{ marginBottom: "10px" }}>
        <div>
          Cell Size:{" "}
          <input
            type="text"
            value={cellSize}
            onChange={cellSizeInput_onChange}
          ></input>
        </div>
        <div>
          <button onClick={updateViewButton_onClick}>Update view</button>
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <div>
          Grid Dimension:{" "}
          <input
            type="text"
            value={gridDimension.Rows}
            onChange={gridDimensionInput_Rows_onChange}
          ></input>{" "}
          Rows x{" "}
          <input
            type="text"
            value={gridDimension.Cols}
            onChange={gridDimensionInput_Cols_onChange}
          ></input>{" "}
          Cols{" "}
        </div>
        <div>
          <button onClick={resetGridButton_onClick}>Reset grid</button>
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <div>
          Selected operation:{" "}
          <select onChange={operationSelect_onChange}>
            {BitmapGridOperations.map((op, index) => (
              <option key={index} value={index}>
                {op[0]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={bitmapGridState_undo}>
            Undo ({bitmapGridState.undoStack.length})
          </button>
          <button onClick={bitmapGridState_redo}>
            Redo ({bitmapGridState.redoStack.length})
          </button>
        </div>
      </div>

      <BitmapGrid
        values={bitmapGridState.grid}
        cellSize={bitmapGridState.cellSize}
        sizeUM={bitmapGridState.sizeUM}
        onCellClick={bitmapGridCell_onClick}
      ></BitmapGrid>
    </div>
  );
};

export default App;
