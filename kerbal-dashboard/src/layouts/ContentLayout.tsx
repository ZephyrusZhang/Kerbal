import React, { ReactNode } from 'react';
import { useKerbalUIController } from "../context";
import MotionBox from "../components/containers/MotionBox";

interface Props {
  children: ReactNode
}

const ContentLayout = ({children, ...props}: Props) => {
  const {controller} = useKerbalUIController()
  const variants = {
    sidebarHidden: { left: '0px' },
    sidebarVisible: { left: '310px' }
  }

  return (
    <MotionBox
      top='80px'
      position='relative'
      initial='sidebarVisible'
      animate={controller.isSidebarCollapse ? 'sidebarHidden' : 'sidebarVisible'}
      variants={variants}
      // @ts-ignore
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </MotionBox>
  )
}

export default ContentLayout
