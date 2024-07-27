import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../actions';


const Editor = ({socket_ref , roomId , onCodeChange}) => {

  const Editor_Ref = useRef();

    useEffect(() => {
      const init=async ()=>{
        const textarea  = document.getElementById('editor');
        if (textarea) {
          Editor_Ref.current = Codemirror.fromTextArea(textarea, {
            mode: { name: 'javascript', json: true },
            theme: 'dracula',
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
          });


          Editor_Ref.current.on('change',(instance,changes)=>{
            
            const {origin} = changes;
            const code = instance.getValue();
            onCodeChange(code);
            if(origin!=='setValue')
            {
              socket_ref.current.emit(ACTIONS.CODE_CHANGE,{
                roomId:roomId,
                code:code
              })
            }
            
          })



          
    
        
    
          
        }
      }

      
        init();
      

      return () => {
        Editor_Ref.current.toTextArea();
        socket_ref.current.off(ACTIONS.CODE_CHANGE);
      };
      }, []);


      useEffect(() => {
        if (socket_ref.current) {
          socket_ref.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                  Editor_Ref.current.setValue(code);
                }
            });
        }

        return () => {
          socket_ref.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socket_ref.current]);


  return (
    <div className='w-full h-screen '>
        <textarea className='w-1/2 h-24' name="code" id="editor"></textarea>
    </div>
  )
}

export default Editor