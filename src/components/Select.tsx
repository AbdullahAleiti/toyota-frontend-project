import { useEffect, useRef,useState,forwardRef,useImperativeHandle, CSSProperties} from "react";
import S, {Props as reactSelectProps,SelectInstance} from "react-select";
import { useClickOutside } from "../utils";
import { Button } from '@mui/material'

export type FocusHandle = {
    focus: ()=>void
}

type Props = reactSelectProps & {onClickOutside?: ()=>void,style?: CSSProperties}

const Select = forwardRef<FocusHandle,Props>(({onChange,options,className,onMenuClose,menuIsOpen : isOpenProp,onClickOutside,style} : Props ,ref) => {
    const selectRef = useRef<SelectInstance>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const controlRef = useRef<HTMLDivElement | null>(null)
    const scrollButtons  = useRef<HTMLDivElement | null>(null)
    const [menuIsOpen,setMenuIsOpen] = useState(isOpenProp === undefined ? false : isOpenProp)
    const [isListening,setIsListening]  = useState(false)

    useImperativeHandle(ref, () => {
        return {
          focus() {
            console.log("focused")
            selectRef.current?.focus();
          }
        };
      },);

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
    
    useEffect(()=>{
        const timer = setTimeout(() => {
            setIsListening(true);
          }, 500);
        
        return () => clearTimeout(timer);
    },[isListening])

    useClickOutside( [controlRef,menuRef,scrollButtons] ,()=>{
        if(isListening) {
            console.log("clicked outside.")
            setMenuIsOpen(false)
            if(onClickOutside){
                onClickOutside()
            }
        }
    })

    return (
        <div className={className} style={style}>
            <div className="relative">
                <S
                blurInputOnSelect={false}
                options={options}
                menuIsOpen={menuIsOpen} 
                onChange={(value,m)=>{
                    setMenuIsOpen(false)
                    if (onChange)
                        onChange(value,m);
                }}
                onMenuClose={onMenuClose}
                onMenuOpen={()=>{setMenuIsOpen(true)}}
                ref={selectRef}
                />
                { menuIsOpen && (
                <div className="absolute right-[-84px] flex flex-col" ref={scrollButtons}>
                    <Button style={{margin:4}} variant="contained" onClick={scrollUP}>Up</Button>
                    <Button style={{margin:4}} variant="contained" onClick={scrollDown}>Down</Button>
                </div>
                )}
            </div>
        </div>
    )
})

export default Select