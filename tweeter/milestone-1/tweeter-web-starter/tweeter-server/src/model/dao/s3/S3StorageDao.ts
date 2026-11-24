// AI-assisted: see AI-ATTRIBUTION.md
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { S3Dao } from "../S3Dao";

export class S3StorageDao implements S3Dao {
  private static client: S3Client | null = null;
  private readonly bucket: string;
  private readonly region: string;

  constructor(
    bucket: string = process.env.S3_BUCKET || "cs340-tweeter-sproul",
    region: string = process.env.AWS_REGION || "us-west-2"
  ) {
    this.bucket = bucket;
    this.region = region;
  }

  private getClient(): S3Client {
    if (!S3StorageDao.client) {
      S3StorageDao.client = new S3Client({ region: this.region });
    }
    return S3StorageDao.client;
  }

  public async putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    const decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );

    const s3Params = {
      Bucket: this.bucket,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };

    const command = new PutObjectCommand(s3Params);
    const client = this.getClient();

    try {
      await client.send(command);
      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw new Error("s3 put image failed with: " + error);
    }
  }
}
