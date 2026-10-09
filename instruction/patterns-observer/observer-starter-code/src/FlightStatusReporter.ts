import { FlightFeed } from "./FlightFeed";
import { Observer } from "./Observer";

export class FlightStatusReporter extends Observer {

    public feed!: FlightFeed

    public setFeed(feed: FlightFeed) {
        this.feed = feed
    }

    public async update() {
        let flight = await this.feed.getFirstFlights()
        if(flight != null) {
            console.log('STATUS: ')
            console.log(flight)
        } else {
            console.log('STATUS: no flight')
        }
    }

}