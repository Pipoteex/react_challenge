import React, { Fragment, useEffect, useState } from 'react'
import Plot from 'react-plotly.js';
import "./Row.scss"
import { Loading } from './Loading.jsx'

function ColorCode() {
  var makingColorCode = '0123456789ABCDEF';
  var finalCode = '#';
  for (var counter = 0; counter < 6; counter++) {
     finalCode =finalCode+ makingColorCode[Math.floor(Math.random() * 16)];
  }
  return finalCode;
}

export const Row = ( props ) => {

  const [ values, setValues ] = useState( 0 )
  const [ porcent, setPorcent ] = useState( 0 )
  const [ color ] = useState( ColorCode() )
  const [ flag, setFlag ] = useState( true )

  useEffect( () => {

    let conection = new WebSocket(`wss://stream.binance.com:9443/ws/${ props.objectElement.name.toLowerCase() }@ticker`) 
      
    conection.onmessage = function (event) {

        let data = JSON.parse( event.data );
        setValues( data.b )
        setPorcent( data.P )
        setFlag( false )

    }
    
  }, [])

  const calculateCost = (  ) =>{

    let cost = 0

    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    })

    
    if( props.objectElement.name === "BUSDUSDT" ){
      cost = formatter.format( Number( ( 1 / values ) * 200 ).toFixed( 4 ) )
    }else{
      cost = formatter.format( Number( values * 200 ).toFixed( 4 ) )
    }

    return cost

  }

  return (
      
    <div className='fila' value={ props.objectElement.name }>

        <div className='icono' >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M512 80c0 18.01-14.3 34.6-38.4 48-29.1 16.1-72.4 27.5-122.3 30.9-3.6-1.7-7.4-3.4-11.2-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4.2-24.5.6l-1.1-.6C142.3 114.6 128 98.01 128 80c0-44.18 85.1-80 192-80 106 0 192 35.82 192 80zm-351.3 81.1c10.2-.7 20.6-1.1 31.3-1.1 62.2 0 117.4 12.3 152.5 31.4 24.8 13.5 39.5 30.3 39.5 48.6 0 3.1-.7 7.9-2.1 11.7-4.6 13.2-17.8 25.3-35 35.6-.1 0-.3.1-.4.2-.3.2-.6.3-.9.5-35 19.4-90.8 32-153.6 32-59.6 0-112.94-11.3-148.16-29.1-1.87-1-3.69-2.8-5.45-2.9C14.28 274.6 0 258 0 240c0-34.8 53.43-64.5 128-75.4 10.5-1.6 21.4-2.8 32.7-3.5zm231.2 25.5c28.3-4.4 54.2-11.4 76.2-20.5 16.3-6.8 31.4-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9-14.7 7.4-32.4 13.6-52.4 18.4.1-1.7.2-3.5.2-5.3 0-21.9-10.6-39.9-24.1-53.4zM384 336c0 18-14.3 34.6-38.4 48-1.8.1-3.6 1.9-5.4 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.58-12.6-153.61-32C14.28 370.6 0 354 0 336v-35.4c12.45 10.3 27.62 18.7 43.93 25.5C83.44 342.6 135.8 352 192 352c56.2 0 108.6-9.4 148.1-25.9 7.8-3.2 15.3-6.9 22.4-10.9 6.1-3.4 11.8-7.2 17.2-11.2 1.5-1.1 2.9-2.3 4.3-3.4V336zm32-57.9c18.1-5 36.5-9.5 52.1-16 16.3-6.8 31.4-15.2 43.9-25.5V272c0 10.5-5 21-14.9 30.9-16.3 16.3-45 29.7-81.3 38.4.1-1.7.2-3.5.2-5.3v-57.9zM192 448c56.2 0 108.6-9.4 148.1-25.9 16.3-6.8 31.4-15.2 43.9-25.5V432c0 44.2-86 80-192 80C85.96 512 0 476.2 0 432v-35.4c12.45 10.3 27.62 18.7 43.93 25.5C83.44 438.6 135.8 448 192 448z"></path>
          </svg>
        </div>

        <div className='nombre'> { props.objectElement.name } </div>

        <div className='grafica' >

          <Plot 
              data={[
                  {
                    x: props.objectElement.valueX,
                    y: props.objectElement.valueY,
                    type: 'scatter',
                    marker: {color: color }
                  }
              ]}
              useResizeHandler={true}
              style={{width: "100%", height: "100%", }}
              
          />    

        </div>

        <div className='precio'> 
              
              {
                flag
                ?
                <Loading ancho={"50"}></Loading>
                :
                <Fragment>
                  <div className='moneda'> ARS </div>
                  <div className='valor'> { calculateCost() } </div>
                  <div className='otro_valor' style={ Number(porcent) >= 0 ? { color: "#3ccb3c" } : { color: "red" } } > { Number(porcent).toFixed( 4 ) + "% "  } </div>
                </Fragment>
              }

              
        </div>
        
    </div>
    
  )
}
