import type { PrizeStages } from '@viaprize/core/lib/prizes'
import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Badge } from '@viaprize/ui/badge'
import { Button } from '@viaprize/ui/button'
import { Card } from '@viaprize/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@viaprize/ui/dialog'
import { AnimatePresence, motion } from 'framer-motion'
import VoteDialog from './vote-dialog'

interface User {
  id: string
  description: string
  name: string
  avatar: string
  submissionCreated: string
  prizeStage: PrizeStages
  contractAddress: string
  votes: number | string
  onVoteChange: (id: string, newVotes: number | string) => void
  isVoter?: boolean
  totalVotingAmount: number
  submissionHash: string
  projectLink: string | null
}

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      scale: { duration: 0.2 },
      y: { duration: 0.2 },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

export default function SubmissionVotingCard({
  id,
  description,
  name,
  avatar,
  totalVotingAmount,
  submissionCreated,
  votes,
  projectLink,
  prizeStage,
  onVoteChange,
  isVoter,
  contractAddress,
  submissionHash,
}: User) {
  const limitedDescription =
    description.length > 50 ? `${description.slice(0, 50)}...` : description

  return (
    <Card className="p-3 my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="mr-2">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>
              {name
                .split(' ')
                .map((word) => word[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-primary">{name}</h3>
            <div className="text-muted-foreground text-sm">
              {submissionCreated}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <p>{limitedDescription}</p>
                  {name !== 'Refund' && (
                    <Button variant="link" className="p-0 h-auto font-normal">
                      See more
                    </Button>
                  )}
                </div>
              </DialogTrigger>
              <AnimatePresence>
                <DialogContent>
                  <motion.div
                    variants={dialogVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="mr-2 mb-4">
                        <AvatarImage src={avatar} alt={name} />
                        <AvatarFallback>
                          {name
                            .split(' ')
                            .map((word) => word[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-primary text-xl font-semibold ">
                          {name}
                        </h3>
                        <div className="text-muted-foreground text-sm mb-4">
                          {submissionCreated}
                        </div>
                      </div>
                    </div>
                    <p className="break-all">{description}</p>
                    {projectLink && (
                      <p>
                        {' '}
                        <span className="text-primary">Project Link:</span>{' '}
                        {projectLink}
                      </p>
                    )}
                  </motion.div>
                </DialogContent>
              </AnimatePresence>
            </Dialog>
          </div>
        </div>
        <Badge className="text-sm">Current votes: ${votes}</Badge>

        {isVoter ? (
          <VoteDialog
            contractAddress={contractAddress}
            submissionHash={submissionHash}
            maxVotes={totalVotingAmount}
          />
        ) : null}
      </div>
    </Card>
  )
}
