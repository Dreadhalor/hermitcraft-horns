'use client';
import { Horn } from './horns-list';
import JoeHills from '@/assets/hermits/joehills.jpeg';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { FaRegHeart } from 'react-icons/fa';
import { MdFileDownload } from 'react-icons/md';
import { DrizzleClip } from '@/../drizzle/db';
import Image from 'next/image';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';

type HornTileProps = {
  horn: DrizzleClip & Horn;
  className?: string;
  onClick?: () => void;
};

export const HornTile = ({ horn, className, onClick }: HornTileProps) => {
  const { tagline, clipUrl, season, profilePic = '', user, hermit } = horn;
  const { username } = user ?? {};
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const _profilePic = profilePic || hermit?.ProfilePicture || JoeHills.src;

  const handlePlayClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [clipUrl]);

  return (
    <div
      className={cn(
        'relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg bg-[#354B87] text-[12px] text-white',
        className,
      )}
    >
      {clipUrl && <audio ref={audioRef} src={clipUrl} />}
      <div
        className='absolute inset-0 flex items-center justify-center p-[4px] brightness-[60%]'
        onClick={onClick ? onClick : handlePlayClick}
      >
        <div className='relative h-full w-full overflow-hidden rounded-md'>
          <Image src={_profilePic} alt='profile pic' fill />
        </div>
      </div>
      <div className='pointer-events-none absolute inset-0 p-[8px]'>
        <div className='flex h-full w-full flex-col p-[4px]'>
          <div className='flex justify-between'>
            <span className='text-[10px]'>{username ?? 'no user'}</span>

            <Drawer nested>
              <DrawerTrigger asChild>
                <Button
                  id='clip-builder-hermit'
                  className='pointer-events-auto -mx-1 -my-0.5 grid h-auto w-auto grid-cols-2 items-center justify-items-end bg-transparent px-1 py-0.5 text-[[[[12px]]]] shadow-none hover:bg-primary/80'
                >
                  <span>53</span>
                  <FaRegHeart />
                  <span>101</span>
                  <MdFileDownload className='-mr-0.5' size={16} />
                </Button>
              </DrawerTrigger>
              <DrawerContent className='max-h-[90%] border-0 p-0'>
                <DrawerClose asChild>
                  <Button
                    variant='ghost'
                    className='text-md h-[60px] w-full gap-2 rounded-none hover:bg-[#4665BA] hover:text-white'
                  >
                    <FaRegHeart /> Favorite
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    variant='ghost'
                    className='text-md h-[60px] w-full gap-2 rounded-none hover:bg-[#4665BA] hover:text-white'
                  >
                    <MdFileDownload size={22} /> Download
                  </Button>
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          </div>
          <span className='my-auto text-center font-bold'>{tagline}</span>
          <div className='flex justify-center'>
            {season && <span className='mr-auto text-center'>S{season}</span>}
            <span className='text-center'>View clip &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
};