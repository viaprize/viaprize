'use client';
import Link from 'next/link';
import { BiLogoLinkedin } from 'react-icons/bi';
import { BsTwitter } from 'react-icons/bs';
import { ImTelegram } from 'react-icons/im';
import Image from 'next/image';
import SubscriptionForm from '../newsletter/subscriptionForm';

export default function Footer() {
  return (
    <footer className="text-white w-full bg-slate-950">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center mb-4 sm:mb-0">
            <Image
              src="/viaprizeBg.png"
              className="h-8 mr-3"
              alt="viaPrize Logo"
              width={32}
              height={32}
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              viaPrize
            </span>
          </Link>
          <div className="lg:w-1/3 ">
            <div className="flex justify-center w-full text-black my-2">
              <SubscriptionForm />
            </div>
            {/* <ul className="flex flex-wrap items-center mb-6 text-md font-bold text-gray-500  sm:mb-0 dark:text-gray-400">
              <li>
                <Link href="#" className="mr-4 hover:underline md:mr-6 ">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="mr-4 hover:underline md:mr-6">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="mr-4 hover:underline md:mr-6 ">
                  Licensing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Support
                </Link>
              </li>
            </ul> */}
          </div>
        </div>
        <div className="my-4 lg:flex lg:justify-between">
          <div className="lg:flex">
            <Link href="https://twitter.com/viaPrize">
              <BsTwitter className="inline-block mr-4 text-2xl text-blue-400 " />
            </Link>
            <Link href="https://www.linkedin.com/company/viaPrize/">
              <BiLogoLinkedin className="inline-block mr-4 text-2xl text-white " />
            </Link>
            <Link href="https://t.me/viaPrize">
              <ImTelegram className="inline-block mr-4 text-2xl text-blue-400 bg-white rounded-full" />
            </Link>
          </div>
          <ul className="flex flex-wrap items-center mb-6 text-md font-bold text-gray-500  sm:mb-0 dark:text-gray-400">
            <li>
              <Link href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="mr-4 hover:underline md:mr-6 ">
                Licensing
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Support
              </Link>
            </li>
          </ul>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{' '}
          <a href="/" className="hover:underline">
            ViaPrize™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
