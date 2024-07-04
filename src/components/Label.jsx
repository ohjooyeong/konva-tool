import { useRef } from "react";
import { Circle, Group, Line } from "react-konva";

const Label = ({ handleUpdateLabelList, label }) => {
  const labelRef = useRef();

  // 캔버스 밖으로 나가는 것 막기 (임시 기능 완성x)
  const preventCanvasOutside = (shape) => {
    const box = shape.getClientRect(); // 현재 객체의 경계 정보
    const absPos = shape.getAbsolutePosition(); // 현재 객체의 절대 위치

    // 경계 정보와 절대 위치 간의 차이를 계산하여 오프셋 값
    const offsetX = box.x - absPos.x;
    const offsetY = box.y - absPos.y;

    const newAbsPos = { ...absPos };

    // 객체가 캔버스의 왼쪽 경계를 넘는 경우, 객체의 x 위치를 조정
    if (box.x < 0) {
      newAbsPos.x = -offsetX;
    }

    // 객체의 위쪽 y 위치 조정
    if (box.y < 0) {
      newAbsPos.y = -offsetY;
    }

    // 객체의 오른쪽 x 위치 조정
    if (box.x + box.width > shape.getStage().width()) {
      newAbsPos.x = shape.getStage().width() - box.width - offsetX;
    }

    // 객체의 아래 y 위치 조정
    if (box.y + box.height > shape.getStage().height()) {
      newAbsPos.y = shape.getStage().height() - box.height - offsetY;
    }

    // 객체의 절대 위치를 다시 조정
    shape.setAbsolutePosition(newAbsPos);
  };

  const handleDragMove = (e) => {
    if (!labelRef.current) {
      return;
    }
    // 그룹 드래그시 캔버스 경계 나가는 것 막기
    preventCanvasOutside(e.target);
  };

  const handleMouseUp = (e) => {
    if (!labelRef.current) {
      return;
    }

    if (!e.target.attrs.points) {
      return;
    }
  };

  const handleDragMoveCirclePoint = (e) => {
    // 원 포인트 드래그시 캔버스 경계 나가는 것 막기
    preventCanvasOutside(e.target);

    // 클릭한 원 인덱스
    const index = e.target.index - 1;

    // 클릭한 원 위치
    const pos = [e.target.attrs.x, e.target.attrs.y];

    // 원 위치 업데이트시 라벨 업데이트
    handleUpdateLabelList(label.id, {
      points: [
        ...label.points.slice(0, index),
        pos,
        ...label.points.slice(index + 1),
      ],
    });
  };

  const flattedendPoints = label.points
    ? label.points.reduce((a, b) => a.concat(b), [])
    : [];

  return (
    <>
      <Group
        ref={labelRef}
        draggable={true} // 드래그 가능
        onDragMove={handleDragMove}
        onMouseUp={handleMouseUp}
      >
        <Line
          points={flattedendPoints}
          stroke="black"
          strokeWidth={1}
          lineJoin="round"
          fill="red"
          closed={true}
          opacity={0.5}
        />
        {label.points &&
          label.points.map((point, index) => {
            return (
              <Circle
                key={index}
                x={point[0]}
                y={point[1]}
                radius={5}
                fill="yellow"
                stroke="yellow"
                strokeWidth={0.1}
                onDragMove={handleDragMoveCirclePoint}
                draggable={true} // 드래그 가능
              />
            );
          })}
      </Group>
    </>
  );
};

export default Label;
