import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import './admins.css'
import AdminLogin from '../AdminLogin';
export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [api, setApi] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set initial state as logged in
  const objectId= "658c1ac43b9561d7d764dddb";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const blockUser = (userId) => {
    console.log('Block user:', userId);
    axios.put(`http://localhost:5000/api/users/block/${userId}`).then((response) => {
      console.log(response);
      fetchUsers(); // Fetch users after blocking
    }).catch((err) => {
      console.log(err);
    });
  };

  const deleteUser = (userId) => {
    console.log('Delete user:', userId);
    axios.delete(`http://localhost:5000/api/users/${userId}`).then((response) => {
      console.log(response);
      // Update the user list after deletion
      const updatedUsers = users.filter((user) => user.tele_id !== userId);
      setUsers(updatedUsers);
    }).catch((err) => {
      console.log(err);
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault()
    const newChat ={
        api: api,
    };
    axios.put(`http://localhost:5000/api/updateApi/${objectId}`,newChat)
    .then((response) => {
        console.log('User registered',response.data)
        console.log("Hi",newChat.api)
    })
    .catch((error)=>{
        console.error('Error registered user:', error)
    })
}
const destroyCookie = () => {
  localStorage.removeItem('token');
  Cookies.remove('token');
  setIsLoggedIn(false); // Update the state to indicate the user is logged out
}

  return (
    <>
    {isLoggedIn ? (
    <div>
      <div className='left'>
      <h1>Welcome to the Admin Panel</h1>
      <ol className='lists'>
        {users.map((user, userIndex) => (
            <li key={userIndex}> <b>Chat Id</b> {user.tele_id} -- <b>Location</b> {user.location}  | <b>Username:</b> {user.username} <br/>
              <button className="admin-btn" type='submit' onClick={() => deleteUser(user.tele_id)}> Remove User </button>
              {user.isBlocked == true ? (
            <button className="admin-btn" type='submit' onClick={() => blockUser(user.tele_id)}> Unblock User </button>
          ) : (
            <button className="admin-btn" onClick={() => blockUser(user.tele_id)}> Block User </button>
          )}
</li> 
        ))} 
      </ol>
      </div>
      <div className='apiReplace'>
      <form onSubmit={handleSubmit}>
        <div className='txt_field'>
             <input type="text" name="fname" 
             value={api}
             onChange={(e)=> setApi(e.target.value)}
             required
             />
            <span></span>
          <label>Change it with your own API keys</label>
        </div>
             <input type="submit" className="btn btn-light" value="Send"/>
        </form>
        </div>
        <input type="submit" className="btn btn-light button-logout" value="Admin Logout" onClick={destroyCookie}/>
    </div>
    ):(
      <h1> <AdminLogin/> </h1>
    )}
    </>
  );
}
