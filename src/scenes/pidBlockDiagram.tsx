import {makeScene2D, Line, Circle, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor, easeInOutCubic} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Set dark background
  view.fill('#1a1b1e');  // Slightly blue-tinted dark background

  // Define common styles with dark theme
  const lineStyle = {
    stroke: '#64B5F6',  // Light blue for lines
    lineWidth: 3,       // Increased from 2
    endArrow: true,
    arrowSize: 15,      // Increased from 12
  };

  const boxStyle = {
    fill: 'rgba(40,40,40,0.5)',
    stroke: '#64B5F6',
    lineWidth: 3,       // Increased from 2
    width: 300,         // Increased from 200
    height: 180,        // Increased from 120
    radius: 0,
  };

  const textStyle = {
    fill: '#E0E0E0',
    fontSize: 56,       // Increased from 40
    fontFamily: 'CMU Serif',
    fontStyle: 'italic',
  };

  // Create references for animation
  const inputLine = createRef<Line>();
  const sumCircle = createRef<Circle>();
  const errorLine = createRef<Line>();
  const controllerBox = createRef<Rect>();
  const controlLine = createRef<Line>();
  const systemBox = createRef<Rect>();
  const outputLine = createRef<Line>();
  const feedbackLine = createRef<Line>();
  const crossLine1 = createRef<Line>();
  const crossLine2 = createRef<Line>();
  
  // References for texts
  const inputText = createRef<Txt>();
  const errorText = createRef<Txt>();
  const controllerText = createRef<Txt>();
  const systemText = createRef<Txt>();
  const outputText = createRef<Txt>();
  const plusSymbol = createRef<Txt>();
  const minusSymbol = createRef<Txt>();
  const controlSignalText = createRef<Txt>();

  view.add(
    <>
      {/* Input signal */}
      <Line
        ref={inputLine}
        points={[[-750, 0], [-600, 0]]}  // Scaled positions
        {...lineStyle}
        end={0}
      />
      <Txt
        ref={inputText}
        text="R(s)"
        position={[-675, -45]}  // Scaled position
        {...textStyle}
        opacity={0}
      />

      {/* Summation circle */}
      <Circle
        ref={sumCircle}
        width={90}          // Increased from 60
        height={90}         // Increased from 60
        position={[-555, 0]} // Scaled position
        stroke={'#64B5F6'}
        lineWidth={3}
        fill={'rgba(103,58,183,0.3)'}
        scale={0}
      />
      
      {/* Cross in summation circle */}
      <Line
        ref={crossLine1}
        points={[[-525, -33], [-585, 33]]}  // Scaled positions
        stroke={'#E0E0E0'}
        lineWidth={2}      // Increased from 1
        opacity={0}
      />
      <Line
        ref={crossLine2}
        points={[[-525, 33], [-585, -33]]}  // Scaled positions
        stroke={'#E0E0E0'}
        lineWidth={2}      // Increased from 1
        opacity={0}
      />
      <Txt
        ref={plusSymbol}
        text="+"
        position={[-580, 0]}  // Scaled position
        fontSize={24}         // Increased from 16
        fontFamily={'CMU Serif'}
        fill={'#ffffff'}
        opacity={0}
      />
      <Txt
        ref={minusSymbol}
        text="−"
        position={[-555, 25]}  // Scaled position
        fontSize={24}          // Increased from 16
        fontFamily={'CMU Serif'}
        fill={'#ffffff'}
        opacity={0}
      />

      {/* Error signal */}
      <Line
        ref={errorLine}
        points={[[-510, 0], [-360, 0]]}  // Scaled positions
        {...lineStyle}
        end={0}
      />
      <Txt
        ref={errorText}
        text="E(s)"
        position={[-435, -45]}  // Scaled position
        {...textStyle}
        opacity={0}
      />

      {/* Controller block */}
      <Rect
        ref={controllerBox}
        position={[-210, 0]}  // Scaled position
        {...boxStyle}
        fill={'rgba(0,150,136,0.3)'}
        scale={0}
      />
      <Txt
        ref={controllerText}
        text="C(s)"
        position={[-210, 0]}  // Scaled position
        {...textStyle}
        opacity={0}
      />

      {/* Control signal */}
      <Line
        ref={controlLine}
        points={[[-60, 0], [210, 0]]}  // Scaled positions
        {...lineStyle}
        end={0}
      />
      <Txt
        ref={controlSignalText}
        text="U(s)"
        position={[75, -45]}  // Scaled position
        {...textStyle}
        opacity={0}
      />

      {/* System block */}
      <Rect
        ref={systemBox}
        position={[360, 0]}  // Scaled position
        {...boxStyle}
        fill={'rgba(255,87,34,0.3)'}
        scale={0}
      />
      <Txt
        ref={systemText}
        text="G(s)"
        position={[360, 0]}  // Scaled position
        {...textStyle}
        opacity={0}
      />

      {/* Output signal */}
      <Line
        ref={outputLine}
        points={[[510, 0], [660, 0]]}  // Scaled positions
        {...lineStyle}
        end={0}
      />
      <Txt
        ref={outputText}
        text="Y(s)"
        position={[585, -45]}  // Scaled position
        {...textStyle}
        opacity={0}
      />

      {/* Feedback path */}
      <Line
        ref={feedbackLine}
        points={[[585, 0], [585, 225], [-555, 225], [-555, 45]]}  // Scaled positions
        {...lineStyle}
        end={0}
      />
    </>
  );

  // Animation sequence
  yield* waitFor(0.5);

  // Input signal animation
  yield* all(
    inputLine().end(1, 0.8, easeInOutCubic),
    inputText().opacity(1, 0.5),
  );

  // Summation circle animation
  yield* all(
    sumCircle().scale(1, 0.5, easeInOutCubic),
    crossLine1().opacity(1, 0.3),
    crossLine2().opacity(1, 0.3),
    plusSymbol().opacity(1, 0.3),
    minusSymbol().opacity(1, 0.3),
  );

  // Error signal animation
  yield* all(
    errorLine().end(1, 0.8, easeInOutCubic),
    errorText().opacity(1, 0.5),
  );

  // Controller block animation
  yield* all(
    controllerBox().scale(1, 0.5, easeInOutCubic),
    controllerText().opacity(1, 0.5),
  );

  // Control signal animation
  yield* all(
    controlLine().end(1, 0.8, easeInOutCubic),
    controlSignalText().opacity(1, 0.5),
  );

  // System block animation
  yield* all(
    systemBox().scale(1, 0.5, easeInOutCubic),
    systemText().opacity(1, 0.5),
  );

  // Output signal animation
  yield* all(
    outputLine().end(1, 0.8, easeInOutCubic),
    outputText().opacity(1, 0.5),
  );

  // Feedback path animation
  yield* feedbackLine().end(1, 1.2, easeInOutCubic);

  yield* waitFor(1);
}); 