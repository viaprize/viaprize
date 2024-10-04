import CreatePrizeForm from '@/components/prize/create/create-prize-form'
import { auth } from '@/server/auth'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { redirect } from 'next/navigation'
import { Resource } from 'sst'

export default async function ContestForm() {
  const session = await auth()
  console.log({ session })
  if (!session) {
    return redirect('/login')
  }
  const command = new PutObjectCommand({
    Key: crypto.randomUUID(),

    Bucket: Resource.ImageUploads.name,
  })
  const imageUrl = await getSignedUrl(
    new S3Client({
      region: 'us-east-2',
    }),
    command,
  )

  return (
    <section className="container gird place-content-center w-full h-full">
      <CreatePrizeForm imageUploadUrl={imageUrl} />
    </section>
  )
}
