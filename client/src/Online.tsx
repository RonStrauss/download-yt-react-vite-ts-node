import React from 'react'
import styled from 'styled-components'

type Props = {
    online:boolean;

}

const Indicator = styled.span`
position:absolute;
left:1rem;
top:1rem;
&::before{
    content: '';
    border: 2px solid ${ (props:Props) => props.online ? 'lime' : 'red'};
    border-radius: 50%;
    display: flex;
    width: 10px;
    height: 10px;
    position: absolute;
    left: -0.8rem;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${ (props:Props) => props.online ? '0 0 3px 1px lime' : 'null'};
}
`

export const Online = (props:Props) => {
    const {online} = props

  return (
    <Indicator online={online}> { online ? 'ONLINE' : 'OFFLINE'} </Indicator>
  )
}
