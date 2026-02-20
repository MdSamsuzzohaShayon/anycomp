import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import formidable from "formidable";
import fs from "fs/promises";
import { env } from "../config/env";

export const r2 = new S3Client({
    region: "auto",
    endpoint: env.s3.api_endpoint, // R2 endpoint
    credentials: {
        accessKeyId: env.s3.access_key_id!,
        secretAccessKey: env.s3.secret_access_key!,
    },
});

export async function uploadFile(file: formidable.File) {
    // Read file from temp path
    const buffer = await fs.readFile(file.filepath);

    const ext = (file.originalFilename || "file").split(".").pop();
    const key = `${crypto.randomUUID()}.${ext}`;

    await r2.send(
        new PutObjectCommand({
            Bucket: env.s3.bucket_name!,
            Key: key,
            Body: buffer, // ✅ use buffer from fs.readFile
            ContentType: file.mimetype || "application/octet-stream",
        })
    );

    return key;
}


/*
Cloudflare
 S3-compatible API - https://developers.cloudflare.com/r2/get-started/s3/
 Examples - https://developers.cloudflare.com/r2/examples/
*/
