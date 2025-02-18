import React from 'react'
import { type FileWithPath, useDropzone } from 'react-dropzone'
import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { type FileWithPreview, ProfileImageCropper } from './profile-image-cropper'
import { PencilIcon } from 'lucide-react'
import { Button } from '@viaprize/ui/button'
import { IconEdit } from '@tabler/icons-react'

const accept = {
    'image/*': [],
}

interface ProfileImageProps {
    onImageChange: (fileUrl: string) => void
    image: string | null
}

export default function ProfileImage({ onImageChange, image }: ProfileImageProps) {
    const [selectedFile, setSelectedFile] = React.useState<FileWithPreview | null>(null)
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
        [],
    )
   

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept,
    })

    return (
        <div className="relative">

            {selectedFile ? (
                <ProfileImageCropper
                    dialogOpen={isDialogOpen}
                    setDialogOpen={setDialogOpen}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    onChangeImageUrl={onImageChange}
                />
            ) : (
                
                <Avatar
                    {...getRootProps()}
                        className="relative cursor-pointer hover:opacity-90 transition-opacity h-24 w-24 rounded-full object-cover"
                >
                    <input {...getInputProps()} />
                    <AvatarImage
                        className=""
                        src={image || "https://github.com/shadcn.png"}
                        alt="Profile"
                    />
                    <AvatarFallback className="">PF</AvatarFallback>
                        <div className=" absolute bottom-0 right-0 p-1 rounded-full bg-white border shadow-md hover:bg-gray-100"> 
                        <IconEdit className=" " />
                       
                        </div>
                        {/* <Button
                            variant="outline"
                            size="icon"
                            className="cursor-pointer absolute bottom-0 right-0 p-1 rounded-full bg-white border shadow-md hover:bg-gray-100"
                        >
                            <PencilIcon className="h-4 w-4 text-gray-600" />
                            
                        </Button> */}
                   
                </Avatar>
                
                    
            )}
        </div>
    )
}