import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";

interface KerbalUIState {
  isSidebarCollapse: boolean,
  canSidebarHidden: boolean,
  sidebarWidth: number,
  excludeSidebarWidth: number
}

interface KerbalUIContextProps {
  controller: KerbalUIState;
  dispatch: Dispatch<SetStateAction<KerbalUIState>>;
}


const KerbalUIContext = createContext<KerbalUIContextProps>({
  controller: {} as KerbalUIState,
  dispatch: () => {
    console.warn('dispatch function not provided')
  }
})

const useKerbalUIController = () => {
  const context = useContext(KerbalUIContext)

  if (!context) {
    throw new Error(
      "useKerbalUIController should be used inside the MaterialUIControllerProvider."
    );
  }

  return context
}

const KerbalUIControllerProvider = ({children}: {children: ReactNode}) => {
  const [isLargerThan768px] = useMediaQuery('(min-width: 768px)')

  const initialState: KerbalUIState = {
    isSidebarCollapse: false,
    canSidebarHidden: !isLargerThan768px,
    sidebarWidth: 310,
    excludeSidebarWidth: window.innerWidth - 310
  }

  const [controller, setController] = useState<KerbalUIState>(initialState);
  const value = {controller, dispatch: setController}

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setController({...controller, canSidebarHidden: true, excludeSidebarWidth: window.innerWidth - controller.sidebarWidth})
      } else {
        setController({...controller, canSidebarHidden: false, excludeSidebarWidth: window.innerWidth - controller.sidebarWidth})
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })


  return (
    <KerbalUIContext.Provider value={value}>
      {children}
    </KerbalUIContext.Provider>
  )
}

export {
  useKerbalUIController,
  KerbalUIControllerProvider
};