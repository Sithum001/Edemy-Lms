import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'

const Educator = () => {
  return (
    <div>
      <Navbar/>
      <h1>Educator page</h1>
      <div>
        {<Outlet/>}
      </div>
    </div>
  )
}

export default Educator
