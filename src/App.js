import './App.css';
import React from 'react';
import Node from './components/Node';
import { dijkstra, getNodesInShortestPathOrder } from './algorithms/dijkstra';
import { Button } from 'antd'



export default function App() {

  const [START_NODE_ROW, setSTART_NODE_ROW] = React.useState(-1)
  const [START_NODE_COL, setSTART_NODE_COL] = React.useState(-1)
  const [FINISH_NODE_ROW, setFINISH_NODE_ROW] = React.useState(-1)
  const [FINISH_NODE_COL, setFINISH_NODE_COL] = React.useState(-1)

  const [grid, setGrid] = React.useState([])
  const [mouseIsPressed, setMouseIsPressed] = React.useState(false)
  const [startNodePlaced, setStartNodePlaced] = React.useState(false)
  const [endNodePlaced, setEndNodePlaced] = React.useState(false)

 
  React.useEffect(() => {
    setGrid(getInitialGrid())
  }, [])

  function getInitialGrid() {
    const grid = [];
    for (let row = 0; row < 25; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  function createNode(col, row) {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    }
  }

  function handleMouseDown(row, col) {
    console.log(`In Enter row ${row}`)

    if(!startNodePlaced){
      const newGrid = setStartNode(row, col);
      setGrid(newGrid)
      console.log(`After setStart ${START_NODE_ROW}`)
      console.log(`After setStart ${START_NODE_COL}`)
    }else if(!endNodePlaced){
      const newGrid = setEndNode(row, col);
      setGrid(newGrid)
    }else{
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid)
      setMouseIsPressed(true)
    }
  }

  function handleMouseEnter(row, col) {
    if (!startNodePlaced) return;
    if (!endNodePlaced) return;
    if (!mouseIsPressed) return;

    if(!startNodePlaced){
      const newGrid = setStartNode(row, col);
      setGrid(newGrid)
    }else if(!endNodePlaced){
      const newGrid = setEndNode(row, col);
      setGrid(newGrid)
    }else{
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid)
      setMouseIsPressed(true)
    }
  }

  function handleMouseUp() {
    setMouseIsPressed(false)
  }

  function getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  function setStartNode(row, col) {
    setSTART_NODE_ROW(row);
    setSTART_NODE_COL(col);

    console.log(`In setStart ${START_NODE_ROW}`)
    console.log(`In setStart ${START_NODE_COL}`)

    setStartNodePlaced(true)
    
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isStart: true,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  function setEndNode(row, col) {
    setFINISH_NODE_ROW(row);
    setFINISH_NODE_COL(col);
    setEndNodePlaced(true)

    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isFinish: true,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  function visualizeDijkstra() {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if(i === 0){
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path-start-node';
        } else if(i === nodesInShortestPathOrder.length-1){
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path-end-node';
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
        }
      }, 50 * i);
    }
  }


  return (
    <div className="App">
      <Button onClick={visualizeDijkstra} type='primary'>Visualize Dijkstra Algorithm</Button>
      <p>Place Start and End Node First</p>
      <p>Press and drag on circles to put walls and then press the button.  </p>
      <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        handleMouseEnter(row, col)
                      }
                      onMouseUp={() => handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
    </div>
  );
}
