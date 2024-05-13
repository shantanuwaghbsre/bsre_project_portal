import React from 'react'
import './style.css'
const Loading = () => {
  return (
    <>
      <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex', height: '100%',}}>
      <div className="loading">
      </div>
      <div className='loader-absolute'>
        <img src="/Images/BS-LOGO.jpg" alt="loader"/>
      </div>
      <p style={{position: 'absolute',color: '#fff', fontSize: '30px', marginTop: '50px', left: '50%', transform: 'translate(-45%, 100%)'}}>Please Wait a Moment ...</p>
      </div>
    </>
  )
}

export default Loading
