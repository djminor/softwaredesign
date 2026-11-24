// AI-assisted: see AI-ATTRIBUTION.md
import { StatusRecord } from "./StoryDao";
import { DataPage } from "./DataPage";

export interface FeedDao {
  putFeedItem(receiverAlias: string, status: StatusRecord): Promise<void>;
  batchPutFeedItems(
    receiverAliases: string[],
    status: StatusRecord
  ): Promise<void>;
  getPageOfFeed(
    receiverAlias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<DataPage<StatusRecord>>;
}
