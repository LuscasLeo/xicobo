import minimist from "minimist";
import stringArgv from "string-argv";
import * as venom from "venom-bot";
import { Message } from "venom-bot";
import MyinstantsService from "../myinstants/myinstants.service";
import { getRandom } from "../utils";
import {
    CommandHandler,
    MandaCommandHandler,
    MyInstantDownloadCommandHandler,
    SendAcabouCommandHandler,
    SendCalmaCommandHandler,
    SendDancaCommandHandler,
    SendEEpaCommandHandler,
    SendRapazCommandHandler,
    SendRatinhoCommandHandler,
} from "./command.handler";

export async function createBotSession(botID: string) {
    const session = await venom.create({
        session: "main",
    });

    return new BotSession(botID, session);
}

export class BotSession {
    private commandHandlers: { [kay: string]: CommandHandler };

    constructor(private botID: string, private session: venom.Whatsapp) {
        this.commandHandlers = {
            rapaz: new SendRapazCommandHandler(this.session),
            ratinho: new SendRatinhoCommandHandler(this.session),
            eepa: new SendEEpaCommandHandler(this.session),
            danca: new SendDancaCommandHandler(this.session),
            acabou: new SendAcabouCommandHandler(this.session),
            calma: new SendCalmaCommandHandler(this.session),
            manda: new MandaCommandHandler(this.session),
            som: new MyInstantDownloadCommandHandler(this.session, new MyinstantsService()),
        };

        this.session.onMessage((message) => {
            const hasMentioned = this.isBotMentioned(message);
            if (hasMentioned) {
                this.handleMessage(message).catch((err) => console.log(err));
            }
        });
    }

    isBotMentioned(message: Message) {
        const filtered = message.mentionedJidList.filter((e) => e === this.botID);
        return filtered.length > 0;
    }

    isValidMessage(message: Message) {
        return message.type === "chat";
    }

    async handleMessage(message: Message) {
        if (!this.isValidMessage(message)) {
            await this.session.reply(message.chatId, "Não entendo mensagens que não sejam somente texto :/\n nem Alguns textos alias.", message.id.toString());

            return;
        }

        await this.handleCommand(message);
    }

    async handleCommand(message: Message) {
        const spl = message.content.split(" ").splice(1);
        if (!spl.length) {
            await this.session.reply(message.chatId, "Que? fala", message.id.toString());
            return;
        }

        const argv = stringArgv(spl.splice(1).join(" "));

        const command = spl[0].toLowerCase();

        const args = minimist(argv);

        if (this.commandHandlers[command]) {
            await this.commandHandlers[command].handle(args, message);
        } else {
            const randomMessages = ["????", "Ta, explica melhor", "a", "ta mas tu concorda comigo que eu sou um chatbot, certo?"];

            await this.session.reply(message.chatId, getRandom(randomMessages), message.id.toString());
        }
    }

    async sendText(to: string, content: string) {
        await this.session.sendText(to, content);
    }
}
