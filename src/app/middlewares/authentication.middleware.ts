import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import configuration from "../../configuration";

//Descomente se quiser que o middleware seja aplicato em TODAS as rotas
// @Middleware({ type: "before" })
@Service()
export default class AuthenticationMiddleware implements ExpressMiddlewareInterface {
    async use(req: Request, res: Response, next: NextFunction) {
        //O app tem o nome do header de autenticação configurável, é possível checar em ../configuration.ts

        const { authHeader } = configuration;

        //Se não existir o header com o nome definido na requisição, é retornado o erro 401 com a mensagem informando que o token não foi providenciado
        if (!(authHeader in req.headers)) return res.status(401).json({ message: "Authorization token not provided!" });

        // É obtido o token e formatado, removendo conteudo que não seja o proprio código
        const token = (req.headers[authHeader] as string).replace("Bearer ", "");

        // Faz a comparação entre o token e a chave secreta
        //CERTIFIQUE-SE DE ALTERAR A CHAVE PARA UM VALOR SEGURO
        try {
            jwt.verify(token, configuration.secretKey);
            next();
            return;
        } catch {
            return res.status(401).json({ message: "Invalid authorization token!" });
        }

        //Se tudo estiver ok, pode prosseguir para a rota desejada
    }
}
