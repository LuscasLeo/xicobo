import { useContainer as useRCContainer } from "routing-controllers";
import { Container as TDContainer } from "typedi";
export function loadRountingControllerContainer() {
    useRCContainer(TDContainer);
    return TDContainer;
}
