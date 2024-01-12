import { useRef } from "react";
import { Circle, Group, Line } from "react-konva";

const LabelTarget = ({ target }) => {
  const targetRef = useRef();

  const flattedendPoints = target.points
    ? target.points.reduce((a, b) => a.concat(b), [])
    : [];

  return (
    <>
      <Group ref={targetRef} draggable={false}>
        <Line
          points={flattedendPoints}
          stroke="black"
          strokeWidth={1}
          lineJoin="round"
          fill="red"
          closed={true}
          opacity={0.5}
        />
        {target.points &&
          target.points.map((point, index) => {
            return (
              <Circle
                key={index}
                x={point[0]}
                y={point[1]}
                radius={5}
                fill="yellow"
                stroke="yellow"
                strokeWidth={0.1}
                draggable={false}
              />
            );
          })}
      </Group>
    </>
  );
};

export default LabelTarget;
