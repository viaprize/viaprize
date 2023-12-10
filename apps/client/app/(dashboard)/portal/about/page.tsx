import { Card } from '@mantine/core';
import PortalAboutHero from './hero';

export default function PortalAbout() {
  return (
    <div className="my-10">
      <PortalAboutHero />
      <div className="grid grid-cols-2 gap-2">
        <Card withBorder shadow="md" radius="md">
          <h1>GoFundMe style (pass-through campaigns)</h1>
          <p>
            If the author chooses to immediately forward contributions to the recipient,
            then it functions just like GoFundMe. It is not required, but the author may
            choose to add a funding goal and a deadline for when the campaign will
            automatically end. In this style, the funding goal and the deadline are
            editable. The campaign only ends if the author ends it manually.
          </p>
        </Card>
        <Card withBorder shadow="md" radius="md">
          <h1>GoFundMe style (pass-through campaigns)</h1>
          <p>
            If the author chooses to immediately forward contributions to the recipient,
            then it functions just like GoFundMe. It is not required, but the author may
            choose to add a funding goal and a deadline for when the campaign will
            automatically end. In this style, the funding goal and the deadline are
            editable. The campaign only ends if the author ends it manually.
          </p>
        </Card>
      </div>
    </div>
  );
}
