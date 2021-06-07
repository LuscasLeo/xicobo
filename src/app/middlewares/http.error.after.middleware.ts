import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";

@Middleware({ type: "after" })
@Service()
export default class HttpErrorAfterMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, res: Response, next?: NextFunction): void {
        if (!res.headersSent) {
            // TODO: match current url against every registered one
            // because finalhandler is reached if no value is returned in the controller.
            // so we need to set 404 only if really there are no path handling this.
            // or we just have to return with null?
            res.status(404);
            res.json({ message: "Oops, this road leads to nowhere!." });
        }
        res.end();
    }
}
