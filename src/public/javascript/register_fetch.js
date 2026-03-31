
document.getElementById('create_account').onclick = async () => {
    const firstname = document.getElementById('firstname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!username || !password) return;

    const response = await fetch('/register', {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: password,
                email: email
            }
        )
    })

    const data = await response.json();
    const msg = data.message;

    if (data.success) {
        window.location = '/login'
    } else {
        firstname.value = "";
        lastname.value = "";
        username.value = "";
        password.value = "";
        alert(msg);
    }

}

function loginPath() {
    window.location = '/login';
}