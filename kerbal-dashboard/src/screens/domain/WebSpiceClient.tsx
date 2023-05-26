import React, { useEffect, useRef } from 'react';
import { useSearchParams } from "react-router-dom";

const WebSpiceClient = () => {
  const [searchParams] = useSearchParams()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    localStorage.setItem('host', searchParams.get('host') as string)
    localStorage.setItem('port', searchParams.get('port') as string)
    localStorage.setItem('pwd', searchParams.get('pwd') as string)
  }, [searchParams])


  return (
    <iframe ref={iframeRef} src='spice-html5/spice.html' style={{width: '100%', height: '100%'}}/>
  )
}

export default WebSpiceClient;
