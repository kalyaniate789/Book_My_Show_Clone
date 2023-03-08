import React, {useState} from "react";
import {useEffect} from "react";
import {movies, slots, seats} from "./data";

function Input({selected,count,selectedCount}) {
  const [inputValue, setInputValue] = useState(0);
  useEffect(() => {
    if (!selected) {
      setInputValue(0);
    }else{
      selectedCount(inputValue);
    }
  }, [inputValue, selected]);
  return (
    <input
      type="number"
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      placeholder="0"
      max="20"
      min="1"
    />
  );
}

function BookMovie() {
  const [lastBooking,setLastBooking] = useState({});
  const [selectedMovie, setSelectedMovie] = useState();
  const [selectedSlot, setSelectedSlot] = useState();
  const [selectedSeats, setSelectedSeats] = useState();
  const [selectedCount, setSelectedCount] = useState(0)
  const [totalData,setTotalData] = useState({});

  // validation states
  const [isMovie,setIsMovie] = useState()
  const [isSlot,setIsSlot] = useState()
  const [isSeat,setIsSeat] = useState()

  const fetchLastBooking = ()=>{
     fetch("http://localhost:8080/api/booking")
     .then((res) => res.json())
     .then((json) => {
      setLastBooking(json)
     });
  }

  const resetForm = ()=>{
    setSelectedMovie()
    setSelectedSlot()
    setSelectedSeats()
    document.querySelectorAll('input').forEach(input=>input.value = 0)
  }

  useEffect(()=>{
    fetchLastBooking()
  },[])

  useEffect(()=>{
    var finalData = {};
    finalData.movie = selectedMovie
    finalData.slot = selectedSlot
    finalData.seats = {
      A1 : 0,
      A2 : 0,
      A3 : 0,
      A4 : 0,
      D1 : 0,
      D2 : 0
    }
    finalData.seats[selectedSeats] = parseInt(selectedCount);
    if(selectedMovie){
      setIsMovie();
    }
    if(selectedSlot){
      setIsSlot();
    }
    console.log(selectedCount);
    if(selectedCount > 0){
      setIsSeat();
    }
    setTotalData(finalData)
  },[selectedMovie,selectedSlot,selectedSeats,selectedCount])

  const sendData  =(data)=>{
     fetch("http://localhost:8080/api/booking",{
      method: "POST",
      body : JSON.stringify({...data}),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
     })
.then(response => response.json())
.then(json => {
  fetchLastBooking();
  resetForm()
});
  }

  const bookMovie = ()=>{
      const validation = {}
     if(!totalData.movie){
      validation.isMovie = false;
     }else{
      validation.isMovie = true;
     }

     if(!totalData.slot){
      validation.isSlot = false
     }else{
      validation.isSlot = true
     }

     if(!Object.values(totalData.seats).find(a=> a > 0)){
      validation.isSeat = false
     }else{
      validation.isSeat = true
     }

     if(!validation.isMovie){
      setIsMovie('Please Select a movie');
     }
     if(!validation.isSlot){
      setIsSlot('please select a Slot');
     }
     if(!validation.isSeat){
      setIsSeat('minimum 1 seat requied');
     }

     if(validation.isMovie && validation.isSlot && validation.isSeat){
      // send data to api
       sendData(totalData)
     }

    }
  
  return (
    <div>
      <h2 className="main-title">Book that show !!</h2>
      <div className="main">
        <div className="left">
          <div className="movie-row">
            <h3>Select A Movie</h3>
            {movies.map((movie, i) => (
              <div
                key={i}
                className={`movie-column ${
                  movie == selectedMovie ? "movie-column-selected" : ""
                }`}
                onClick={() => setSelectedMovie(movie)}
              >
                {movie}
              </div>
            ))}
          </div>
          {isMovie && <p className="err">{isMovie}</p>}
          <div className="slot-row">
            <h3>Select a Time Slot</h3>
            {slots.map((slot, i) => (
              <div
                key={i}
                className={`slot-column ${
                  slot == selectedSlot ? "slot-column-selected" : ""
                }`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </div>
            ))}
          </div>
          {isSlot && <p className="err">{isSlot}</p>}
          <div className="seat-row">
            <h3>Select the seats</h3>
            {seats.map((seat, i) => (
              <div
                key={i}
                className={`seat-column ${
                  seat == selectedSeats ? "seat-column-selected" : ""
                }`}
                onClick={() => setSelectedSeats(seat)}
              >
                Type {seat} <br /> <br />
                <Input count={selectedCount} selectedCount = {setSelectedCount} selected={seat == selectedSeats} />
              </div>
            ))}
          </div>
          {isSeat && <p className="err">{isSeat}</p>}
          <div className="book-button">
            <button onClick = {bookMovie}>Book Now</button>
          </div>
        </div>
        <div className="right">
          <div className="last-order">
            <h3>Last booking details:</h3>
            {
              JSON.stringify(lastBooking) !== '{}' ?
              <div>
                <p><b>Seats:</b></p>
                <p><b>A1: {lastBooking.seats.A1}</b></p>
                <p><b>A2: {lastBooking.seats.A2}</b></p>
                <p><b>A3: {lastBooking.seats.A3}</b></p>
                <p><b>A4: {lastBooking.seats.A4}</b></p>
                <p><b>D1: {lastBooking.seats.D1}</b></p>
                <p><b>D2: {lastBooking.seats.D2}</b></p>
                <p><b>Slot: {lastBooking.slot}</b></p>
                <p><b>Movie: {lastBooking.movie}</b></p>
              </div>
              :
              <div>No Booking Found</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookMovie;
