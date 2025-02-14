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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Implement your image upload logic here
            // This is just a placeholder - you'll need to implement actual image upload
            const formData = new FormData()
            formData.append('file', file)
            // const response = await uploadImage(formData)
            // setImageUrl(response.url)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        updateProfile.mutate({
            name,
            skillSets: skills,
            image: imageUrl,
            bio,
        })
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
                    {/* <div className="flex justify-center pb-4">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={imageUrl} />
                                <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Label
                                htmlFor="image-upload"
                                className="absolute bottom-0 right-0 rounded-full bg-primary p-2 cursor-pointer"
                            >
                                <IconEdit className="h-4 w-4 text-white" />
                            </Label>
                            <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div> */}

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