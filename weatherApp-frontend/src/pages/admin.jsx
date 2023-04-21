import { useState } from "react";

export default function admin() {
  const [cityInput, setCityInput] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // Regular expression to validate password

  const addCity = async () => {
    const url = `http://localhost:8001/city`; //defines the URL of the endpoint to which the POST request will be sent.

    if (cityInput==="") {
      alert("Invalid Input");//checking if cityInput is empty or not
      return;
    }
    if (!passwordRegex.test(password)) { // Check if password matches the regex
      alert("Password should have at least 1 uppercase, 1 lowercase, and 1 number");
      return;
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ cityName: cityInput }),// sends a POST request to the server with the city name in the request body and the username and password in the Authorization header.
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      });

      if (response.status === 401) {  //401 indicates user's credentials are invalid
        alert("Invalid credentials");
      } else if (response.status === 500) {    //500 indicates user need to authenticate
        alert("Please Authenticate");
      } 
      else if (response.status === 409) { // 409 indicates that the city already exists in the database
        alert(`The city '${cityInput}' already exists in the database`);
      } 
      else {
        alert("City added"); //sucessfull adding cityname
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    }
  };

  const handleCityInputChange = (event) => {   //updates cityInput state variable
    setCityInput(event.target.value);
  };

  const handleUsernameChange = (event) => { //updates username state variable
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAddCityClick = () => {
    if (!username || !password) {
      alert("Please enter your credentials");  //it checks whether user has entered username and pwd or not
    } else {
      addCity();
    }
  };

  return (
    <div
      className="admin"
      style={{
        marginTop: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <label>Add City Name:</label>
        <br />
        <input
          onChange={handleCityInputChange}
          style={{ border: "2px solid black" }}
          type="text"
          required
        />
        <br />
        <br />
        <label>Username:</label>
        <br />
        <input
          onChange={handleUsernameChange}
          style={{ border: "2px solid black" }}
          type="text"
          required
        />
        <br />
        <br />
        <label>Password:</label>
        <br />
        <input
          onChange={handlePasswordChange}
          style={{ border: "2px solid black" }}
          type="password"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" // Set the password pattern to match the regex
          required
        />
        <br />
        <br />
        <button
          onClick={handleAddCityClick}
          style={{ backgroundColor: "green", padding: "10px 10px" }}
        >
          Add City
        </button>
      </div>
    </div>
  );
}
