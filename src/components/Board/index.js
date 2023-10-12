import { MENU_ITEMS } from '@/constants'
import { actionItemClick } from '@/slice/menuSlice'
import React, { useEffect, useRef ,useLayoutEffect} from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
const Board = () => {

    const canvasRef=useRef(null)
    const dispatch=useDispatch()


    const shouldDraw=useRef(null)

    const drawHistory=useRef([])
    const historyPointer=useRef(0)
    const {activeMenuItem,actionMenuItem} = useSelector((state) => state.menu)

    const {color ,size} = useSelector((state) => state.toolbox[activeMenuItem])

    useEffect(()=>{
      if(!canvasRef.current) return 
      const canvas =canvasRef.current;
      const context=canvas.getContext('2d')
    if(actionMenuItem===MENU_ITEMS.DOWNLOAD){
      const URL=canvas.toDataURL()

      const anchor=document.createElement('a')
      anchor.href=URL
      anchor.download='sketch.jpg'
      anchor.click() 

      
    }
    else if(actionMenuItem===MENU_ITEMS.UNDO || actionMenuItem===MENU_ITEMS.REDO){
      if(historyPointer.current>0 && actionMenuItem===MENU_ITEMS.UNDO){
        historyPointer.current--
      }
      if(historyPointer.current<drawHistory.current.length-1 && actionMenuItem===MENU_ITEMS.REDO){
        historyPointer.current++
      }
      const imageData=drawHistory.current[historyPointer.current]
      context.putImageData(imageData,0,0)
      
    
    }
    dispatch(actionItemClick(null))

    },
    [actionMenuItem,dispatch]
    )


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
        const imageData=context.getImageData(0,0,canvas.width,canvas.height)
        drawHistory.current.push(imageData)
        historyPointer.current=drawHistory.current.length-1


          
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