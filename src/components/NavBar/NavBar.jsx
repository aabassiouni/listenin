import React from 'react'
import LogoutButton from '../LogoutButton/LogoutButton'

export default function NavBar() {

  return (

    <div className="navbar bg-[#020202]">
        <div className="flex-1 h-16">
            <a className="btn font-['Gotham'] text-3xl text-white normal-case btn-ghost ">ListenIn</a>
        </div>
        <p className='text-xs mr-2'>stream client:</p>
        
        <div className="flex-none pr-4">
          <LogoutButton />
        </div>
    </div>
  )
}
