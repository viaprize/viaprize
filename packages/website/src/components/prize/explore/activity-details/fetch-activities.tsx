import OverallPrizeStatus from '@/components/common/overall-prize-status';
import { Separator } from '@viaprize/ui/separator';
import React from 'react'
import RecentActivities from './recent-activities';

export default function FetchActivities() {
  return (
    <div className='space-y-3'>
    
          <OverallPrizeStatus />
           <RecentActivities />
    </div>
  );
}
