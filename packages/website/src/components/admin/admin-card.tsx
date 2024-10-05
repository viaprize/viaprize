import type { selectPrizeType } from '@viaprize/core/database/schema/prizes'
import { Badge } from '@viaprize/ui/badge'
import { Button } from '@viaprize/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@viaprize/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@viaprize/ui/dialog'
import { Separator } from '@viaprize/ui/separator'
import { addMinutes, format } from 'date-fns'
import {
  Award,
  CalendarDays,
  Clock,
  FileCode,
  MessageSquare,
  Send,
  User,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { DeployPrizeButton } from './deploy-prize-button'

// Dummy data (expanded to include all fields)
// const prizeProposal = {
//   id: "1234567890",
//   slug: "awesome-prize",
//   title: "Awesome Prize Challenge",
//   description:
//     "Participate in this exciting challenge to win amazing prizes! We are looking for innovative solutions that push the boundaries of technology and creativity. Join us in this journey to create something truly remarkable.",
//   imageUrl: "/placeholder.svg?height=200&width=356",
//   startSubmissionDate: new Date("2023-06-01T00:00:00Z"),
//   submissionDurationInMinutes: 7200, // 5 days
//   startVotingDate: new Date("2023-06-06T00:00:00Z"),
//   votingDurationInMinutes: 2880, // 2 days
//   primaryContractAddress: "0xabcd...ef12",
//   judgesAddresses: ["0x1111...2222", "0x3333...4444"],
//   skillSets: ["React", "Node.js", "GraphQL"],
//   priorities: ["Innovative", "Scalable", "User-friendly"],
//   authorFeePercentage: 5,
//   platformFeePercentage: 5,
//   contractVersion: 201,
//   funds: 1000000, // in cents
//   totalRefunded: 0,
//   totalVotes: 150,
//   stage: "NOT_STARTED",
//   proposalStage: "PENDING",
//   proposerAddress: "0x5678...9012",
//   createdAt: new Date("2023-05-15T00:00:00Z"),
//   updatedAt: new Date("2023-05-20T00:00:00Z"),
//   authorUsername: "prize_creator",
//   numberOfContestants: 50,
//   numberOfFunders: 10,
//   numberOfComments: 100,
//   numberOfSubmissions: 30,
// };

export default function AdminPrizeCard({
  prizeProposal,
}: {
  prizeProposal: selectPrizeType
}) {
  const submissionEndDate = addMinutes(
    prizeProposal.startSubmissionDate,
    prizeProposal.submissionDurationInMinutes,
  )
  const votingEndDate = addMinutes(
    prizeProposal.startVotingDate,
    prizeProposal.votingDurationInMinutes,
  )

  return (
    <Card className="w-full max-w-md flex mx-auto flex-col justify-between">
      <CardContent className="pt-6">
        <img
          src={
            prizeProposal.imageUrl ??
            'https://images.placeholders.dev/height=200&width=356'
          }
          alt={prizeProposal.title}
          className="w-full aspect-video object-cover rounded-lg"
        />
        <CardTitle className="mt-4">{prizeProposal.title}</CardTitle>
        <p className="text-sm text-gray-600 my-4">
          {prizeProposal.description.slice(0, 100)}...
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {prizeProposal?.skillSets?.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Created by: {prizeProposal.authorUsername}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>
              Submission:{' '}
              {format(prizeProposal.startSubmissionDate, 'PPP hh:mm a')} -{' '}
              {format(submissionEndDate, 'PPP hh:mm a')}
            </span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>
              Voting: {format(prizeProposal.startVotingDate, 'PPP hh:mm a')} -{' '}
              {format(votingEndDate, 'PPP hh:mm a')}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{prizeProposal.title} Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[80vh] overflow-y-auto">
              <img
                src={
                  prizeProposal.imageUrl ??
                  'https://images.placeholders.dev/height=200&width=356'
                }
                alt={prizeProposal.title}
                className="w-full aspect-video object-cover rounded-lg"
              />

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                {/* <p>{prizeProposal.description}</p> */}
                <textarea
                  value={prizeProposal.description}
                  disabled
                  className="w-full h-[400px]"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    General Information
                  </h3>
                  <p>
                    <strong>ID:</strong> {prizeProposal.id}
                  </p>
                  <p>
                    <strong>Slug:</strong> {prizeProposal.slug}
                  </p>
                  <p>
                    <strong>Stage:</strong> {prizeProposal.stage}
                  </p>
                  <p>
                    <strong>Proposal Stage:</strong>{' '}
                    {prizeProposal.proposalStage}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Dates</h3>
                  <p>
                    <strong>Created:</strong>{' '}
                    {format(
                      prizeProposal.createdAt ?? new Date(),
                      'PPP hh:mm a',
                    )}
                  </p>
                  <p>
                    <strong>Updated:</strong>{' '}
                    {format(
                      prizeProposal.updatedAt ?? new Date(),
                      'PPP hh:mm a',
                    )}
                  </p>
                  <p>
                    <strong>Submission Start:</strong>{' '}
                    {format(prizeProposal.startSubmissionDate, 'PPP hh:mm a')}
                  </p>
                  <p>
                    <strong>Submission End:</strong>{' '}
                    {format(submissionEndDate, 'PPP hh:mm a')}
                  </p>
                  <p>
                    <strong>Voting Start:</strong>{' '}
                    {format(prizeProposal.startVotingDate, 'PPP hh:mm a')}
                  </p>
                  <p>
                    <strong>Voting End:</strong>{' '}
                    {format(votingEndDate, 'PPP hh:mm a')}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Contract Information
                </h3>
                <p>
                  <strong>Primary Contract Address:</strong>{' '}
                  {prizeProposal.primaryContractAddress}
                </p>
                <p>
                  <strong>Proposer Address:</strong>{' '}
                  {prizeProposal.proposerAddress}
                </p>
                <p>
                  <strong>Contract Version:</strong>{' '}
                  {prizeProposal.contractVersion}
                </p>
                <p>
                  <strong>Author Fee Percentage:</strong>{' '}
                  {prizeProposal.authorFeePercentage}%
                </p>
                <p>
                  <strong>Platform Fee Percentage:</strong>{' '}
                  {prizeProposal.platformFeePercentage}%
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Financial Information
                </h3>
                <p>
                  <strong>Total Funds:</strong> $
                  {(prizeProposal.funds / 100).toFixed(2)}
                </p>
                <p>
                  <strong>Total Refunded:</strong> $
                  {(prizeProposal.totalRefunded / 100).toFixed(2)}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Participation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>
                      Contestants: {prizeProposal.numberOfContestants}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Award className="mr-2 h-4 w-4" />
                    <span>Funders: {prizeProposal.numberOfFunders}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Comments: {prizeProposal.numberOfComments}</span>
                  </div>
                  <div className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    <span>
                      Submissions: {prizeProposal.numberOfSubmissions}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Skills and Priorities
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {prizeProposal.skillSets?.map((skill, index) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p>
                  <strong>Priorities:</strong>{' '}
                  {prizeProposal.priorities?.join(', ')}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Judges</h3>
                <ul className="list-disc list-inside">
                  {prizeProposal.judgesAddresses?.map((address, index) => (
                    <li key={address}>{address}</li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <DeployPrizeButton prizeId={prizeProposal.id} />
      </CardFooter>
    </Card>
  )
}
