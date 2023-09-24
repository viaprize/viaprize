import { Button, Group, Text, rem, useMantineTheme } from "@mantine/core";
import type {
  DropzoneProps,
  FileWithPath
} from "@mantine/dropzone";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import Image from "next/image";

interface ImageComponentProps extends Partial<DropzoneProps> {
  files: FileWithPath[];
  setFiles: (files: FileWithPath[]) => void;
}

export default function ImageComponent(props: ImageComponentProps) {
  const previews = props.files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        className="aspect-video object-cover max-h-[400px]"
        key={index}
        src={imageUrl}
        width="1280"
        height="768"
        alt="image"
      // imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  const theme = useMantineTheme();
  return (
    <div className="overflow-hidden">
      {props.files.length === 0 ? (
        <Dropzone
          onDrop={props.setFiles}
          onReject={(files) => { console.log("rejected files", files); }}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          maxFiles={1}
          {...props}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: rem(220), pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload
                size="3.2rem"
                stroke={1.5}
                color={
                  theme.colors[theme.primaryColor][
                  theme.colorScheme === "dark" ? 4 : 6
                  ]
                }
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size="3.2rem"
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size="3.2rem" stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed
                5mb
              </Text>
            </div>
          </Group>
        </Dropzone>
      ) : (
        <div className="aspect-video">
          {previews}
          <Button
            fullWidth
            onClick={() => {
              props.setFiles([]);
            }}
            my="md"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
