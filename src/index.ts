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

    /**
     * Configuração principal, aqui você irá configurar os Controllers, Middlewares e outras configurações
     * LEMBRE-SE DE SEMPRE ADICIONAR A CLASSE EM SEU RESPECTIVO LUGAR ASSIM QUE VOCÊ CRIA-LA
     */

    const config: RoutingControllersOptions = {
        controllers: [AuthorsController, UserController, SessionController],
        middlewares: [DefaultMiddleware, HttpErrorAfterMiddleware],
        defaultErrorHandler: true,
        classTransformer: true,
    };

    const app = express();

    /**
     * Configurações de documentação
     * aqui será utilizado caso você queira expor a documentação gerada autmaticamente na rota indicada no primeiro argumento
     */
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

    /**
     * Configura o servidor para uso com o routing-controllers
     * o valor atribuido a server é igual ao app
     */
    const server = useExpressServer(app, config);

    rootLogger.info("Iniciando Endpoint");
    server.listen(configuration.serverPort, () => rootLogger.info("App listening to port " + configuration.serverPort));
}

main().catch((err) => console.log(err));
