import { Flight } from "./entity/Flight";
import { Observer } from "./Observer";

export class Subject {
    public observers: Observer[] = []
    public register(observer:Observer) {
        this.observers.push(observer)
    }
    public updateObservers(flight: Flight | null) {
        for(const observer of this.observers) {
            if(flight != null) {
                observer.update(flight)
            } else {
                // do nothing
            }
        }
    }
}