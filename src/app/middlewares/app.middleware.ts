import { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";
import configuration from "../../configuration";
import { rootLogger } from "../../core/logging/logger";

@Middleware({ type: "before" })
@Service()
export default class DefaultMiddleware implements ExpressMiddlewareInterface {
    constructor(
        private morganLog = morgan(configuration.requestLogFormat, {
            stream: { write: (data) => rootLogger.http(data) },
            skip: () => !configuration.isDevelopment || configuration.logHttpRequests,
        })
    ) {}

    async use(req: Request, res: Response, next: () => Promise<any>) {
        //Esta função vai logar toda requisição que chegar ao server
        this.morganLog(req, res, () => {});
        next();
    }
}
