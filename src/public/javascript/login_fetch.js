
document.getElementById('login_account').onclick = async () => {
    const username_got = document.getElementById('username');
    const password_got = document.getElementById('password');

    const username = username_got.value;
    const password = password_got.value;

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
        username_got.value = "";
        password_got.value = "";
        alert(msg);
    }

}

function registerPath() {
    window.location = '/register';
}