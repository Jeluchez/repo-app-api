const express = require('express');
const http = require('http');
// const socketio = require('socket.io');
const path = require('path');
// const Sockets = require('./Sockets');
const cors = require('cors');

const { dbConnection } = require('../database/config');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        // Conectar a DB
        dbConnection();

        // http server
        this.server = http.createServer(this.app);
        // this.io = socketio(this.server, {/*configuraciones*/ });
    }

    // configuracionSockets(){
    //     new Sockets(this.io);
    // }
    middleware() {
        this.app.enable('trust proxy')
        // CORS
        this.app.use(cors());
        
        // Parseo del body
        this.app.use( express.json() );

        // API End Points
        this.app.use( '/api/v1/user', require('../router/auth') );
    }
    execute() {

        // initialize middleware
        this.middleware();

        // Initialize sockets
        // this.configuracionSockets();

        // initialize server
        this.server.listen(this.port, () => {
            console.log(`runnig server in port: `, this.port);
        });
    }
}


module.exports = Server;