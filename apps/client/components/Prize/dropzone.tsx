import {
  Button,
  Group,
  Text,
  rem,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import type { DropzoneProps, FileWithPath } from '@mantine/dropzone';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import Image from 'next/image';

interface ImageComponentProps extends Partial<DropzoneProps> {
  files: FileWithPath[];
  setFiles: (files: FileWithPath[]) => void;
}

export default function ImageComponent(props: ImageComponentProps) {
  const computedColorScheme = useComputedColorScheme('light');
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
          onReject={(files) => { console.log('rejected files', files) }}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          {...props}
        >
          <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-blue-6)',
                }}
                stroke={1.5}
                color={theme.colors.blue[computedColorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-red-6)',
                }}
                stroke={1.5}
                color={theme.colors.red[computedColorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-dimmed)',
                }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed 5mb
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
