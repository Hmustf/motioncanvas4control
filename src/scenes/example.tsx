import {makeScene2D, Line, Circle, Txt} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, Vector2, createSignal, waitFor, linear, easeInOutQuad} from '@motion-canvas/core';
import rawData from '../../response_points.json';

// Canvas dimensions
const WIDTH = 1000;
const HEIGHT = 600;
const PADDING = 60;

// Axis limits
const X_MIN = 0;
const X_MAX = 10;
const Y_MIN = 0;
const Y_MAX = 2;

// Calculate centering offsets
const X_OFFSET = -WIDTH/2;
const Y_OFFSET = -HEIGHT/2;

// Convert data points to canvas coordinates
function dataToCanvas(x: number, y: number): Vector2 {
  const canvasX = X_OFFSET + PADDING + (x - X_MIN) * (WIDTH - 2 * PADDING) / (X_MAX - X_MIN);
  const canvasY = Y_OFFSET + HEIGHT - PADDING - (y - Y_MIN) * (HEIGHT - 2 * PADDING) / (Y_MAX - Y_MIN);
  return new Vector2(canvasX, canvasY);
}

// Type for our JSON data
interface ResponseData {
  points: [number, number][];
  peak_time_percentage: number;
  peak_value: number;
}

// Extract data from JSON
const data = rawData as ResponseData;
const responsePoints: Vector2[] = data.points.map(([t, y]) => dataToCanvas(t, y));
const peakTimePercentage = data.peak_time_percentage;
const peakValue = data.peak_value;

export default makeScene2D(function* (view) {
  view.fill('#111111');

  // Create signals for tracking
  const progress = createSignal(0);
  
  // Reference to the response curve
  const responseCurve = createRef<Line>();

  // Create signals for current point based on line's end
  const currentPoint = createSignal(() => {
    const line = responseCurve();
    if (!line) return responsePoints[0];
    
    const visibleLength = line.getPointAtPercentage(progress()).position;
    return visibleLength;
  });

  // Create signals for current values
  const currentX = createSignal(() => {
    const point = currentPoint();
    return (point.x - X_OFFSET - PADDING) * (X_MAX - X_MIN) / (WIDTH - 2 * PADDING);
  });
  const currentY = createSignal(() => {
    const point = currentPoint();
    return (HEIGHT - PADDING - (point.y - Y_OFFSET)) * (Y_MAX - Y_MIN) / (HEIGHT - 2 * PADDING);
  });

  view.add(
    <>
      {/* X-axis */}
      <Line
        stroke={'#DDD'}
        lineWidth={2}
        points={[
          dataToCanvas(X_MIN, 0),
          dataToCanvas(X_MAX + 0.2, 0),
        ]}
        endArrow
        arrowSize={12}
      />
      
      {/* Y-axis */}
      <Line
        stroke={'#DDD'}
        lineWidth={2}
        points={[
          dataToCanvas(0, Y_MIN),
          dataToCanvas(0, Y_MAX + 0.1),
        ]}
        endArrow
        arrowSize={12}
      />

      {/* X-axis ticks and labels */}
      {[0, 2, 4, 6, 8, 10].map(x => (
        <>
          <Line
            stroke={'#DDD'}
            lineWidth={2}
            points={[
              dataToCanvas(x, 0),
              dataToCanvas(x, -0.05),
            ]}
          />
          <Txt
            text={x.toString()}
            fill={'#DDD'}
            fontSize={20}
            position={dataToCanvas(x, -0.15)}
          />
        </>
      ))}

      {/* Y-axis ticks and labels */}
      {[0, 0.5, 1.0, 1.5, 2.0].map(y => (
        <>
          <Line
            stroke={'#DDD'}
            lineWidth={2}
            points={[
              dataToCanvas(0, y),
              dataToCanvas(-0.2, y),
            ]}
          />
          <Txt
            text={y.toFixed(1)}
            fill={'#DDD'}
            fontSize={20}
            position={dataToCanvas(-0.5, y)}
          />
        </>
      ))}

      {/* Axis labels */}
      <Txt
        text={'Time (s)'}
        fill={'#DDD'}
        fontSize={24}
        position={dataToCanvas(5, -0.3)}
      />
      <Txt
        text={'Response'}
        fill={'#DDD'}
        fontSize={24}
        position={dataToCanvas(-1.5, 1)}
        rotation={-90}
      />

      {/* Response curve */}
      <Line
        ref={responseCurve}
        stroke={'#e6a700'}
        lineWidth={3}
        points={responsePoints}
        end={() => progress()}
        lineCap={'round'}
        lineJoin={'round'}
      />

      {/* X-axis tracker */}
      <Line
        stroke={'#e6a700'}
        lineWidth={2}
        points={() => [
          dataToCanvas(currentX(), 0),
          currentPoint()
        ]}
        opacity={0.5}
      />
      <Circle
        size={15}
        fill={'#e6a700'}
        position={() => dataToCanvas(currentX(), 0)}
      />

      {/* Y-axis tracker */}
      <Line
        stroke={'#e6a700'}
        lineWidth={2}
        points={() => [
          dataToCanvas(0, currentY()),
          currentPoint()
        ]}
        opacity={0.5}
      />
      <Circle
        size={15}
        fill={'#e6a700'}
        position={() => dataToCanvas(0, currentY())}
      />

      {/* Tracking point */}
      <Circle
        size={20}
        fill={'#e6a700'}
        position={() => currentPoint()}
      />

      {/* Value labels */}
      <Txt
        fill={'#e6a700'}
        fontSize={20}
        position={() => dataToCanvas(-0.8, currentY())}
        text={() => currentY().toFixed(2)}
      />
      <Txt
        fill={'#e6a700'}
        fontSize={20}
        position={() => dataToCanvas(currentX(), -0.2)}
        text={() => currentX().toFixed(2)}
      />
    </>
  );

  // Animation sequence
  yield* waitFor(0.5);

  // Start drawing the curve
  const drawDuration = 6;
  const peakTime = peakTimePercentage * drawDuration;
  
  // Calculate peak point position
  const peakX = -300 + (peakTimePercentage * 10) * 60;
  const peakY = -300 + (peakValue / 2) * 600;

  // Draw until peak while moving camera
  yield* all(
    progress(peakTimePercentage, peakTime, linear),
    view.position.x(peakX/2, peakTime, easeInOutQuad),
    view.position.y(peakY/2, peakTime, easeInOutQuad),
    view.scale(1.5, peakTime, easeInOutQuad),
  );

  // Hold at peak briefly
  yield* waitFor(0.2);

  // Continue drawing while resetting camera
  yield* all(
    progress(1, drawDuration - peakTime, linear),
    view.position.x(0, (drawDuration - peakTime), easeInOutQuad),
    view.position.y(0, (drawDuration - peakTime), easeInOutQuad),
    view.scale(1, (drawDuration - peakTime), easeInOutQuad),
  );

  yield* waitFor(0.8);
});
