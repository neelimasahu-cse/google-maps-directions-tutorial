import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import axios from "axios";
import currentPointer from "./greenDot.jpg";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // to connect browserurl to react application
import home from "./home";
import findOrder from "./findOrder";
import { useState, useRef, useEffect } from "react";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

const center = { lat: 48.8584, lng: 2.2945 };

const location1 = { lat: 52.50742, lng: 13.2821 };
const location2 = { lat: 51.74856, lng: 12.22488 };
const location3 = { lat: 51.05357, lng: 11.9455 };
const location4 = { lat: 50.94832, lng: 10.48644 };
const location5 = { lat: 50.7615, lng: 9.36749 };
const location6 = { lat: 50.1593, lng: 8.67962 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB0SGEfxfTrnRKxES4njRH5mgijZNHFXGU",
    libraries: ["places"],
  });

  const [map, setMap] = useState(
    /** @type google.maps.Map */ (null)
  ); /* to pan back to the center. this fix has been made */
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [textboxValue, settextboxValue] = useState(null);
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();
  const [pointerLocation, setpointerLocation] = useState({
    lat: 52.50742,
    lng: 13.2821,
  });
  const [markerLocation, setMarkerLocation] = useState([{}]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // alert('changePointer')
  }, [pointerLocation]);
  if (!isLoaded) {
    return <SkeletonText />;
  }
  function callboth() {
    searchOrder();
    calculateRoute();
  }

  async function searchOrder() {
    /*Here rest call will be made */
    const readURL = "http://localhost:7080/read/" + textboxValue;
    const readGpsCoordinates = "http://localhost:7080/listCoordinates";

    axios.get(readURL).then((response) => {
      originRef.current.value = response.data.currentCity;
      destiantionRef.current.value = response.data.destinationCity;
    });

    axios.get(readGpsCoordinates).then((allCoordinates) => {
      setMarkerLocation(allCoordinates.data);

      console.log("Marker Location is blah", markerLocation);
      console.log("markerLocation length is : ",markerLocation.length);
    });
    // setTimeout(()=>{console.log('wait for sometime');},5000)
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    // calculateRoute();
    var markerupdation = 0;
    const motion= setInterval(()=>{
      console.log("inside setTImeout");
      markerSetter(markerupdation)
      markerupdation= markerupdation+1
      console.log(markerupdation);
      if(markerupdation>500){clearInterval(motion)}
    },100)

  }

  async function calculateRoute() {
    // if (originRef.current.value === "" || destiantionRef.current.value === "") {
    //   return;
    // }
    // // eslint-disable-next-line no-undef
    // const directionsService = new google.maps.DirectionsService();
    // const results = await directionsService.route({
    //   origin: originRef.current.value,
    //   destination: destiantionRef.current.value,
    //   // eslint-disable-next-line no-undef
    //   travelMode: google.maps.TravelMode.DRIVING,
    // });
    // setDirectionsResponse(results);
    // setDistance(results.routes[0].legs[0].distance.text);
    // setDuration(results.routes[0].legs[0].duration.text);

    //   for (var i = 0; i < 2; i++) {
    //     console.log(i);
    //     await timeout(1000);
    //     setpointerLocation(location1);
    //     await timeout(1000);
    //     setpointerLocation(location2);await timeout(1000);
    //     setpointerLocation(location3);await timeout(1000);
    //     setpointerLocation(location4);await timeout(1000);
    //     setpointerLocation(location5);await timeout(1000);
    //     setpointerLocation(location6);await timeout(1000);


    // }

    //    for (var i = 0; i < markerLocation.length; i++) {
       
    //     //await timeout(1);
    //     markerSetter(i);
       
     
    // }

    //i'm coding here to delay the pointer locations by 2 seconds

   
    for (let i = 0; i < 20; i++) {
     // markerSetter(i);
     console.log("value of i is",i);
      
     setTimeout(()=>{

     },2000)
        
        setpointerLocation(() => { 
          return {
            lat: parseFloat(markerLocation[i].lng),
            lng: parseFloat(markerLocation[i].ln),
          }
        })  


      
    }
  }

  
  function markerSetter(count) {
   //setCount(count+1);
   console.log(count);
    setpointerLocation(() => {
      console.log("count value inside setPointer is ",count)
      return {
        lat: parseFloat(markerLocation[count].lng),
        lng: parseFloat(markerLocation[count].ln),
      };
    });
  }

  

  function timeout(delay){
    return new Promise( res => setTimeout(res,delay));
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  function getData(val) {
    settextboxValue(val.target.value);
    console.warn(textboxValue);
  }

  //I will fetch the gpsCoordinates from backend here

  return (
    <BrowserRouter>
      <Flex
        position="relative"
        flexDirection="column"
        alignItems="center"
        h="100vh"
        w="100vw"
      >
        <Routes>
          <Route path="/" element={home}></Route>
          <Route path="/about" element={findOrder}></Route>
        </Routes>
        <Box position="absolute" left={0} top={0} h="100%" w="100%">
          {/* Google Map Box */}
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            {
              /* <Marker position = {pointerLocation} icon={'http://maps.google.com/mapfiles/kml/paddle/blu-blank.png'} height='4px' width='4px'/> */
              <Marker position={pointerLocation} />
            }

            {/* <Marker position={center} /> */}
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>
        <Box
          p={4}
          borderRadius="lg"
          m={4}
          bgColor="white"
          shadow="base"
          minW="container.md"
          zIndex="1"
        >
          <HStack spacing={2} justifyContent="space-between">
            <Box flexGrow={1}>
              <Input type="text" placeholder="Order_ID" onChange={getData} />
              <IconButton
                onClick={() => {
                  searchOrder();
                }}
                aria-label="center back"
                icon={<FaLocationArrow />}
              />
            </Box>
            <Box flexGrow={1}>
              <Autocomplete>
                <Input type="text" placeholder="Origin" ref={originRef} />
              </Autocomplete>
            </Box>
            <Box flexGrow={1}>
              <Autocomplete>
                <Input
                  type="text"
                  placeholder="Destination"
                  ref={destiantionRef}
                />
              </Autocomplete>
            </Box>

            <ButtonGroup>
              <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
                Calculate Route
              </Button>
              <IconButton
                aria-label="center back"
                icon={<FaTimes />}
                onClick={clearRoute}
              />
            </ButtonGroup>

            <ButtonGroup>
              <Button>markerSetter</Button>
            </ButtonGroup>
          </HStack>
          <HStack spacing={4} mt={4} justifyContent="space-between">
            <Text>Distance: {distance} </Text>
            <Text>Duration: {duration} </Text>
            <IconButton
              aria-label="center back"
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.panTo(
                  center
                ); /* this map was not getting panTo options And I had to alter useState map */
                map.setZoom(15); /*the center value is hard coded for now */
              }}
            />
          </HStack>
        </Box>
      </Flex>
    </BrowserRouter>
  );
}

export default App;
