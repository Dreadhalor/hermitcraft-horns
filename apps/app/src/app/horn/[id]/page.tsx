'use client';

import { useParams } from 'next/navigation';
import { HornTile } from '@/components/horn-tile/horn-tile';
import { trpc } from '@/trpc/client';
import { useHHUser } from '@/providers/user-provider';
import Image from 'next/image';
import Link from 'next/link';
import Banner from '@/assets/banner.png';

const HornPage = () => {
  const { id } = useParams();
  const { user } = useHHUser();
  const hornIdNum = parseInt(id as string);

  const { data: horn, isLoading } = trpc.getClip.useQuery({
    clipId: hornIdNum,
  });

  if (isLoading || !horn || !user) {
    return <div>Loading...</div>;
  }

  return (
    <main className='flex flex-1 flex-col items-center gap-[20px] p-[20px]'>
      <Image src={Banner} alt='banner' className='w-full' />
      <Link
        href='/about'
        className='my-[-10px] text-sm font-semibold text-[#354B87] hover:underline'
      >
        By Scott Hetrick &rarr;
      </Link>
      <div className='flex w-full flex-1 items-center justify-center'>
        <HornTile horn={horn} className='max-w-[250px]' />
      </div>
    </main>
  );
};

export default HornPage;
