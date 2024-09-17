interface UserPrizeStatusProps {
  userPrizeStatus: { value: number; label: string; icon?: React.ReactNode }[]
}

export default function UserPrizeStatus({
  userPrizeStatus,
}: UserPrizeStatusProps) {
  return (
    <div className="flex items-center space-x-3 divide-x-2 rounded-lg w-full">
      {userPrizeStatus.map((status) => (
        <div key={status.label} className="flex items-center space-x-2 ">
          {status.icon}
          <div>
            {status.value}
            <div className="text-sm text-muted-foreground">{status.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
