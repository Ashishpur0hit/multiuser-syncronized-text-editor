import React from 'react'
import Avatar from 'react-avatar'

function Client({userName}) {
  return (
    <div className='w-auto flex justify-center flex-col items-center mt-5 overflow-y-auto'>
        
        <Avatar className='rounded-full ' name={userName} size='50'  />
        <p className='text-xs font-semibold text-white'>{userName}</p>
        
    </div>
  )
}

export default Client