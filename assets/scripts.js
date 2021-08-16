

const postData = async (email, password) => {
    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            body: JSON.stringify({ email: email, password: password }),
        });
        const { token } = await response.json();
        console.log("pd", token);
        localStorage.setItem('jwt-token',token);
        return token;
    } catch (err) {
        console.error(`Error: ${err}`);
    }
};



const getPosts = async (jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/posts',
            {
                method:'GET',
                headers: {
                Authorization: `Bearer ${jwt}`
                }
            })
            const {data} = await response.json()
            if (data) {
                fillTable(data,'js-table-posts')
                toggleFormAndTable('js-form-wrapper','js-table-wrapper')
            }
    } 
    catch (err) {
        localStorage.clear()
        console.error(`Error: ${err}`)
    }
}

const fillTable = (data, table) => {
    let rows = "";
    $.each(data, (i, row) => {
        rows += `<tr>
                    <td> ${row.title} </td>
                    <td> ${row.body} </td>
                </tr>`;
    });
    $(`#${table} tbody`).append(rows);
};

const toggleFormAndTable = (form,table) => {
    $(`#${form}`).toggle()
    $(`#${table}`).toggle()
}

const init = async () => {
    const token = localStorage.getItem('jwt-token')
    if(token) {
        getPosts(token)
    }
}
init()



const getAlbums = async (jwt, id) => {
    try {
        const response = await fetch('http://localhost:3000/api/albums',
            {
                method:'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const {data} = await response.json()
        if (data) {
            const dataUser = data.filter((item) => {
                console.log(item);
                return item.userId == id;
            });
            console.log("alb", data, typeof data);
            console.log("alb us", dataUser);
            let rows = "";
            $.each(dataUser, (i, row) => {
                rows += `<tr>
                    <td> ${row.id} </td>
                    <td> ${row.title} </td>
                </td>`
            })
            $(`#js-table-albums tbody`).append(rows)
        }
    } 
    catch (err) {
        console.error(`Error: ${err}`)
    }
}



document.getElementById("js-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById('js-input-email').value;
    const password = document.getElementById('js-input-password').value;
    console.log("email", email);
    console.log("pass", password);

    const JWT = await postData(email, password);

    getPosts(JWT)

    getAlbums(JWT, 3)

   


})