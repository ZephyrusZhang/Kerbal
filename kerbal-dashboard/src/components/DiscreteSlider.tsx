import React, { useState } from 'react';
import { Slider, SliderMark, SliderProps } from "@chakra-ui/react";

interface Props extends SliderProps {
  allowedValues: number[]
}

const DiscreteSlider = ({allowedValues, ...props}: Props) => {
  const [sliderValue, setSliderValue] = useState(allowedValues[0])

  const handleChange = (newValue: number) => {
    const closestValue = allowedValues.reduce((prev, curr) => {
      return Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
    })
    setSliderValue(closestValue)
  }

  const labelStyles = {
    mt: '4',
    ml: '-1',
    fontSize: 'sm',
  }

  return (
    <Slider
      value={sliderValue}
      min={allowedValues[0]}
      max={allowedValues[allowedValues.length - 1]}
      step={1}
      onChange={handleChange}
      {...props}
    >
      {allowedValues.map((value, index) => (
        <SliderMark key={index} value={value} {...labelStyles}>{value}</SliderMark>
      ))}
      <SliderMark
        value={sliderValue}
        textAlign='center'
        bg='blue.500'
        color='white'
        mt='-10'
        ml='-5'
        w='12'
      >
        {sliderValue}
      </SliderMark>
      {props.children}
    </Slider>
  )
}

export default DiscreteSlider;
