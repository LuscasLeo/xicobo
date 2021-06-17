import { IsString } from "class-validator";
import { Body, HttpError, JsonController, Post, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Inject, Service, Token } from "typedi";
import { rootLogger } from "../../core/logging/logger";
import AuthenticationMiddleware from "../middlewares/authentication.middleware";
import { BotSession } from "./bot.session";

export const BotSessionToken = new Token<BotSession>("BOT_SESSION");

class SendMessageInput {
    @IsString()
    to: string;

    @IsString()
    content: string;
}

@Service()
@OpenAPI({
    security: [
        {
            bearerToken: [],
        },
    ],
})
@JsonController("/bot", { transformResponse: true })
@UseBefore(AuthenticationMiddleware)
export default class BotController {
    constructor(@Inject(BotSessionToken) private botSession: BotSession) {}

    @Post("/send/text")
    async sendTextMessage(@Body() { to, content }: SendMessageInput) {
        try {
            await this.botSession.sendText(to, content);
            return { message: "done!" };
        } catch (err) {
            rootLogger.error(err);
            throw new HttpError(500, String(err));
        }
    }
}
