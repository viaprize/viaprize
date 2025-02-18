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
import { CropIcon, Trash2Icon } from 'lucide-react'
import 'react-image-crop/dist/ReactCrop.css'
import { z } from 'zod'

export const FileWithPreviewSchema = z.instanceof(File).and(
    z.object({
        path: z.string().optional(),
        preview: z.string(),
    }),
)

export type FileWithPreview = z.infer<typeof FileWithPreviewSchema>

interface ProfileImageCropperProps {
    dialogOpen: boolean
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedFile: FileWithPreview | null
    setSelectedFile: React.Dispatch<React.SetStateAction<FileWithPreview | null>>
    onChangeImageUrl: (imageUrl: string) => void
}

export function ProfileImageCropper({
    dialogOpen,
    setDialogOpen,
    selectedFile,
    setSelectedFile,
    onChangeImageUrl,
}: ProfileImageCropperProps) {
    const imgRef = React.useRef<HTMLImageElement | null>(null)
    const [crop, setCrop] = React.useState<Crop>()
    const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>('')
    const [croppedImage, setCroppedImage] = React.useState<string>('')

    function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget
        setCrop(centerAspectCrop(width, height, 1)) // 1:1 aspect ratio for circular crop
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
        const size = Math.min(crop.width * scaleX, crop.height * scaleY)

        canvas.width = size
        canvas.height = size

        const ctx = canvas.getContext('2d')

        if (ctx) {
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            // Create circular clip path
            ctx.beginPath()
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
            ctx.clip()

            const offsetX = (crop.width * scaleX - size) / 2
            const offsetY = (crop.height * scaleY - size) / 2

            ctx.drawImage(
                image,
                crop.x * scaleX - offsetX,
                crop.y * scaleY - offsetY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                size,
                size
            )
        }

        return canvas.toDataURL('image/png', 1.0)
    }

    async function onCrop() {
        try {
            setCroppedImage(croppedImageUrl)
            onChangeImageUrl(croppedImageUrl)
            setDialogOpen(false)
        } catch (error) {
            alert('Something went wrong!')
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
                <Avatar className="h-24 w-24 cursor-pointer hover:opacity-90 transition-opacity">
                    <AvatarImage
                        className=" rounded-full object-cover"
                        src={croppedImage ? croppedImage : selectedFile?.preview}
                        alt="Profile"
                    />
                    <AvatarFallback className="">PF</AvatarFallback>
                </Avatar>
            </DialogTrigger>
            <DialogContent className="p-0 gap-0">
                <div className="p-6 size-full">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => onCropComplete(c)}
                        aspect={1}
                        circularCrop
                        className="w-full"
                    >
                        <Avatar className="size-fit rounded-none">
                            <AvatarImage
                                ref={imgRef}
                                className="size-fit  aspect-auto rounded-none"
                                alt="Profile Image Cropper"
                                src={selectedFile?.preview}
                                onLoad={onImageLoad}
                            />
                            <AvatarFallback className="size-full min-h-[460px] rounded-none">
                                Loading...
                            </AvatarFallback>
                        </Avatar>
                    </ReactCrop>
                </div>
                <DialogFooter className="p-6 pt-0 justify-center">
                    <DialogClose asChild>
                        <Button
                            size="sm"
                            type="reset"
                            className="w-fit"
                            variant="outline"
                            onClick={() => {
                                setSelectedFile(null)
                            }}
                        >
                            <Trash2Icon className="mr-1.5 size-4" />
                            Delete
                        </Button>
                    </DialogClose>
                    <Button type="submit" size="sm" className="w-fit" onClick={onCrop}>
                        <CropIcon className="mr-1.5 size-4" />
                        Crop
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

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