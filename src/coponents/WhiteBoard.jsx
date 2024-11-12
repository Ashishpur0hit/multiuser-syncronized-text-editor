import React, { useRef, useState } from 'react';

const WhiteBoard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Start drawing on double-click
  const handleDoubleClick = () => {
    setIsDrawing(true);
  };

  // Handle mouse down to start drawing
  const handleMouseDown = (e) => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      canvas.addEventListener('mousemove', draw);
    }
  };

  // Stop drawing on mouse up
  const handleMouseUp = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      canvas.removeEventListener('mousemove', draw);
    }
  };

  // Draw function
  const draw = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineTo(e.offsetX, e.offsetY);
    context.strokeStyle = 'black'; // Line color
    context.lineWidth = 2; // Line thickness
    context.stroke();
  };

  return (
    <div className="flex justify-center items-center w-full h-full bg-gray-100">
      <canvas
        ref={canvasRef}
        className="border border-gray-400 bg-white"
        width={1400} // Set a fixed size for the canvas
        height={800} // Adjust height as needed
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default WhiteBoard;
