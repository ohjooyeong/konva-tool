import { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Line, Rect, Stage } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import Label from "./components/Label";
import LabelSection from "./components/LabelSection";

function App() {
  const [canvSize, setCanvSize] = useState({ canvWidth: 0, canvHeight: 0 });
  const [points, setPoints] = useState([]); // 현재 포인트
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [isFinished, setIsFinished] = useState(true);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);
  const [labelList, setLabelList] = useState([]);

  const areaRef = useRef();
  const stageRef = useRef();
  const layerRef = useRef();

  const handleResizeCanvas = () => {
    if (!areaRef.current) {
      return;
    }
    const { clientWidth, clientHeight } = areaRef.current;
    setCanvSize({
      canvWidth: clientWidth,
      canvHeight: clientHeight,
    });
  };

  // 초기 canvas size
  useEffect(() => {
    if (!areaRef.current) {
      return;
    }
    const { clientWidth, clientHeight } = areaRef.current;
    setCanvSize({
      canvWidth: clientWidth,
      canvHeight: clientHeight,
    });
  }, []);

  // resize canvas size
  useEffect(() => {
    window.addEventListener("resize", handleResizeCanvas);
    return () => {
      window.removeEventListener("resize", handleResizeCanvas);
    };
  }, []);

  const handleStartDraw = useCallback(() => {
    setIsFinished(false);
  }, []);

  // 라벨 리스트 업데이트
  const handleUpdateLabelList = (id, attrs) => {
    const updateLabelList = labelList.map((obj) => {
      if (obj.id !== id) {
        return obj;
      }
      return {
        ...obj,
        ...attrs,
      };
    });
    setLabelList(updateLabelList);
  };

  // Stage 절대 포인트
  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };

  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);

    // 라벨 생성전에는 이벤트 막기
    if (isFinished) {
      return;
    }

    if (isMouseOverStartPoint && points.length >= 3) {
      setIsFinished(true);

      const target = {
        id: uuidv4(),
        points: points,
      };

      setLabelList([...labelList, target]);

      setPoints([]);
    } else {
      // points 업데이트
      setPoints([...points, mousePos]);
    }
  };

  // 현재 마우스 points 계산
  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);

    setCurMousePos(mousePos);
  };

  // 첫번째 점 커지게 만들기.
  const handleMouseOverStartPoint = (e) => {
    if (isFinished || points.length < 3) return;
    e.target.scale({ x: 2, y: 2 });
    setIsMouseOverStartPoint(true);
  };

  // 첫번째 점 작게 만들기
  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
    setIsMouseOverStartPoint(false);
  };

  // 현재 포인트 flatten [[x, y], [x, y]] => [x, y, x, y]
  const flattenedPoints = points
    .concat(isFinished ? [] : curMousePos)
    .reduce((a, b) => a.concat(b), []);

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-row w-full h-full basis-7/8">
        <div className="w-4/5 bg-gray-200" ref={areaRef}>
          <Stage
            ref={stageRef}
            width={canvSize.canvWidth}
            height={canvSize.canvHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          >
            <Layer ref={layerRef}>
              <Line
                points={flattenedPoints}
                stroke="black"
                dash={[5, 5]}
                strokeWidth={3}
                closed={isFinished}
              />
              {points.map((point, index) => {
                const width = 7;
                const x = point[0] - width / 2;
                const y = point[1] - width / 2;

                // point값이 시작점일 때만
                const startPointAttr =
                  index === 0
                    ? {
                        hitStrokeWidth: 12,
                        onMouseOver: handleMouseOverStartPoint,
                        onMouseOut: handleMouseOutStartPoint,
                      }
                    : null;
                return (
                  <Rect
                    key={index}
                    x={x}
                    y={y}
                    width={width}
                    height={width}
                    fill="red"
                    stroke="yellow"
                    strokeWidth={1}
                    {...startPointAttr}
                  />
                );
              })}
              {/* 만들어진 폴리곤 라벨 */}
              {labelList.length > 0 &&
                labelList.map((label) => (
                  <Label
                    key={label.id}
                    label={label}
                    handleUpdateLabelList={handleUpdateLabelList}
                  />
                ))}
            </Layer>
          </Stage>
        </div>
        <LabelSection handleStartDraw={handleStartDraw} labelList={labelList} />
      </div>
    </div>
  );
}

export default App;
