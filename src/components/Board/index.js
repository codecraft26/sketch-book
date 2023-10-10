import React, { useEffect, useRef } from 'react'

const Board = () => {

    const canvasRef=useRef(null)


    useEffect(()=>{
        if(!canvasRef.current) return 
        const canvas =canvasRef.current;
        const context=canvas.getContext('2d')
        // when mouting 
        canvas.width=window.innerWidth
        canvas.height=window.innerHeight

    },[])
  return (
    <div>
    <canvas ref={canvasRef}></canvas>

    </div>


  )
}

export default Board