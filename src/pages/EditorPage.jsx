import React, { useEffect, useRef, useState } from 'react'
import Client from '../coponents/Client'
import Editor from '../coponents/Editor'
import { initSocket } from '../socket';
import ACTIONS from '../actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import WhiteBoard from '../coponents/WhiteBoard';

function EditorPage() {

  
  const [users, setUsers] = useState([]);
  const socket_ref = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const code_ref = useRef(null);
  const [whiteboard_visible, setWhiteboardVisible] = useState(false);

  useEffect(() => {
    const init = async () => {
      socket_ref.current = await initSocket();
      socket_ref.current.on('connect_error', (err) => handleError(err));
      socket_ref.current.on('connect_failed', (err) => handleError(err));

      

      function handleError(e) {
        console.log(e);
        toast.error('Socket Connection Failed, try again later.');
        navigate('/');
      }

      console.log('Room ID:', roomId);

      socket_ref.current.emit(ACTIONS.JOIN, {
        roomId: roomId,
        username: location.state?.username
      }
    
      
    );

      socket_ref.current.on(ACTIONS.JOINED, (data) => {
        toast.success(`${data.username} joined the room`);
        setUsers(data.list);
        socket_ref.current.emit(ACTIONS.SYNC_CODE,{code : code_ref.current , socketId : data.socketId});
      });



      socket_ref.current.on(ACTIONS.DISCONNECTED, (data) => {
        console.log('event catched');
        toast.error(`${data.username} left the room`);
        setUsers(prevUsers => prevUsers.filter(user => user.socketId !== data.socketId));
      });

      

    };

    init();

    return ()=>{
      socket_ref.current.disconnect();
      socket_ref.current.off(ACTIONS.JOINED);
      socket_ref.current.off(ACTIONS.DISCONNECTED);
    }
  }, []);

  if (!location.state) {
    return <Navigate to='/' />;
  }

  const copyRoomID=async ()=>{
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success('Copied');
    }
    catch(err)
    {
      toast.error('Could Not copy Romm ID');
      console.log(err);
    }
  }


  const leaveRoom=()=>{
    navigate('/');
  }

  return (

    // <div className='h-full w-full'>

    //  <WhiteBoard></WhiteBoard>

    // </div>
    <div className='grid grid-cols-3 sm:grid-cols-10 md:grid-cols-12 h-screen bg-gray-800'>
      
      <div className='bg-gray-800 flex flex-col items-center h-screen col-span-1 sm:col-span-3 md:col-span-2 overflow-y-auto scrollbar-hide'>
        <img className='h-24' src='https://static.vecteezy.com/system/resources/previews/009/887/458/original/coding-illustration-3d-png.png' alt="code-sync-logo" />
        <p className='text-white font-semibold ms-5 text-xl'>Connected</p>
        <div className='w-full grid grid-cols-2'>
          {users.map((user) => (
            <Client key={user.socketId} userName={user.username} />
          ))}
        </div>

        <button onClick={copyRoomID} className='hover:bg-green-600 rounded-lg ps-5 pe-5 pt-2 pb-2 bg-green-500 mt-16 text-white font-semibold text-sm w-full sm:w-auto'>
          Copy Room ID
        </button>
        <button onClick={leaveRoom} className='hover:bg-gray-900 rounded-lg ps-5 pe-5 pt-2 pb-2 bg-black mt-2 text-white font-semibold w-full sm:w-auto text-sm'>
          Leave
        </button>

        <button onClick={() => setWhiteboardVisible(!whiteboard_visible)} className='hover:bg-gray-900 rounded-lg ps-5 pe-5 pt-2 pb-2 bg-black mt-2 text-white font-semibold w-full sm:w-auto text-sm'>
          Switch
        </button>

        {/* Toggle Button
        <button
          onClick={() => setWhiteboardVisible(!whiteboard_visible)}
          className="w-20 p-2 bg-blue-500 text-white rounded mt-2"
        >
          {whiteboard_visible ? 'Editor' : 'Whiteboard'}
        </button> */}
      </div>

      <div className='h-screen col-span-2 sm:col-span-7 md:col-span-10 overflow-y-auto scrollbar-hide items-top'>
        {!whiteboard_visible ? <Editor socket_ref={socket_ref} roomId={roomId} onCodeChange={(code)=>{code_ref.current=code}}/> : <WhiteBoard/>}
      </div>
    </div>
  );
}

export default EditorPage