import express from 'express';
import fs from 'fs';
const fun = express();
fun.use(express.json());
fun.use(express.urlencoded({ extended: false }));
let index = null

const form = () => {
    let body = ''
    let data = fs.readFileSync('empdtls.txt').toString();
    data = JSON.parse(data);
    let table = '';
    data.map((ele, index) => {
        table += `<tr id='${index}'>
        <td>${ele.id}</td>
        <td>${ele.name}</td>
        <td>${ele.phone}</td>
        <td>${ele.mail}</td>
        <td><a href="/delete/${index}"><button class='mx-2 btn btn-danger'>Delete</button></a><a href="/update/${index}"><button class='mx-2 btn btn-primary'>Update</button></a></td>
        </tr>`
    })
    body = `<!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Render Employee</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            </head>

            <body>
                <ul class="nav nav-pills navbar navbar-dark bg-dark">
                    <div class="container">
                        <a class="navbar-brand navbar-dark" href="#">NeoSoft</a>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="http://localhost:3000">Homepage</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="http://localhost:3000/addemployee">Add Employee</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Welcome Back</a>
                        </li>
                    </div>
                </ul>

                <div class="text-center d-flex justify-content-center">
                        <table class="m-5 table table-dark">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                    <th>Employee Contact No.</th>
                                    <th>Employee Email</th>
                                    <th>Actions<th>
                                </tr>
                            </thead>
                            <tbody>
                                ${table}
                            </tbody>
                        </table>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous">
                </script>
            </body>

            </html>`
    return body;
}

fun.get('/', (req, res) => {
    res.send(form());
});

fun.get('/addemployee', (req, res) => {
    res.sendFile('EmployeeForm.html', { root: '.' })
})

fun.post('/addemployee', (req, res) => {
    console.log(req.body)
    let data = fs.readFileSync('empdtls.txt').toString();
    data = data.slice(0, -1);
    if (data == '[')
        fs.writeFileSync('empdtls.txt', `${data}{"id":"${req.body.id}","name":"${req.body.name}","phone":"${req.body.phn}","mail":"${req.body.mail}"}]`);
    else
        fs.writeFileSync('empdtls.txt', `${data},{"id":"${req.body.id}","name":"${req.body.name}","phone":"${req.body.phn}","mail":"${req.body.mail}"}]`);
    res.redirect(301, "http://localhost:3000");

})

fun.get("/delete/:is", (req, res) => {
    console.log("in delete")
    let data = fs.readFileSync('empdtls.txt').toString();
    data = JSON.parse(data);
    console.log(data);
    data.splice(req.params.is, 1);
    console.log(data);
    fs.writeFileSync('empdtls.txt', JSON.stringify(data));
    res.redirect(301, "http://localhost:3000");
})

fun.get("/update/:is", (req, res) => {
    console.log("in update");
    index = req.params.is;
    res.sendFile('UpdateEmployee.html', { root: '.' })
})

fun.post("/updatefile", (req, res) => {
    console.log("in update post")
    let data = fs.readFileSync('empdtls.txt').toString();
    data = JSON.parse(data);
    console.log(data);
    if (index != null)
        data[index] = { "id": req.body.id, "name": req.body.name, "phone": req.body.phn, "mail": req.body.mail };
    console.log(data);

    fs.writeFileSync('empdtls.txt', JSON.stringify(data));
    res.redirect(301, "http://localhost:3000");
    index = null
})

fun.get('*', (req, res) => {
    res.send(`<h1>category is Not Valid  </h1>`);
})

fun.listen(3000, (err) => {
    if (err) throw err;
})