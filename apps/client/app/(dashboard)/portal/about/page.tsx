import { Card } from '@mantine/core';
import PortalAboutHero from './hero';

export default function PortalAbout() {
  return (
    <div className="m-10">
      <PortalAboutHero />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Card withBorder shadow="md" radius="md">
          <h1>GoFundMe style (pass-through)</h1>
          <p>
            If the author chooses to immediately forward contributions to the recipient,
            then it functions just like GoFundMe. There is a 5% platform fee. It is not
            required, but the author may choose to add a funding goal and a deadline for
            when the campaign will automatically end. In this style, the funding goal and
            the deadline are editable. The campaign only ends if the author ends it
            manually.
          </p>
        </Card>
        <Card withBorder shadow="md" radius="md">
          <h1>Kickstarter style (all-or-nothing)</h1>
          <p>
            If the author chooses to send all the contributions at once, they must choose
            a deadline and a goal. This is similar to campaigns on Kickstarter. The author
            must also choose whether to disburse funds as soon as the funding goal is met
            or to allow contributions above the goal that are all disbursed at the
            deadline minus a 5% platform fee. If the funding goal is not met by the
            deadline, then all the contributions are automatically refunded and there are
            no fees. In this style, the funding goal and deadline are immutable. The
            author may cancel the campaign and refund everyone. Otherwise the campaign
            ends automatically either when the goal is met or the deadline is reached.
          </p>
        </Card>
      </div>
    </div>
  );
}
