import { IconPresentation } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@viaprize/ui/avatar";
import { Badge } from "@viaprize/ui/badge";
import { Button } from "@viaprize/ui/button";
import Image from "next/image";
import DonateCard from "./donate-card";

const image = "https://picsum.photos/500/300?random=2";

export default function DetailsHeader() {
  const projectName = "New Hope Construction Company kugdiugwqi diweiw ie";

  return (
    <div className="p-3 w-full lg:flex space-x-0 space-y-3 lg:space-y-0 lg:space-x-5">
      <Image
        src={
          image ||
          "https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image"
        }
        width={150}
        height={100}
        className="rounded-md w-full lg:w-auto"
        alt="Image"
      />

      <div className="w-full">
        <h1 className="text-2xl">{projectName}</h1>

        <h3 className="text-lg text-primary flex items-center mt-1">
          <Avatar className="mr-2">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          John Doe
        </h3>
        <div className="mt-2 flex items-center space-x-3">
          <Badge variant="secondary" className="text-sm text-primary ">
            Submission Open
          </Badge>
          <Button size="sm">
            <IconPresentation className="mr-2" size={20} />
            Submit your work
          </Button>
        </div>
      </div>

      <div className="w-full">
        <DonateCard projectName={projectName} />
      </div>
    </div>
  );
}
