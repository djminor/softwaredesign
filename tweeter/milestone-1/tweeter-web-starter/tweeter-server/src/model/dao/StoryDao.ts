// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";
import { DataPage } from "./DataPage";

export interface StatusRecord {
  readonly sender_alias: string;
  readonly timestamp: number;
  readonly post: string;
  readonly statusDto: StatusDto;
}

export interface StoryDao {
  putStoryItem(status: StatusRecord): Promise<void>;
  getPageOfStory(
    senderAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<DataPage<StatusRecord>>;
}
