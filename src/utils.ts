import { RefObject ,useRef ,useEffect} from "react";

type ClickOutsideCallback = (e: MouseEvent) => void;

function checkContains(eventTarget: Node, refs : RefObject<HTMLElement | HTMLDivElement>[]) {
    for (const ref of refs) {
        if (ref.current && ref.current.contains(eventTarget)) {
            return true; // Return true if event target is contained in any of the refs
        }
    }
    return false; // Return false if event target is not contained in any of the refs
}

export function useClickOutside(elRefs : RefObject<HTMLElement | HTMLDivElement>[], callback : ClickOutsideCallback ) {
    const callbackRef = useRef<ClickOutsideCallback>();
    callbackRef.current = callback;

    const refsSet = useRef<Set<HTMLElement | HTMLDivElement | null>>(new Set());

    useEffect(() => {
        elRefs.forEach(ref => refsSet.current.add(ref.current));

        const handleClickOutside = (e: MouseEvent) => {
            if (callbackRef.current && !checkContains(e.target as Node,elRefs)) {
                callbackRef.current(e);
            }
        };
  
        document.addEventListener('click', handleClickOutside,false);
        return () => {
            document.removeEventListener('click', handleClickOutside,false);
        };
    }, [callbackRef, elRefs]);
  }