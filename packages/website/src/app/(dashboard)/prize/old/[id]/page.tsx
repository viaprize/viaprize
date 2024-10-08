import FetchOldprizeDetails from "@/components/prize/oldprizes/fetch-oldprize-details";

export default function OldPage({ params }: { params: { id: number} }) {
  return (
    <div className="">
        <FetchOldprizeDetails params={params} />
    </div>
  );
}