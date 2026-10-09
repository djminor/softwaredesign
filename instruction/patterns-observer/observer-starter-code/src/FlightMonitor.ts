import { FlightDeltaReporter } from "./FlightDeltaReporter";
import { FlightFeed } from "./FlightFeed";
import { FlightStatusReporter } from "./FlightStatusReporter";

main();

function main() {
  let feed = new FlightFeed();
  let statusObserver = new FlightStatusReporter
  let deltaObserver = new FlightDeltaReporter
  statusObserver.setFeed(feed)
  deltaObserver.setFeed(feed)
  feed.register(statusObserver)
  feed.register(deltaObserver)
  feed.start();
}
