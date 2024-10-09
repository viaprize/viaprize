'use client'

import { api } from '@/trpc/react'
import { Button } from '@viaprize/ui/button'
import { Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const DeployPrizeButton = ({ prizeId }: { prizeId: string }) => {
  const router = useRouter()
  const mutation = api.prizes.deployPrize.useMutation()
  const handleDeploy = async () => {
    await mutation.mutateAsync({
      prizeId: prizeId,
    })
    router.refresh()
  }

  return (
    <Button
      className="w-full"
      onClick={handleDeploy}
      disabled={mutation.isPending}
    >
      <Rocket className="mr-2 h-4 w-4" /> Deploy
    </Button>
  )
}
