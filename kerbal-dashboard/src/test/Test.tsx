import React from 'react'
import { Button } from "@chakra-ui/react";
import request from "../util/request";

const Test = () => {
  const handleClick = () => {
    request.get('/api/cluster/user/domains')
      .then(response => {
        console.log(response)
      })
  }

  return (
    <>
      <Button onClick={handleClick}>Send</Button>
    </>
  );
}

export default Test
