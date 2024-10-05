'use client'

import React, { type SyntheticEvent } from 'react'

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop'

import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Button } from '@viaprize/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@viaprize/ui/dialog'

import 'react-image-crop/dist/ReactCrop.css'
import { CropIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
// import type { FileWithPath } from 'react-dropzone'
import { z } from 'zod'

export const FileWithPreviewSchema = z.instanceof(File).and(
  z.object({
    path: z.string().optional(),
    preview: z.string(),
  })
);

export type FileWithPreview = z.infer<typeof FileWithPreviewSchema>;

// export type FileWithPreview = FileWithPath & {
//   preview: string
// }

interface ImageCropperProps {
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedFile: FileWithPreview | null
  setSelectedFile: React.Dispatch<React.SetStateAction<FileWithPreview | null>>
}

const VIDEO_ASPECT_RATIO = 16 / 9

export function ImageCropper({
  dialogOpen,
  setDialogOpen,
  selectedFile,
  setSelectedFile,
}: ImageCropperProps) {
  const imgRef = React.useRef<HTMLImageElement | null>(null)

  const [crop, setCrop] = React.useState<Crop>()
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>('')
  const [croppedImage, setCroppedImage] = React.useState<string>('')

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, VIDEO_ASPECT_RATIO))
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop)
      setCroppedImageUrl(croppedImageUrl)
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY

    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.imageSmoothingEnabled = false

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      )
    }

    return canvas.toDataURL('image/png', 1.0)
  }

  async function onCrop() {
    try {
      setCroppedImage(croppedImageUrl)
      setDialogOpen(false)
    } catch (error) {
      alert('Something went wrong!')
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Avatar className="aspect-video h-fit w-fit rounded-md cursor-pointer ring-offset-2 ring-2 ring-slate-200">
          <AvatarImage
            className="aspect-video w-96 rounded-md object-cover"
            src={croppedImage ? croppedImage : selectedFile?.preview}
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0">
        <div className="p-6 size-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropComplete(c)}
            aspect={VIDEO_ASPECT_RATIO}
            className="w-full"
          >
            <Avatar className="size-fit rounded-none">
              <AvatarImage
                ref={imgRef}
                className="size-fit aspect-auto rounded-none"
                alt="Image Cropper Shell"
                src={selectedFile?.preview}
                onLoad={onImageLoad}
              />
              <AvatarFallback className="size-full min-h-[460px] rounded-none">
                Loading...
              </AvatarFallback>
            </Avatar>
          </ReactCrop>
        </div>
        <DialogFooter className="p-6 pt-0 justify-center ">
          <DialogClose asChild>
            <Button
              size={'sm'}
              type="reset"
              className="w-fit"
              variant={'outline'}
              onClick={() => {
                setSelectedFile(null)
              }}
            >
              <Trash2Icon className="mr-1.5 size-4" />
              Delete
            </Button>
          </DialogClose>
          <Button type="submit" size={'sm'} className="w-fit" onClick={onCrop}>
            <CropIcon className="mr-1.5 size-4" />
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to center the crop
export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}
