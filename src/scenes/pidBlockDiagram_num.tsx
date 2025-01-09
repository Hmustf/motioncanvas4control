import {makeScene2D, Line, Circle, Rect, Txt, Latex} from '@motion-canvas/2d';
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

  const equationStyle = {
    fill: '#E0E0E0',
    fontSize: 32,      // Adjusted for LaTeX
    fontFamily: 'CMU Serif',
  };

  // Add a larger style for the combined block
  const combinedBoxStyle = {
    ...boxStyle,
    width: 400,    // Larger width
    height: 200,   // Larger height
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
  const controllerEqText = createRef<Latex>();  // Changed to Latex
  const systemText = createRef<Txt>();
  const systemEqText = createRef<Latex>();      // Changed to Latex
  const outputText = createRef<Txt>();
  const plusSymbol = createRef<Txt>();
  const minusSymbol = createRef<Txt>();
  const controlSignalText = createRef<Txt>();

  // Add new references for the combined block
  const combinedBox = createRef<Rect>();
  const combinedEqText = createRef<Latex>();

  // Add new references for the final reduced system
  const finalBox = createRef<Rect>();
  const finalEqText = createRef<Latex>();

  // Define final box style with larger size
  const finalBoxStyle = {
    ...combinedBoxStyle,
    width: 800,    // Much larger for final equation
    height: 280,   // Much larger for final equation
  };

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
        position={[-210, 0]}
        {...boxStyle}
        fill={'rgba(0,150,136,0.3)'}
        scale={0}
      />
      <Txt
        ref={controllerText}
        text="C(s)"
        position={[-210, 0]}
        {...textStyle}
        opacity={0}
      />
      <Latex
        ref={controllerEqText}
        tex="K_p + \frac{K_i}{s} + K_d s"
        position={[-210, 0]}
        {...equationStyle}
        opacity={0}
        scale={0}
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
        position={[360, 0]}
        {...boxStyle}
        fill={'rgba(255,87,34,0.3)'}
        scale={0}
      />
      <Txt
        ref={systemText}
        text="G(s)"
        position={[360, 0]}
        {...textStyle}
        opacity={0}
      />
      <Latex
        ref={systemEqText}
        tex="\frac{\omega_n^2}{s^2 + 2\zeta\omega_n s + \omega_n^2}"
        position={[360, 0]}
        {...equationStyle}
        opacity={0}
        scale={0}
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

      {/* Combined block (initially invisible) */}
      <Rect
        ref={combinedBox}
        position={[75, 0]}
        {...combinedBoxStyle}  // Use larger style
        fill={'rgba(156,39,176,0.3)'}
        scale={0}
        opacity={0}
      />
      <Latex
        ref={combinedEqText}
        tex="\frac{\omega_n^2(K_p s + K_i + K_d s^2)}{s^3 + 2\zeta\omega_n s^2 + \omega_n^2s}"
        position={[75, 0]}
        {...equationStyle}
        opacity={0}
        scale={0}
      />

      {/* Final reduced system (initially invisible) */}
      <Rect
        ref={finalBox}
        position={[75, 0]}
        {...finalBoxStyle}
        fill={'rgba(233,30,99,0.3)'}  // Pink fill for final block
        scale={0}
        opacity={0}
      />
      <Latex
        ref={finalEqText}
        tex="\frac{\omega_n^2(K_p s + K_i + K_d s^2)}{s^3 + 2\zeta\omega_n s^2 + \omega_n^2s + \omega_n^2(K_p s + K_i + K_d s^2)}"
        position={[75, 0]}
        {...equationStyle}
        opacity={0}
        scale={0}
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

  // Wait a moment before changing the labels
  yield* waitFor(0.5);

  // Change controller label to PID equation with fancy transition
  yield* all(
    controllerText().opacity(0, 0.5, easeInOutCubic),
    controllerText().scale(1.5, 0.5),
    controllerText().rotation(360, 0.5),
    controllerEqText().scale(0, 0),
  );
  yield* all(
    controllerEqText().opacity(1, 0.5, easeInOutCubic),
    controllerEqText().scale(1, 0.5, easeInOutCubic),
  );

  // Change system label to transfer function with fancy transition
  yield* all(
    systemText().opacity(0, 0.5, easeInOutCubic),
    systemText().scale(1.5, 0.5),
    systemText().rotation(360, 0.5),
    systemEqText().scale(0, 0),
  );
  yield* all(
    systemEqText().opacity(1, 0.5, easeInOutCubic),
    systemEqText().scale(1, 0.5, easeInOutCubic),
  );

  yield* waitFor(1);

  // Block reduction animation
  yield* waitFor(0.5);

  // Fade out intermediate signal labels and control line
  yield* all(
    controlSignalText().opacity(0, 0.5),
    errorText().opacity(0, 0.5),
    controlLine().opacity(0, 0.5),
  );

  // First move blocks closer while scaling and rotating slightly
  yield* all(
    // Controller block moves right and rotates
    controllerBox().position.x(-50, 0.8, easeInOutCubic),
    controllerEqText().position.x(-50, 0.8, easeInOutCubic),
    controllerBox().rotation(-15, 0.8, easeInOutCubic),
    controllerEqText().rotation(-15, 0.8, easeInOutCubic),
    controllerBox().scale(0.8, 0.8, easeInOutCubic),
    controllerEqText().scale(0.8, 0.8, easeInOutCubic),
    
    // System block moves left and rotates opposite
    systemBox().position.x(200, 0.8, easeInOutCubic),
    systemEqText().position.x(200, 0.8, easeInOutCubic),
    systemBox().rotation(15, 0.8, easeInOutCubic),
    systemEqText().rotation(15, 0.8, easeInOutCubic),
    systemBox().scale(0.8, 0.8, easeInOutCubic),
    systemEqText().scale(0.8, 0.8, easeInOutCubic),
  );

  // Then merge to center with a flash effect
  yield* all(
    // Controller block final merge
    controllerBox().position.x(75, 0.5, easeInOutCubic),
    controllerEqText().position.x(75, 0.5, easeInOutCubic),
    controllerBox().rotation(0, 0.5, easeInOutCubic),
    controllerEqText().rotation(0, 0.5, easeInOutCubic),
    controllerBox().opacity(0, 0.5),
    controllerEqText().opacity(0, 0.5),
    
    // System block final merge
    systemBox().position.x(75, 0.5, easeInOutCubic),
    systemEqText().position.x(75, 0.5, easeInOutCubic),
    systemBox().rotation(0, 0.5, easeInOutCubic),
    systemEqText().rotation(0, 0.5, easeInOutCubic),
    systemBox().opacity(0, 0.5),
    systemEqText().opacity(0, 0.5),

    // Combined block appears with flash
    combinedBox().scale(0, 0),
    combinedEqText().scale(0, 0),
  );

  // Flash and scale up the combined block
  yield* all(
    combinedBox().opacity(1, 0.3),
    combinedBox().scale(1.2, 0.3, easeInOutCubic),
    combinedEqText().opacity(1, 0.3),
    combinedEqText().scale(1.2, 0.3, easeInOutCubic),
  );

  // Settle to final size
  yield* all(
    combinedBox().scale(1, 0.2, easeInOutCubic),
    combinedEqText().scale(1, 0.2, easeInOutCubic),
  );

  // Wait a moment before animating the lines
  yield* waitFor(0.2);

  // Extend the lines to connect to the new block
  yield* all(
    errorLine().points([[-510, 0], [-125, 0]], 0.8, easeInOutCubic),   // Extend to merged block
    outputLine().points([[275, 0], [660, 0]], 0.8, easeInOutCubic),    // Extend from merged block
  );

  yield* waitFor(1);

  // Start feedback reduction animation
  yield* waitFor(0.5);

  // Remove feedback line by reversing its creation animation
  yield* feedbackLine().end(0, 1.2, easeInOutCubic);

  // Remove summation circle and its components with fade out
  yield* all(
    sumCircle().opacity(0, 0.5),
    crossLine1().opacity(0, 0.5),
    crossLine2().opacity(0, 0.5),
    plusSymbol().opacity(0, 0.5),
    minusSymbol().opacity(0, 0.5),
  );

  // Shorten input and output lines for final block
  yield* all(
    errorLine().opacity(0, 0.5),  // Hide error line
    inputLine().points([[-510, 0], [-325, 0]], 0.8, easeInOutCubic),  // Extend input line
    outputLine().points([[475, 0], [660, 0]], 0.8, easeInOutCubic),
    // Move input label to new position
    inputText().position.x(-435, 0.8, easeInOutCubic),
  );

  // Transform to final form
  yield* all(
    // Hide combined equation
    combinedEqText().opacity(0, 0.5),
    // Transform block
    combinedBox().size.x(finalBoxStyle.width, 0.8, easeInOutCubic),
    combinedBox().size.y(finalBoxStyle.height, 0.8, easeInOutCubic),
    combinedBox().fill('rgba(233,30,99,0.3)', 0.8),
    // Prepare final equation
    finalEqText().scale(0, 0),
  );

  // Show final equation with scale animation
  yield* all(
    finalEqText().opacity(1, 0.5),
    finalEqText().scale(1, 0.5, easeInOutCubic),
  );

  // Wait for 5 seconds to show the final result
  yield* waitFor(5);

  // Final fade out of all remaining elements
  yield* all(
    // Fade out lines
    inputLine().opacity(0, 1, easeInOutCubic),
    outputLine().opacity(0, 1, easeInOutCubic),
    // Fade out labels
    inputText().opacity(0, 1, easeInOutCubic),
    outputText().opacity(0, 1, easeInOutCubic),
    // Fade out final block and equation
    finalBox().opacity(0, 1, easeInOutCubic),
    finalEqText().opacity(0, 1, easeInOutCubic),
    combinedBox().opacity(0, 1, easeInOutCubic),
  );

  yield* waitFor(0.5);
}); 