import {useRef,useState} from "react";
import S, {Props,SelectInstance} from "react-select";
import { useClickOutside } from "../utils";
import { Button ,ButtonBase, ButtonBaseProps} from '@mui/material'

export default function Select({options} : Props){
    const selectRef = useRef<SelectInstance>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const controlRef = useRef<HTMLDivElement | null>(null)
    const upButton  = useRef(null)
    const downButton  = useRef(null)
    const [menuIsOpen,setMenuIsOpen] = useState(false)

    const scrollDown = ()=>{
        selectRef.current?.focusOption("pagedown")
        selectRef.current?.focus()
    }

    const scrollUP = ()=>{
        selectRef.current?.focusOption("pageup")
        selectRef.current?.focus()
    }

    menuRef.current = (selectRef.current?.menuListRef) as typeof menuRef.current
    controlRef.current = (selectRef.current?.controlRef) as typeof controlRef.current
  
    useClickOutside( [controlRef,menuRef,downButton,upButton] ,()=>{
        console.log("clicked outside.");
        setMenuIsOpen(false)
    })

    return (
        <div className="relative">
            <S
            options={options}
            ref={selectRef} 
            menuIsOpen={menuIsOpen} 
            onChange={()=>{setMenuIsOpen(false)}}
            onMenuOpen={()=>{setMenuIsOpen(true)}}
            />
            { menuIsOpen && (
            <div className="absolute right-[-80px] flex flex-col">
                <Button onClick={scrollUP} ref={upButton}>Up</Button>
                <Button onClick={scrollDown} ref={downButton}>Down</Button>
            </div>
            )}
        </div>
    )
}