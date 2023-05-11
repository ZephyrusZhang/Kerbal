import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface KerbalUIState {
  toggleSidebar: boolean
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
    )
  }

  return context
}

const KerbalUIControllerProvider = ({children}: {children: ReactNode}) => {
  const initialState: KerbalUIState = {
    toggleSidebar: false
  }

  const [controller, setController] = useState<KerbalUIState>(initialState);
  const value = {controller, dispatch: setController}

  // useEffect(() => {
  //   console.log(controller)
  // }, [controller])


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