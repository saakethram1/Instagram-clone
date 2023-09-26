import {createContext, useReducer,useContext} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import './App.css';
import React, { useEffect } from 'react';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import Signin from './components/screens/Login';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribeUserPosts from './components/screens/SubscribeUserPosts'
import { reducer, initialState } from './reducers/userReducer.js';
import {useNavigate } from 'react-router-dom';

export const userContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const {state,dispatch}=useContext(userContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({type:"USER",payload:user})
    
    } else {
      navigate('/signin');
    }
  }, []);

  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" exact element={<Profile />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/profile/:userid" element={<UserProfile />} />
        <Route path="/myfollowerpost" element={<SubscribeUserPosts />} />
      </Routes>
    
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <userContext.Provider value={{ state, dispatch }}>
      <Router>
        <NavBar />
        
          <Routing />
        
      </Router>
    </userContext.Provider>
  );
}

export default App;
