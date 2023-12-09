import { Card, Image, Text, Title } from '@mantine/core';

export default function ImageTitleHero() {
  return (
    <Card
      shadow="md"
      withBorder
      radius="md"
      className="relative max-h-fit rounded-lg h-full p-0"
    >
      <Image
        src="https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image"
        alt="No Image"
        className="h-full object-cover"
        width="780"
        height="768"
      />
      <div
        style={{
          position: 'absolute',
          left: '2rem',
          bottom: '1rem',
        }}
        className="text-white flex flex-col gap-2 z-10"
      >
        <Title className="sm:text-1xl md:4xl lg:text-6xl">Title</Title>
        <Text className="sm:text-80px  md:text-2xl lg:text-3xl">Foundation Name</Text>
      </div>
      <div
        className="rounded-lg"
        style={{
          position: 'absolute',
          left: '0',
          bottom: '0px',
          width: '100%',
          height: '50%',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </Card>
  );
}
