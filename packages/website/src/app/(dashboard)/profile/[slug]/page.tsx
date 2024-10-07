import FetchProfile from './fetch-profile'

export default function Profile({ params }: { params: { slug: string } }) {
  return (
    <div className="w-full">
      <FetchProfile params={params} />
    </div>
  )
}
