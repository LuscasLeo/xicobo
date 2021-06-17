import { EntitySubscriberInterface, InsertEvent } from "typeorm";
import { User } from "../entity/User";

export default class UserSubscriber implements EntitySubscriberInterface<User> {
    beforeInsert(event: InsertEvent<User>) {
        console.log("Entidade inserida", event.entity);
    }
}
