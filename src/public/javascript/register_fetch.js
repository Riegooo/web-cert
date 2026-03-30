
document.getElementById('create_account').onclick = async () => {
    const firstname_got = document.getElementById('firstname');
    const lastname_got = document.getElementById('lastname');
    const username_got = document.getElementById('username');
    const password_got = document.getElementById('password');
    const email_got = document.getElementById('email');

    if (!username_got || !password_got) return;

    const firstname = firstname_got.value;
    const lastname = lastname_got.value
    const username = username_got.value;
    const password = password_got.value;
    const email = email_got.value;

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
        firstname_got.value = "";
        lastname_got.value = "";
        username_got.value = "";
        password_got.value = "";
        alert(msg);
    }

}

function loginPath() {
    window.location = '/login';
}