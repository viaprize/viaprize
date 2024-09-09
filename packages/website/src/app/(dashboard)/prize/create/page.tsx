import { CreatePrizeForm } from "@/components/prize/create/create-prize-form";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";

export default async function ContestForm() {
  const command = new PutObjectCommand({
    Key: crypto.randomUUID(),
    Bucket: Resource.ImageUploads.name,
  });
  const imageUrl = await getSignedUrl(
    new S3Client({
      region: "us-east-2",
    }),
    command
  );

  return <CreatePrizeForm imageUploadUrl={imageUrl} />;
}
