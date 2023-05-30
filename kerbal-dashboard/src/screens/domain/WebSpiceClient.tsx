import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { refresh } from "../../util/page";
import request from "../../util/request";

const WebSpiceClient = () => {
  const [searchParams] = useSearchParams()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('host', searchParams.get('host') as string)
    localStorage.setItem('port', searchParams.get('port') as string)
    localStorage.setItem('pwd', searchParams.get('pwd') as string)
  }, [searchParams])

  useEffect(() => {
    const handleMsgFromSpiceHtml = (event: MessageEvent) => {
      if (event.data.type === 'disconnect') {
        request.get(
          `/websock/disconnect?host=${localStorage.getItem("host")}&$port=${localStorage.getItem("port")}`
        ).then(() => {
          localStorage.removeItem('host')
          localStorage.removeItem('port')
          localStorage.removeItem('pwd')
          navigate('/')
          refresh()
        })
      }
    }
    window.addEventListener('message', handleMsgFromSpiceHtml)

    return () => window.removeEventListener('message', handleMsgFromSpiceHtml)
  }, [])


  return (
    <iframe ref={iframeRef} src='spice-html5/spice.html' style={{width: '100%', height: '100%'}}/>
  )
}

export default WebSpiceClient;
