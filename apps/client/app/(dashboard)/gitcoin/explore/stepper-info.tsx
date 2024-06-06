'use client';
import { Stepper, Text } from '@mantine/core';
import {
  IconCreditCardFilled,
  IconDna,
  IconShoppingCartFilled,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function StepperInfo() {
  return (
    <div>
      <Text size="lg" fw="bold" ml="md" my="md">
        Follow the steps below to donate
      </Text>

      <Stepper className="mx-2 mb-3"  active={-1} >
        <Stepper.Step
          icon={<IconShoppingCartFilled />}
          label="Add to cart"
          description={
            <div>
              Add all the campaigns you'd <br /> ike to donate to in the cart.
            </div>
          }
        />
        <Stepper.Step
          icon={<IconDna />}
          label="Allocate Donation Money"
          description={
            <div>
              Choose how much you would like
              <br /> to donate to each campaign
            </div>
          }
        />
        <Stepper.Step
          icon={<IconCreditCardFilled />}
          label="Credit Card Payment"
          description={
            <div>
              Use your credit card <br /> to donate to the campaigns
            </div>
          }
        />

        <Stepper.Step
          icon={<IconCreditCardFilled />}
          label="Matching Funds"
          description={
            <div>
              To learn more about <br />
              the matching funds
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.wtfisqf.com/"
                className="text-blue-400 underline"
              >
                {' '}
                see here
              </Link>
            </div>
          }
        />
      </Stepper>
    </div>
  );
}
