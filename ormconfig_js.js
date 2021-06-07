const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

module.exports = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "donttouch",
    database: "teste_di",
    synchronize: false,
    logging: true,
    entities: ["out/database/entity/**/*.js"],
    subscribers: ["out/database/subscriber/**/*.js"],
    namingStrategy: new SnakeNamingStrategy(),
};
