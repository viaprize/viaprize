"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@viaprize/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@viaprize/ui/avatar";
import { Badge } from "@viaprize/ui/badge";
import { Card } from "@viaprize/ui/card";

const images = [
  "https://picsum.photos/500/300?random=1",
  "https://picsum.photos/500/300?random=2",
  "https://picsum.photos/500/300?random=3",
  "https://picsum.photos/500/300?random=4",
];

export default function DetailsHeader() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="p-3 w-full flex space-x-5">
      <div className="relative w-full  mx-auto">
        <Image
          src={
            images[currentIndex] ||
            "https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image"
          }
          width={500}
          height={500}
          className="rounded-md "
          alt={`Image ${currentIndex + 1}`}
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute left-[5px] top-1/2 transform -translate-y-1/2 rounded-full bg-white/70 hover:bg-white/90"
          onClick={prevImage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-[5px] top-1/2 transform -translate-y-1/2 rounded-full bg-white/70 hover:bg-white/90"
          onClick={nextImage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="w-full">
        <h1 className="text-3xl">
          Building a new Construction Site Construction Website All
        </h1>
            <h3 className="text-lg text-primary flex items-center mt-1">
              <Avatar className="mr-2">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              John Doe
            </h3>
            <Badge
              variant="secondary"
              className="mt-3 px-2 py-1 text-md text-primary"
            >
              Submission Open
            </Badge>

            <div className="text-3xl text-primary font-medium mt-5">$1000</div>
            <div className="text-xl">Total Raised</div>
         
      </div>
    </div>
  );
}
