import express from "express";
import "reflect-metadata";
import { RoutingControllersOptions, useExpressServer } from "routing-controllers";
import "source-map-support/register";
import AuthorsController from "./app/authors/authors.controller";
import configuration from "./configuration";
import { loadContainers, loadDatabaseConnection, loadDocRoute } from "./core/loaders";
import { rootLogger } from "./core/logging/logger";
import DefaultMiddleware from "./app/middlewares/app.middleware";
import HttpErrorAfterMiddleware from "./app/middlewares/http.error.after.middleware";
import SessionController from "./app/session/session.controller";
import UserController from "./app/users/user.controller";

/**
 * Entrypoint (Funcção principal) do sistema
 */
async function main() {
    rootLogger.info("Inicializando Aplicação");
    loadContainers();

    rootLogger.info("Conectando ao Banco de dados");
    await loadDatabaseConnection(configuration.ormConfigFile);

    const config: RoutingControllersOptions = {
        controllers: [AuthorsController, UserController, SessionController],
        middlewares: [DefaultMiddleware, HttpErrorAfterMiddleware],
        defaultErrorHandler: true,
        classTransformer: true,
    };

    const app = express();
    loadDocRoute("/docs", app, config, {
        components: {
            securitySchemes: {
                bearerToken: {
                    type: "http",
                    scheme: "bearer",
                },
            },
        },
        info: {
            title: "Documentação da API",
            version: "1.0.0",
        },
    });
    const server = useExpressServer(app, config);

    rootLogger.info("Iniciando Endpoint");
    server.listen(configuration.serverPort, () => rootLogger.info("App listening to port " + configuration.serverPort));
}

main().catch((err) => console.log(err));
