import FetchPrize from './fetch-prize'

export default async function PrizeDetails({
  params,
}: { params: { slug: string } }) {
  return (

    <div className="w-full">
      <FetchPrize params={params} />

    </div>
  )
}
