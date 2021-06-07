import path from "path";
import winston, { createLogger } from "winston";
import { Console, File } from "winston/lib/winston/transports";
import configuration from "../../configuration";

const format = [
    // Add the message timestamp with the preferred format
    winston.format.timestamp({ format: configuration.logDateTimeFormat }),

    // Define the format of the message showing the timestamp, the level and the message
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    winston.format.errors({ stack: true }),
];

export const rootLogger = createLogger({
    level: "debug",
    format: winston.format.combine(...format),
    defaultMeta: { service: "user-service" },
    transports: [
        new File({
            filename: path.resolve(configuration.logsFolder, "error.log"),
            level: "error",
            format: winston.format.json(),
        }),
        new File({
            filename: path.resolve(configuration.logsFolder, "general.log"),
            format: winston.format.json(),
        }),
        new Console({
            handleExceptions: true,
            format: winston.format.combine(...[winston.format.colorize({ all: true }), ...format]),
        }),
    ],
});
