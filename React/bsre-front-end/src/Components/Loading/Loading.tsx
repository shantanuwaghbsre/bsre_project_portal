import React from 'react'
import './style.css'
const Loading = () => {
  return (
    <>
      <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex', height: '100vh',}}>
      <div className="loading">
      </div>
      <div className='loader-absolute'>
        <img src="/Images/BS-LOGO.jpg" alt="loader"/>
      </div>
      <p style={{position: 'absolute',color: '#000', fontSize: '20px', top: '50%', left: '50%', transform: 'translate(-50%, 100%)',}}>Please Wait a Moment ...</p>
      </div>
    </>
  )
}

export default Loading
