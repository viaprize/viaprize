'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Card, CardContent } from '@viaprize/ui/card'
import React, { useEffect } from 'react'
import { type FileWithPath, useDropzone } from 'react-dropzone'
import { type FileWithPreview, ImageCropper } from './image-cropper'

const accept = {
  'image/*': [],
}

interface ImageCropProps {
  onImageChange: (file: FileWithPreview | null) => void
  image: FileWithPath | null
}

export default function ImageCrop({ onImageChange, image }: ImageCropProps) {
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null)
  const [isDialogOpen, setDialogOpen] = React.useState(false)

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0]
      if (!file) {
        alert('Selected image is too large!')
        return
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })

      setSelectedFile(fileWithPreview)
      setDialogOpen(true)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  })

  useEffect(() => {
    if (!selectedFile) {
      return
    }
    onImageChange(selectedFile)
  }, [selectedFile, image])

  return (
    <div className="relative ">
      {selectedFile ? (
        <ImageCropper
          dialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      ) : (
        <Avatar
          {...getRootProps()}
          className=" cursor-pointer w-fit h-fit rounded-md ring-offset-2 ring-2 ring-slate-200"
        >
          <input {...getInputProps()} />
          <AvatarImage
            className="aspect-video  w-96 rounded-md object-cover"
            src="https://github.com/shadcn.png"
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
