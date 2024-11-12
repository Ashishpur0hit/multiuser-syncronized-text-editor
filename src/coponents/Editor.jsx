import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../actions';
import WhiteBoard from "./WhiteBoard.jsx";

const Editor = ({ socket_ref, roomId, onCodeChange }) => {
  const editorRef = useRef();
  const [output, setOutput] = useState(''); // State to store code output
  

  useEffect(() => {
    const init = async () => {
      const textarea = document.getElementById('editor');
      if (textarea) {
        editorRef.current = Codemirror.fromTextArea(textarea, {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        });

        editorRef.current.on('change', (instance, changes) => {
          const { origin } = changes;
          const code = instance.getValue();
          onCodeChange(code);
          if (origin !== 'setValue') {
            socket_ref.current.emit(ACTIONS.CODE_CHANGE, {
              roomId: roomId,
              code: code,
            });
          }
        });
      }
    };

    init();

    return () => {
      editorRef.current.toTextArea();
      socket_ref.current.off(ACTIONS.CODE_CHANGE);
    };
  }, []);

  useEffect(() => {
    if (socket_ref.current) {
      socket_ref.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socket_ref.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socket_ref.current]);

  // Function to execute JavaScript code
  const runCode = () => {
    const code = editorRef.current.getValue();
    let capturedOutput = ''; // Variable to store captured console output

    // Override console.log to capture output
    const originalConsoleLog = console.log;
    console.log = (message) => {
      if (typeof message === 'object') {
        // Convert objects to string format
        capturedOutput += JSON.stringify(message, null, 2) + '\n';
      } else {
        capturedOutput += message + '\n'; // Capture non-object messages directly
      }
    };

    try {
      // Use new Function to create a separate function scope for the code
      const executeCode = new Function(code);
      const result = executeCode(); // Run the code in editor

      // If result is undefined, use captured output; otherwise, display result
      setOutput(capturedOutput || (result !== undefined ? result.toString() : 'No output'));
    } catch (error) {
      setOutput(error.toString()); // Display errors in output
    }

    // Restore original console.log
    console.log = originalConsoleLog;
  };

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="w-full flex justify-around mb-4">
        {/* Run Button */}
        <button
          onClick={runCode}
          className="w-20 p-2 bg-blue-500 text-white rounded mt-2"
        >
          Run
        </button>

        
      </div>

      {/* Editor or WhiteBoard Section */}
      <div className="w-full h-3/4 items-center overflow-auto" >
      <textarea className="" id="editor"></textarea>
      </div>

      {/* Output Section */}
      <div className="w-full h-1/4 overflow-auto bg-gray-900 text-white rounded p-4">
        <h3 className="font-bold">Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Editor;
