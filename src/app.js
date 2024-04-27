const express = require('express');
const app = express();
require('./database')(app);
require('./middleware')(app);
require("./routes")(app);

const config = require('./config');
app.listen(config.server.port, (err) => {
    if (err) throw err;
    console.log(`server is running at http://localhost:${config.server.port}`);
});