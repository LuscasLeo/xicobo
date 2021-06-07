const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

/**
 * @type import('typeorm').ConnectionOptions
 */
module.exports = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "donttouch",
    database: "teste_di",
    synchronize: false,
    logging: true,
    entities: ["src/database/entity/**/*.ts"],
    migrations: ["src/database/migration/**/*.ts"],
    cli: {
        entitiesDir: "src/database/entity",
        migrationsDir: "src/database/migration",
        subscribersDir: "src/database/subscriber",
    },
    namingStrategy: new SnakeNamingStrategy(),
};
