import { Flight } from "./entity/Flight";

export class Observer {
    public update(flight: Flight) {
        console.log(flight)
    }
}