import { useState } from 'react'
import { Button } from '@viaprize/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@viaprize/ui/dialog'
import { Input } from '@viaprize/ui/input'
import { Label } from '@viaprize/ui/label'
import { IconEdit } from '@tabler/icons-react'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { Badge } from '@viaprize/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { getProfileImageUploadUrl } from '@/actions/profile-image'
import ProfileCropperUpload from './profile-image-picker'

interface EditProfileModalProps {
    initialData: {
        name: string
        skillSets: string[]
        bio?: string
        image: string
    }
    onSuccess: () => void
}

export function EditProfileModal({ initialData, onSuccess }: EditProfileModalProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(initialData.name)
    const [skillInput, setSkillInput] = useState('')
    const [skills, setSkills] = useState<string[]>(initialData.skillSets)
    const [bio, setBio] = useState(initialData.bio || '')
    const [imageUrl, setImageUrl] = useState(initialData.image)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageLocalUrl, setImageLocalUrl] = useState('')

    const updateProfile = api.users.updateProfile.useMutation({
        onSuccess: () => {
            toast.success('Profile updated successfully')
            setOpen(false)
            onSuccess()
            setIsSubmitting(false)
        },
        onError: (error) => {
            toast.error('Error updating profile', {
                description: error.message
            })
            setIsSubmitting(false)
        },
    })

    const handleAddSkill = () => {
        if (skillInput && !skills.includes(skillInput)) {
            setSkills([...skills, skillInput])
            setSkillInput('')
        }
    }

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            let finalImageUrl = imageUrl;

            if (imageLocalUrl) {
                const ImageToUpload = await convertBlobUrlToFile(imageLocalUrl, 'profile-image')
                const imageUploadUrl = await getProfileImageUploadUrl()

                const uploadResponse = await fetch(imageUploadUrl, {
                    method: 'PUT',
                    body: ImageToUpload,
                    headers: {
                        'Content-Type': ImageToUpload.type,
                        'Content-Disposition': `attachment; filename="${encodeURIComponent(ImageToUpload.name)}"`,
                        'Access-Control-Allow-Origin': '*',
                    },
                })

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image')
                }

                // Extract the base URL for the uploaded image
                const parsedUrl = new URL(imageUploadUrl)
                finalImageUrl = `${parsedUrl.origin}${parsedUrl.pathname}`
            }

            // Update profile with the correct image URL
            await updateProfile.mutateAsync({
                name,
                skillSets: skills,
                image: finalImageUrl,
                bio,
            })

            // Update local state after successful upload
            setImageUrl(finalImageUrl)
            setImageLocalUrl('')
        } catch (error) {
            console.error('Profile update error:', error)
            toast.error('Error updating profile')
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <IconEdit className="mr-2 h-4 w-4" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center pb-4">
                        <div className="">
                            {/* <Avatar className="h-24 w-24">
                                <AvatarImage src={imageLocalUrl || imageUrl} alt={name} />
                                <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                            </Avatar> */}
                            <div className="mt-2">
                                <ProfileCropperUpload
                                    onImageChange={(file) => {
                                        if (!file) return
                                        setImageLocalUrl(file)
                                    }}
                                    image={imageLocalUrl || imageUrl}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Rest of the form remains the same */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Write a short bio..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Skills</Label>
                        <div className="flex space-x-2">
                            <Input
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Add a skill"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddSkill()
                                    }
                                }}
                            />
                            <Button type="button" onClick={handleAddSkill}>
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skills.map((skill) => (
                                <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() => handleRemoveSkill(skill)}
                                >
                                    {skill}
                                    <IconEdit className="ml-1 h-3 w-3" />
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function convertBlobUrlToFile(
    blobUrl: string,
    fileName: string,
): Promise<File> {
    return fetch(blobUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.blob()
        })
        .then((blob) => {
            return new File([blob], fileName, { type: blob.type })
        })
        .catch((error) => {
            console.error('Error fetching the Blob:', error)
            throw error
        })
}