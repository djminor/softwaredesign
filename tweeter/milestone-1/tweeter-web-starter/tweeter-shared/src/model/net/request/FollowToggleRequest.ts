// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowToggleRequest extends TweeterRequest {
    readonly token: string;
    readonly user: UserDto;
}
