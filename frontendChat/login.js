async function login(e){
   try{
        e.preventDefault();
        const logindetails={
            email:e.target.email.value,
            password:e.target.password.value
          }
      
    console.log(logindetails);
    const response= await axios.post("http://localhost:4000/users/login",logindetails)
    if(response.status==201){   
        alert("Successfully logged in"); 
    }
    
        }catch(err){
         console.log(err);
         document.body.innerHTML=`<div style="color:red;">${err.message} <div>`
    }
}

document.getElementById('reset-button').onclick=async function(e){
    try{
        window.location.href="./resetform.html"
    }
    catch(err){
        console.log(err);
        document.body.innerHTML=`<div style="color:red;">${err.message} <div>`
    }
}