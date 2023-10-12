import React, { useEffect, useRef ,useLayoutEffect} from 'react'
import { useSelector } from 'react-redux'
const Board = () => {

    const canvasRef=useRef(null)

    const shouldDraw=useRef(null)
    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem)
    const {color ,size} = useSelector((state) => state.toolbox[activeMenuItem])


  useEffect(()=>{
    if(!canvasRef.current) return 
    const canvas =canvasRef.current;
    const context=canvas.getContext('2d')
    

    const changeConfig=()=>{
      // change the color of brush
      context.strokeStyle=color
      // change the size of brush
      context.lineWidth=size

    }


    changeConfig()

  },[color,size])




// before the paint
    useLayoutEffect(()=>{
        if(!canvasRef.current) return 
        const canvas =canvasRef.current;
        const context=canvas.getContext('2d')
        // when mouting 
        canvas.width=window.innerWidth
        canvas.height=window.innerHeight

        const beginPath=(x,y)=>{
          context.beginPath()
          context.moveTo(x,y)
        }
        const drawLine=(x,y)=>{
          context.lineTo(x,y)
          context.stroke()
        }

        


        const handleMouseDown=(e)=>{
          shouldDraw.current=true
          beginPath(e.clientX,e.clientY)
         

        }
        const handleMouseMove=(e)=>{
          if(!shouldDraw.current) return
          drawLine(e.clientX,e.clientY)

            
          }
    
        const handleMouseUp=(e)=>{
        shouldDraw.current=false


          
        }
    
    
    
        canvas.addEventListener('mousedown',handleMouseDown)
        canvas.addEventListener('mousemove',handleMouseMove)
        canvas.addEventListener('mouseup',handleMouseUp)


        return ()=>{
            canvas.removeEventListener('mousedown',handleMouseDown)
            canvas.removeEventListener('mousemove',handleMouseMove)
            canvas.removeEventListener('mouseup',handleMouseUp)
        }

    },[])
  return (
    <div>
    <canvas ref={canvasRef}></canvas>

    </div>


  )
}

export default Board