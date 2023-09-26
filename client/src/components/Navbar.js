import React,{useContext} from "react"
import {Link,useNavigate} from 'react-router-dom'
import {userContext} from '../App'
const NavBar=()=>{
  const {state,dispatch}=useContext(userContext);
  const navigate=useNavigate();
  const renderList=()=>{
    if(state){
      return[
      <ul>
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/CreatePost">CreatePost</Link></li>
      <li><Link to="/myfollowerpost">My following posts</Link></li>
      <li>
      <button className="btn red darken-1"
            onClick={()=>{
              localStorage.clear();
              dispatch({type:"CLEAR"});
              navigate('/signin')
            }}
            >
                LogOut
            </button>
      </li>
      </ul>
      ]
    }
    else{
      return[
        <ul>
        <li><Link to="/signin">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
      </ul>
      ]
  }
}
    return(
        <nav>
    <div className="nav-wrapper">
      <Link to={state?'/':'/signin'} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
  </nav>
    )
 }
 export default NavBar;