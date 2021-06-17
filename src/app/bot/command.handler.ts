import { mkdir, writeFile } from "fs/promises";
import { ParsedArgs } from "minimist";
import { Message, Whatsapp } from "venom-bot";
import { rootLogger } from "../../core/logging/logger";
import MyinstantsService, { SoundNotFoundError } from "../myinstants/myinstants.service";
import { getRandom } from "../utils";
import fs from "fs";

export abstract class CommandHandler {
    abstract getDescription(): string;
    abstract getUsage(): string;

    abstract handle(args: ParsedArgs, message: Message): Promise<void>;
}

abstract class SendAudioCommandHandler extends CommandHandler {
    constructor(private botSession: Whatsapp) {
        super();
    }

    async sendAudio(name: string, chatId: string) {
        await this.botSession.sendVoice(chatId, `resources/${name}`);
    }

    getDescription() {
        return "Envia audio";
    }

    getUsage() {
        return "";
    }
}

export class SendRapazCommandHandler extends SendAudioCommandHandler {
    async handle(args: ParsedArgs, message: Message) {
        await this.sendAudio("rapaz.mp3", message.chatId);
    }
}

export class SendRatinhoCommandHandler extends SendAudioCommandHandler {
    async handle(args: ParsedArgs, message: Message) {
        await this.sendAudio("ratinho.mp3", message.chatId);
    }
}

export class SendEEpaCommandHandler extends SendAudioCommandHandler {
    async handle(args: ParsedArgs, message: Message) {
        await this.sendAudio("eepa.mp3", message.chatId);
    }
}

export class SendCalmaCommandHandler extends SendAudioCommandHandler {
    async handle(args: ParsedArgs, message: Message) {
        await this.sendAudio("calma.mp3", message.chatId);
    }
}

export class SendAcabouCommandHandler extends SendAudioCommandHandler {
    async handle(args: ParsedArgs, message: Message) {
        await this.sendAudio("acabou.mp3", message.chatId);
    }
}

export class SendDancaCommandHandler extends SendAudioCommandHandler {
    async handle(args: ParsedArgs, message: Message) {
        await this.sendAudio("rapaz.mp3", message.chatId);
    }
}

export class SorteiaCommandHandler extends CommandHandler {
    constructor(private botID: string, private session: Whatsapp) {
        super();
    }

    getDescription() {
        return "Sorteia alguem da equipe";
    }

    getUsage() {
        return "";
    }

    async handle(args: ParsedArgs, message: Message) {
        const members = await (await this.session.getGroupMembers(message.chatId)).filter((member) => member.id._serialized != this.botID);
        const member = getRandom(members);

        const formatMessages: Array<(name: string) => string> = [(name) => `${name}, eu escolho você! 🔴⚪`, (name) => `${name}, CHAAAAAAMA`, (name) => ` =============>>  ${name}  <<===============`];

        if (!member) member;
        await this.session.sendMentioned(message.chatId, getRandom(formatMessages)(`@${member.id.user}`), [member.id.user]);
    }
}

export class MandaCommandHandler extends CommandHandler {
    constructor(private session: Whatsapp) {
        super();
    }

    getDescription() {
        return "Manda alguma coisa pra alguem";
    }

    getUsage() {
        return ' -p <quem> --assim "<Texto>"';
    }

    async handle(args: ParsedArgs, message: Message) {
        if (!args["p"]) {
            await this.session.reply(message.chatId, 'Tenho que saber pra quem né? manda assim -p <alguem> --assim "Teu texto"', message.id.toString());
            return;
        }

        if (!args["assim"]) {
            await this.session.reply(message.chatId, 'Ta mas tu vai mandar o que? manda assim -p <alguem> --assim "Teu texto"', message.id.toString());
            return;
        }

        const nopv = !!args["nopv"];

        if (nopv) {
            await this.session.sendText(`${String(args["p"]).replace("@", "")}@c.us`, String(args["assim"]));
            await this.session.reply(message.chatId, "Lancei", message.id.toString());
        } else {
            await this.session.sendMentioned(message.chatId, `${args["p"]}, ${args["assim"]}`, [String(args["p"]).replace("@", "")]);
        }
    }
}

export class MyInstantDownloadCommandHandler extends CommandHandler {
    constructor(private session: Whatsapp, private service: MyinstantsService) {
        super();
    }

    getDescription() {
        return "Manda um som do MyInstants";
    }
    getUsage() {
        return "<id_do_som>";
    }
    async handle(args: ParsedArgs, message: Message) {
        const soundID = args._[0];

        if (!soundID) {
            this.session.reply(message.chatId, "Eu não faço mágica, faço requests, manda o nome do som tbm po", message.id.toString());
            return;
        }

        const dir = `resources/my-instants/${soundID}`;
        if (!fs.existsSync(dir)) {
            try {
                const soundContent = await this.service.getSoundData(soundID);
                await mkdir(dir);
                await writeFile(`${dir}/sound.mp3`, soundContent);
            } catch (err) {
                rootLogger.error(err);
                if (err instanceof SoundNotFoundError) {
                    this.session.reply(message.chatId, "Putz, não achei esse som!", message.id.toString());
                    return;
                }
            }
        }

        await this.session.sendVoice(message.chatId, `${dir}/sound.mp3`);
    }
}
