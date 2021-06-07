import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, ExpressErrorMiddlewareInterface, HttpError, Middleware } from "routing-controllers";
import { Service } from "typedi";
import configuration from "../../configuration";
import { rootLogger } from "../../core/logging/logger";

@Middleware({ type: "after" })
@Service()
export default class ErrorHandlerAfter implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: Response, next: NextFunction) {
        if (error instanceof HttpError) {
            rootLogger.error(error);
        } else rootLogger.error(rootLogger.exceptions.getAllInfo(error));

        next();
    }
}
