import { FlightStates } from "./entity/FlightStates";
import { FlightFeed } from "./FlightFeed";
import { Observer } from "./Observer";

export class FlightDeltaReporter extends Observer {

    public feed!: FlightFeed
    public prevFlight!: FlightStates | null

    public setFeed(feed: FlightFeed) {
        this.feed = feed
    }

    public async update() {
        let currFlight = await this.feed.getFirstFlights()
        if(currFlight != null && this.prevFlight != null) {
            let deltas = {
                "Longitude": currFlight.states[0].longitude - this.prevFlight.states[0].longitude,
                "Latitude": currFlight.states[0].latitude - this.prevFlight.states[0].latitude,
                "Altitude": currFlight.states[0].geo_altitude - this.prevFlight.states[0].geo_altitude,
                "Velocity": currFlight.states[0].velocity - this.prevFlight.states[0].velocity
            }
            console.log('DELTAS: ')
            console.log(deltas)
        } else {
            console.log('DELTAS: no previous flight')
        }
        this.prevFlight = currFlight
    }

}