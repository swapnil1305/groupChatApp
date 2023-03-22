const email = document.querySelector('#email');
const password = document.querySelector('#password');
async function login(e) {
    try {
        e.preventDefault();
        let logindetails = {
            email: email.value,
            password: password.value
        }

        const response = await axios.post("http://44.204.114.231:4000/users/login", logindetails)
        if (response.status == 201) {
            alert("successfully logged in")
        }
        localStorage.setItem('token', response.data.token);
        window.location.href = "./chat.html"
    }
    catch (err) {
        console.log(err);
        document.body.innerHTML = `<div style="color:red;">${err.message} <div>`
        document.body.innerHTML = `<div style="color:red;">${err.data.message} <div>`
    }
}