module.exports = (app) => {
    require("./admin/admin")(app);
    require("./client/client")(app);
}