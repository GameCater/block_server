module.exports = (app) => {
    require("./log")(app);
    require("./cors")(app);

    const express = require('express');
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

}