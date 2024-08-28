// import React,{ useState}from "react";
// import axios from 'axios';
// import {useNavigate, Link}from 'react-router-dom';

// function Login(){
//     const history=useNavigate();
//     const [email,setEmail]=useState('')
//     const [password, setPassword]=useState('')
//     async function submit(e){
//         e.preventDefault();
//         try{
//             await axios.post('http://localhost:8000/',{
//                 email,password
//             })
//             .then(res=>{
//                 if(res.data==="exist"){
//                     history("/home",{state:{id:email}})
//                 }
//                 else if(res.data==="notexist"){
//                     alert("User have not sign up")
//                 }
//             })
//             .catch(e=>{
//                 alert("wrong details")
//                 console.log(e);
//             })
//         }
//         catch(e){
//             console.log(e);
//         }
//     }
//     return(
//         <div classroom='login'>
//            <h1>Login</h1>
//            <form action='POST'>
//             <input type='email' onChange={(e)=>{setEmail(e.target.value)}} placeholder="Email" />
//             <input type='password' onChange={(e)=>{setPassword(e.target.value)}} placeholder="Password" />
//             <input type='submit' onClick={submit}/>
//            </form>
//            <br/>
//            <p>OR</p>
//            <br/>
//            <Link to='./signup'>Signup Page</Link>
//         </div>
//     );
// }
// export default Login;

import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const navigate = useNavigate(); // Use navigate instead of history
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function submit(e) {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/', {
                email, password
            });

            if (response.data === "exist") {
                navigate("/home", { state: { id: email } });
            } else if (response.data === "notexist") {
                alert("User has not signed up");
            }
        } catch (error) {
            alert("Wrong details");
            console.log(error);
        }
    }

    return (
        <div className='login'> {/* Changed classroom to className */}
            <h1>Login</h1>
            <form onSubmit={submit}> {/* Use onSubmit for the form */}
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <input type='submit' value='Login' />
            </form>
            <br />
            <p>OR</p>
            <br />
            <Link to='/signup'>Signup Page</Link> {/* Changed to route path */}
        </div>
    );
}

export default Login;
