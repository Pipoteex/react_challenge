
import './App.scss';
import { Row } from './Row'
import { useEffect, useState } from 'react';
import { Loading } from './Loading.jsx'

let arrayList = [ "BTCBUSD", "ETHBUSD", "BNBBUSD", "SOLBUSD", "LTCBUSD", "MATICBUSD", "AVAXBUSD", "XRPBUSD", "BUSDUSDT" ]

const getDatos = ( money ) =>{

  let firstDate = new Date()
  let secondDate = firstDate.getTime() - ( 24 * 60 * 60 * 1000 )

  return fetch(`https://api.binance.com/api/v3/klines?symbol=${ money }&interval=1h&limit=24&startTime=${ secondDate }&endTime=${ firstDate.getTime() }`)

}


function App() {

  const [ searchValues, setSearchValues ] = useState([])
  const [ flag, setFlag ] = useState( true )

  useEffect(() => {
     
    graficas()

  }, []);

  const graficas = () =>{

    let coordinatesList = []

    let promiseList = []

    arrayList.map( coinElement =>{

      promiseList.push( 
        getDatos( coinElement )
        .then(data => {
          return data.json();
        })
        .then(post => {

          let coinObject = {
            valueX: post.map( element => new Date(element[0]) ),
            valueY: post.map( element => element[1] ),
            name: coinElement
          }

          coordinatesList.push( coinObject )

        })
      )
      
    } )

    Promise.all( promiseList ).then( resp => {

      setSearchValues( coordinatesList )
      setFlag( false )

    })

  }

  const searchComponent = ( e ) =>{

    document.querySelectorAll( ".fila" ).forEach( element =>{

      if( element.getAttribute("value").toLowerCase().indexOf( e.target.value.toLocaleLowerCase() ) > -1 ){
        element.style.display = "flex" 
      }else{
        element.style.display = "none" 
      }

    } )

  }

  return (
    <div className="App">

      <div className='titulo' > React Challenge </div>

      <div className='contenido'>
        <div className='titulo_contenido'>
          <div className='nombre'> Cotizaciones </div>
        </div>
        <div className='caja_principal'>
          <div className='buscador'>
              <div className='caja_buscador'> 
                <input onChange={ searchComponent }></input>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M500.3 443.7L380.6 324c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723 99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9 53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0 15.606-15.64 15.606-41.04.006-56.64zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128-57.42 128-128 128-128-57.4-128-128z"></path>
                </svg>
              </div>
          </div>
          <div className='caja_monedas'>
            {
              flag 
              ?
              <Loading ancho={"200"}></Loading>
              :
              searchValues.map( ( objectElement, index ) => {
                return <Row 
                          key={ index } 
                          objectElement={ objectElement }
                        />
              })
            }
            {
              
            }
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;
