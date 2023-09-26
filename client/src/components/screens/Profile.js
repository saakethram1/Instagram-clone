import React from "react"
import {useEffect,useState} from "react";
import {useContext} from "react";
import {userContext} from "../../App"

const Profile=()=>{
    const [myPics,setPics]=useState([]);
    const {state,dispatch}=useContext(userContext);
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost);
        })
    },[])
    return(
        <div style={{maxWidth:"550px" , margin:"0px auto"}}>
            <div style={{display:"flex", justifyContent:"space-around", margin:"18px 0px", borderBottom:"1px solid grey"}}>
                <div>
                    <img style={{width:"160px" ,height:"160px", borderRadius:"80px"}} alt=""
                    src={state?state.pic:"loading"}/>
                    </div>
                <div>
                <h4>{state?state.name:"loading"}</h4>
                <h5>{state?state.email:"loading"}</h5>
                <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                
                    <h6>{myPics.length} posts</h6>
                    <h6>{state?state.followers.length:"0"} followers</h6>
                    <h6>{state?state.following.length:"0"} following</h6>
                </div>
               
                </div>
                
            </div>
            <div className="gallery">
            {
                myPics.map(item=>{
                    return(
                    <img className="item" alt={item.title} src={item.photo}/>
                    )
                })
            }
                   
                </div>
        </div>
    )
}
export default Profile