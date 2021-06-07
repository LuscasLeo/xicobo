import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { Express } from "express";
import { OpenAPIObject } from "openapi3-ts";
import path from "path";
import { getMetadataArgsStorage, RoutingControllersOptions } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import * as swaggerUiExpress from "swagger-ui-express";
import { createConnection } from "typeorm";
import { loadRountingControllerContainer } from "./di/routing";
import { loadTypeDIExtensionContainer } from "./di/typedi-ext";

/**
 * Prepara conexão com banco de dados
 * @param configFile Caminnho para o arquivo de configuração
 * @returns {import('typeorm').Connection}
 */
export async function loadDatabaseConnection(configFile: string) {
    const ormConfigPath = path.join(process.cwd(), configFile);
    const ormConfig = require(ormConfigPath);

    return await createConnection({ ...ormConfig });
}

/**
 *
 * @param prefix : Rota para acesso a interface de rotas
 * @param app : App express para implantar o middleware de documentação
 * @param routingConfig : Objeto de configuração routing-controllers
 * @param openApiConfig : Objeto de configuração OpenAPI
 */
export function loadDocRoute(prefix: string, app: Express, routingConfig: RoutingControllersOptions, openApiConfig: Partial<OpenAPIObject>) {
    const { defaultMetadataStorage } = require("class-transformer/cjs/storage");

    // Parse class-validator classes into JSON Schema:
    const schemas = validationMetadatasToSchemas({
        classTransformerMetadataStorage: defaultMetadataStorage,
        refPointerPrefix: "#/components/schemas/",
    });

    // Parse routing-controllers classes into OpenAPI spec:
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingConfig, {
        ...openApiConfig,

        components: {
            ...openApiConfig.components,
            schemas,
        },
    });

    app.use(prefix, swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
}

/**
 * Carrega
 */
export async function loadContainers() {
    loadTypeDIExtensionContainer();
    loadRountingControllerContainer();
}
