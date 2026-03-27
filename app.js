const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// CONFIG
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SESSION
app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: false
}));

// BANCO
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'HollandThomas',
    database: 'dblogin01'
});

// ================= ROTAS =================

// HOME INICIAL (REGISTRO)
app.get('/', (req, res) => {
    res.send("FUNCIONOU ROOT");
});

// LOGIN PAGE
app.get('/login', (req, res) => {
    res.render('login', { message: '' });
});

// PÁGINA DE SUCESSO
app.get('/sucesso', (req, res) => {
    res.render('sucesso');
});

// HOME (PROTEGIDA)
app.get('/home', (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    const query = 'SELECT * FROM users WHERE email = ?';

    db.query(query, [req.session.user], (err, results) => {

        if (err) {
            console.log(err);
            return res.send("Erro no banco");
        }

        res.render('home', { user: results[0] });
    });
});

    app.get('/login-exclusivo', (req, res) => {
    res.render('login_exclusivo', { message: '' });
});

// ================= AUTH =================

// REGISTRO
app.post('/register', (req, res) => {

    const {
        nome, idade, sexo, email, senha,
        cpf, nascimento, cartao, validade, cvv
    } = req.body;

    const check = 'SELECT * FROM users WHERE email = ?';

    db.query(check, [email], (err, results) => {

        if (err) {
            console.log(err);
            return res.send("Erro no banco");
        }

        if (results.length > 0) {
            return res.render('registro', { message: 'E-mail já cadastrado' });
        }

        const insert = `
        INSERT INTO users 
        (nome, idade, sexo, email, senha, cpf, nascimento, cartao, validade, cvv)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(insert,
            [nome, idade, sexo, email, senha, cpf, nascimento, cartao, validade, cvv],
            (err) => {

                if (err) {
                    console.log(err);
                    return res.send("Erro ao cadastrar");
                }

                res.redirect('/sucesso');
            });
    });
});

// LOGIN
app.post('/log', (req, res) => {

    const { email, senha } = req.body;

    const query = 'SELECT * FROM users WHERE email = ? AND senha = ?';

    db.query(query, [email, senha], (err, results) => {

        if (err) {
            console.log(err);
            return res.send("Erro no banco");
        }

        if (results.length > 0) {

            req.session.user = email;
            return res.redirect('/home');

        } else {
            return res.render('login', { message: 'Login inválido' });
        }

    });
});

// LOGOUT
app.get('/logout', (req, res) => {
    req.session.destroy();
   res.redirect('/');
});

// SERVER
app.listen(port, () => {
    console.log("Servidor rodando em http://localhost:" + port);
});
console.log(__dirname);