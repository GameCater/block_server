module.exports = {
    client: {
        origin: ["http://localhost:8090"],
    },
    auth: {
        secretKey: "blog_server",
        algorithm: "HS256",
        expiresIn: "5d"
    }
}