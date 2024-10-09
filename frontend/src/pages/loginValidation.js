function validation(values){
    alert("")
    let error={}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern=/^(?=.*\d)(?=.*\[a-z])(?=.*\[A-Z])[a-zA-Z0-9]{8,}$/
    if(values.email_pattern===""){
        error.email="Name should not be empty"
    }else if(!email_pattern.test(values.email)){
        error.email="Email did'nt match"
    }else{
        error.email=""
    }
    if(values.password_pattern===""){
        error.password="Password should not be empty"
    }else if(!password_pattern.test(values.email)){
        error.password="Password did'nt match"
    }else{
        error.password=""
    }
    return error;
}
export default validation;