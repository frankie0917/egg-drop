import React, { useEffect, useState } from 'react';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

export default function App() {
  const [EGGS, setEGGS] = useState(2);
  const [FLOORS, setFLOORS] = useState(100);
  const [memo, setMemo] = useState<any>(
    new Array(FLOORS + 1).fill(null).map(() => new Array(EGGS + 1).fill(null)),
  );

  const eggDrop = (eggs: number, curFloor: number): number => {
    if (memo[curFloor][eggs] !== null) {
      return memo[curFloor][eggs] || 0;
    }

    if (curFloor === 0 || curFloor === 1) {
      const tmp = [...memo];

      tmp[curFloor][eggs] = curFloor;
      setMemo(tmp);

      return curFloor;
    }

    if (eggs === 1) {
      const tmp = [...memo];
      tmp[curFloor][eggs] = curFloor;
      setMemo(tmp);

      return curFloor;
    }

    let min = Infinity;

    //  from 1 to k
    for (let floor = 1; floor <= curFloor; floor++) {
      const eggBreak = eggDrop(eggs - 1, floor - 1);
      const eggSurvived = eggDrop(eggs, curFloor - floor);
      // compute the worst case
      const worstCase = Math.max(eggBreak, eggSurvived);

      // document the least tries
      if (worstCase < min) {
        min = worstCase;
      }
    }
    const tmp = [...memo];

    tmp[curFloor][eggs] = min + 1;
    setMemo(tmp);
    return min + 1;
  };

  useEffect(() => {
    setMemo(
      new Array(FLOORS + 1)
        .fill(null)
        .map(() => new Array(EGGS + 1).fill(null)),
    );
    eggDrop(EGGS, FLOORS);
  }, [EGGS, FLOORS]);

  return (
    <div
      className="App"
      style={{
        marginTop: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="eggs">eggs</label>
          <input
            id="eggs"
            type="text"
            value={EGGS}
            onChange={(e) => setEGGS(Number(e.target.value))}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="floors">floors</label>
          <input
            id="floors"
            type="text"
            value={FLOORS}
            onChange={(e) => setFLOORS(Number(e.target.value))}
          />
        </div>
      </div>

      <LineChart
        width={1000}
        height={400}
        data={memo.map((floor, index) => {
          const obj: any = { floor: index };
          floor.forEach((val, i) => (obj[i + ' egg'] = val));
          return obj;
        })}
        margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis dataKey="floor" />
        <YAxis />
        <Tooltip />
        <Legend />
        {memo[0].map((_, i) => (
          <Line type="monotone" dataKey={i + ' egg'} stroke="#82ca9d" />
        ))}
      </LineChart>
    </div>
  );
}
