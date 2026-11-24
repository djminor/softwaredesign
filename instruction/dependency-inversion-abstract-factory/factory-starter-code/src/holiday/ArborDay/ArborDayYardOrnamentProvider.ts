import { YardOrnamentProvider } from "../YardOrnamentProvider";

export class ArborDayYardOrnamentProvider implements YardOrnamentProvider {
    getOrnament(): string {
        return "Nebraska football helmet"
    }
}