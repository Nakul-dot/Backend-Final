const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));


app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next(); 
});

const validateSignupData = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('All fields (username, email, password) are required!');
    }

    next(); 
};


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});


app.post('/signup', validateSignupData, (req, res) => {
    const userData = `Username: ${req.body.username}, Email: ${req.body.email}, Password: ${req.body.password}\n`;
    fs.appendFile('user_data.txt', userData, (err) => {
        if (err) throw err;
        console.log('User data saved!');
    });

    res.send('Signup successful! Your data has been saved.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
