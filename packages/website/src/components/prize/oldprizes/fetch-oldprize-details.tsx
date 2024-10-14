import { Avatar } from '@viaprize/ui/avatar'
import { Badge } from '@viaprize/ui/badge'
import { Card } from '@viaprize/ui/card'
import Image from 'next/image'
import { FetchPrizesCsvId } from './fetch-details-byid'

export default async function FetchOldprizeDetails({
  params,
}: { params: { id: number } }) {
  const data = await FetchPrizesCsvId(params.id)
  return (
    <div className="p-3">
      <div className="w-full lg:flex space-x-0 space-y-3 lg:space-y-0 lg:space-x-5">
        <Image
          src={
            data?.Image ||
            'https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image'
          }
          quality={100}
          width={200}
          height={100}
          className="w-full lg:w-auto rounded-md object-cover aspect-video"
          alt="Image"
        />

        <div className="w-full">
          <h1 className="text-2xl">{data?.PrizeName}</h1>

          <div className="mt-2 flex items-center space-x-3">
            <Badge variant="secondary" className="text-md text-primary">
              {data?.WinnersAmount ? 'Won' : 'Refunded'}
            </Badge>
          </div>
        </div>

        <Card className="p-4 w-1/4 h-1/4">
          <div className="text-2xl text-primary font-medium">
            {data?.AwardedUSDe} USD
          </div>
          <div>Total Raised</div>
        </Card>
      </div>
      <div className="w-full mt-3">
        <div className="w-full lg:flex lg:items-center lg:justify-between  space-y-2 lg:space-y-0">
          <h1 className="text-lg text-primary">About this Prize</h1>
          <Badge
            variant="outline"
            className="text-muted-foreground mr-2 text-md"
          >
            {data?.Category}
          </Badge>
        </div>
        <p
          className="border p-2 mt-2 rounded-md"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: data?.Description || '' }}
        />
      </div>
      {data?.WinnersAmount && (
        <div className="mt-3">
          <h2 className="text-lg text-primary my-2">Winners</h2>
          <Card className="p-3">
            <div className="flex space-x-5">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>

              <div>
                <h3
                  className="text-primary"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{
                    __html: data?.WinnersAmount || '',
                  }}
                />
                <p>{data?.WorkLink}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
      {data?.Comment && (
        <>
          <div className="text-lg text-primary mt-3 mb-2">
            Comment by Winner
          </div>
          <Card
            className="p-3"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: data?.Comment || '' }}
          />
        </>
      )}
    </div>
  )
}
