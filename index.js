const enviromentVariables = require('./configs/envVariablesConfig');

const express = require('express');
const cookie_parser = require('cookie-parser');
const body_parser = require('body-parser');
const cors = require('cors');

const swaggerDocs = require('./configs/swagger');

const app = express();

const connect_mongodb = require('./configs/mongodbConnect');
const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(body_parser.json());
//Using cookies
app.use(cookie_parser());

const PORT = enviromentVariables.server_port;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use('/api/', routes);

connect_mongodb();
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
    swaggerDocs(app, PORT);
});





