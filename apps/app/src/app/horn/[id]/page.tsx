'use client';

import { useParams, useRouter } from 'next/navigation';
import { HornTile } from '@/components/horn-tile/horn-tile';
import { trpc } from '@/trpc/client';
import { useHHUser } from '@/providers/user-provider';
import Image from 'next/image';
import Link from 'next/link';
import Banner from '@/assets/banner.png';
import { Button } from '@ui/button';
import { useRef } from 'react';
import { FaPlay, FaShuffle } from 'react-icons/fa6';

const HornPage = () => {
  const { id } = useParams();
  const { user } = useHHUser();
  const router = useRouter();
  const hornIdNum = id as string;
  const hornRef = useRef<any>();

  const { data: horn, isLoading } = trpc.getClip.useQuery({
    clipId: hornIdNum,
    userId: user?.id,
  });

  if (!isLoading && !horn) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        No horn here, sorry! Try&nbsp;
        <Link href='/home' className='underline'>
          going back
        </Link>
        .
      </div>
    );
  }

  if (isLoading || !horn) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        Loading horn...
      </div>
    );
  }

  return (
    <main className='flex flex-1 flex-col items-center gap-[20px] p-[20px]'>
      <Link href='/home' className='w-full'>
        <Image src={Banner} alt='banner' className='w-full' />
      </Link>
      <Link
        href='/about'
        className='my-[-10px] text-sm font-semibold text-[#354B87] hover:underline'
      >
        By Scott Hetrick &rarr;
      </Link>
      <div className='flex w-full max-w-[250px] flex-1 flex-col items-center justify-center gap-2'>
        <HornTile horn={horn} ref={hornRef} />
        <Button
          className='w-full gap-2'
          onClick={() => {
            hornRef.current?.togglePlayback();
          }}
        >
          <FaPlay />
          Play / Stop
        </Button>
        <Button
          className='-mt-1 w-full gap-2'
          onClick={() => {
            router.push(`/horn/random`);
          }}
        >
          <FaShuffle />
          Randomize Horn
        </Button>
        <Link href='/home' className='mt-2 hover:underline'>
          &larr; Back to home
        </Link>
      </div>
    </main>
  );
};

export default HornPage;
