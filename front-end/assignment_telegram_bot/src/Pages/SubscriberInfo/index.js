import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import './signup.css'


function SubscriberInfo() {

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      console.log('Token:', token);
    } else {
      console.log('Token cookie does not exist or is not accessible.');
      console.log(document.cooke)
    }
  }, []);


  const [location, setlocation] = useState('');
  const [TeleId, setTeleId] = useState('');
  const [Notification, setNotification] = useState('');
  const [username, setUsername] = useState('');


  const url = process.env.BACK_END_URL;
  const handleLogin = (e) => {
    console.log("hi")
    console.log(location,TeleId,Notification,username)
    e.preventDefault();
    console.log("clicked here")
     const SignUpData = {
      location : location,
      TeleId : TeleId,
      Notification : Notification,
      username : username
    };
      axios.post(`http://localhost:5000/api/signupdata`, SignUpData)
      .then((response)=> {
        console.log(process.env.BACK_END_URL);
          console.log('Success', response)
          if(response.status === 200){
                console.log("Success");
          }
        })
      .catch((err) => {
          console.log('There is an error',err)

          if(err.response.status === 409){
              console.log("not found");
          }
          else if(err.response.status === 400){
            console.log("fail")
          }
      })
    }
  
  return (
    <>
    <h4>Note: Subscription Can be easily done from the telegram itself.</h4>
    <h7>This module is being stoped from development as of now and due to time constraints.</h7>
    <h7>Here is the telegram handle </h7> <br/>
    <h7>Here is the Bot's Telegram Handle<a href="https://t.me/Weather_Kamal_bot"> Bot's Telegram </a></h7>
     <div className='center'>
     <h1 className="title-weather">Daily Weahter </h1>
 <form action="#" onSubmit={handleLogin}>
        <div class="txt_field">
        <input type="text" name="location"
          value={location}
          onChange={(e)=>setlocation(e.target.value)}
          required
          />
          <span></span>
          <label>Location</label>
          </div>
          <div class="txt_field">
          <input type="text" name="TeleId" 
          value={TeleId}
          onChange={(e)=>setTeleId(e.target.value)}
          required
          />
           <span></span>
          <label>Telegram Chat_Id</label>
          </div>
          <div class="txt_field">
          <input type="text" name="Notification" 
          value={Notification}
          onChange={(e)=>setNotification(e.target.value)}
          required
          />
           <span></span>
          <label>Notification Preferences</label>
          </div>
          <div class="txt_field">
          <input type="text" name="username" id="username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          required
          />
           <span></span>
          <label>Username: How We should call you</label>
          </div>
          <button type="submit" className="sub-btn">Subscribe</button>
        </form>
        </div>
    </>
  );
}
export default SubscriberInfo;
