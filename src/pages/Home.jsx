import React, { useRef, useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home=React.memo(()=> {

  const [room_id,setRoom_id]=useState('');
  const [username,setUsername]=useState('');

  const navigate=useNavigate();

  const createNewRoom=()=>{
    const id=uuidV4();
    setRoom_id(id);
    toast.success('Created a new room');
  }

  const handleEnterKey=(e)=>{
    if(e.code === 'Enter') {joinRoom();}
    return ;
  }

  const joinRoom=()=>{
    if(!username || !room_id)
    {
      toast.error('Room id and username are required');
      return ;
    }
    navigate(`/editor/${room_id}`,{
      state:{
        username
      }
    });
  }

  // 003B5C

  return (
    <div className='flex justify-center items-center  h-screen w-full p-5'>
      <div className='w-full sm:w-1/3 bg-[#003B5C] rounded-xl'>
        <img className='h-24' src="code1.webp" alt="code-sync-logo" />
        <div className='flex flex-col items-start w-full  p-4'>
          <p className='text-white font-semibold text-sm p-2'>Paste invitation Room id</p>
          <input onKeyUp={handleEnterKey} value={room_id} onChange={(e)=>{setRoom_id(e.target.value)}} className=' w-full rounded-lg p-2 outline-none mt-2' type="text" placeholder='ROOM ID' />
          <input onKeyUp={handleEnterKey} value={username} onChange={(e)=>{setUsername(e.target.value)}} className='w-full rounded-lg p-2 outline-none mt-2' type="text" placeholder='USER NAME' />
          <button  onClick={joinRoom} className='hover:bg-green-600 rounded-lg p-1 bg-green-500 w-24 mt-2 text-white font-semibold'>Join</button>

          <div className='flex flex-col justify-end w-full items-end'>
          <p className='text-white font-semibold text-sm pt-2'>Paste invitation Room id</p>
          <button className='hover:bg-green-600 rounded-lg ps-5 pe-5 pt-2 pb-2 bg-green-500 w-auto mt-2 text-white font-semibold' onClick={createNewRoom}>Create Room</button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Home