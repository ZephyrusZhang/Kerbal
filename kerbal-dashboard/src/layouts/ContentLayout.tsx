import React, { ReactNode } from 'react';
import { useKerbalUIController } from "../context";
import MotionBox from "../components/containers/MotionBox";
import { BoxProps } from "@chakra-ui/react";

interface Props extends BoxProps{
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
      {...props}
      width={controller.excludeSidebarWidth}
      top='80px'
      position='relative'
      initial='sidebarVisible'
      animate={controller.isSidebarCollapse ? 'sidebarHidden' : 'sidebarVisible'}
      variants={variants}
      // @ts-ignore
      transition={{ duration: 0.5 }}
    >
      {children}
    </MotionBox>
  )
}

export default ContentLayout
