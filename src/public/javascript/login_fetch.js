
document.getElementById('login_account').onclick = async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const response = await fetch('/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                username: username,
                password: password
            }
        )
    });

    const data = await response.json();
    const msg = data.message;

    console.log("Login response message : ",msg);

    if (data.success) {
        window.location = '/home';
    }else{ 
        username.value = "";
        password.value = "";
        alert(msg);
    }

}

function registerPath() {
    window.location = '/register';
}