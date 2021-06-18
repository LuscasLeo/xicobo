import { useContainer } from "typeorm";
import { Container } from "typeorm-typedi-extensions";
export async function loadTypeDIExtensionContainer() {
    useContainer(Container);
}
