import axios, { AxiosError, AxiosInstance } from "axios";
import fetch from "node-fetch";
import { Service } from "typedi";
import { MyInstantSongResponse } from "./types";

@Service()
export default class MyinstantsService {
    private api: AxiosInstance;
    private mediaEndPoint: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: "http://www.myinstants.com/api/v1",
        });

        this.mediaEndPoint = axios.create({
            baseURL: "",
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
            },
        });
    }

    async getSoundData(name: string) {
        try {
            const response = await this.api.get<MyInstantSongResponse>(`/instants/${name}`);
            const { data } = response;

            const { sound: soundUrl } = data;

            const soundResponse = await fetch(soundUrl);
            const soundBuffer = await soundResponse.buffer();

            return soundBuffer;
        } catch (err) {
            if (err.isAxiosError) {
                const { response } = err as AxiosError;
                const { status } = response;
                if (status == 404) {
                    throw new SoundNotFoundError(name);
                }
            }
        }
    }
}

export class SoundNotFoundError extends Error {
    constructor(name: string) {
        super(`Sound ${name} not found!`);
    }
}
