import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@ui/sheet';
import { Button, buttonVariants } from '@ui/button';
import { FaHeart, FaRegHeart, FaEdit, FaRegCopy } from 'react-icons/fa';
import { MdFileDownload } from 'react-icons/md';
import { useHHUser } from '@/providers/user-provider';
import { Tabs, TabsContent } from '@ui/tabs';
import { HornEditMenu } from './horn-edit-menu';
import { cn, kebabIt } from '@/lib/utils';
import { Separator } from '@ui/separator';
import Link from 'next/link';
import { Horn } from '@/trpc';
import { BsThreeDotsVertical } from 'react-icons/bs';
import GoatHornSVG from '@/assets/goat-horn-icon.svg';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

type Props = {
  horn: Horn;
  disabled?: boolean;
};

export const HornTileMenu = ({ horn, disabled }: Props) => {
  const [tab, setTab] = React.useState('main');
  const { liked, likes, downloads, user: hornUser, id } = horn!;
  const clipUrl = horn!.clipUrl ?? '';
  const tagline = horn!.tagline ?? '';

  const { user, likeClip, unlikeClip, incrementClipDownloads } = useHHUser();
  const pathname = usePathname();
  const isOwner = user?.id === hornUser?.id;

  const toggleLike = () => {
    if (liked) {
      unlikeClip(user?.id ?? '', id);
    } else {
      likeClip(user?.id ?? '', id);
    }
  };

  const handleDownload = () => {
    incrementClipDownloads(id);
    fetch(clipUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${kebabIt(tagline)}.mp3`;
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error downloading the file:', error);
      });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/horn/${id}`);
    toast.success('Link copied to clipboard!');
  };

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) setTab('main');
      }}
    >
      <SheetTrigger asChild>
        <Button
          disabled={disabled}
          id='clip-builder-hermit'
          className='pointer-events-auto -mx-1 -my-0.5 grid h-auto w-auto grid-cols-[1fr_auto_auto] items-center justify-items-end bg-transparent px-1 py-0.5 text-[10px] shadow-none hover:bg-primary/80 disabled:opacity-100'
        >
          <span>{likes ?? '53'}</span>
          {liked ? <FaHeart /> : <FaRegHeart />}
          <BsThreeDotsVertical
            size={24}
            className='row-span-2 ml-[-5px] mr-[-8px] p-0'
          />
          <span>{downloads ?? 101}</span>
          <MdFileDownload className='-mr-0.5' size={14} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className='max-h-[90%] overflow-hidden rounded-t-lg border-0 p-0'
        side='bottom'
      >
        <Tabs value={tab} onValueChange={setTab}>
          <TabsContent value='main' className='data-[state=active]:pt-[10px]'>
            <SheetHeader className='mb-2 px-4 text-start text-sm uppercase text-gray-600'>
              Horn Actions
            </SheetHeader>
            <Separator className='mx-4 w-auto bg-gray-600' />
            <div className='grid grid-cols-[auto_1fr]'>
              {(!pathname.startsWith('/horn') ||
                pathname.startsWith('/horn/random')) && (
                <SheetClose asChild>
                  <Link
                    href={`/horn/${id}`}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      'text-md group col-span-2 grid h-[60px] w-full grid-cols-subgrid items-center justify-start gap-3 rounded-none hover:bg-[#4665BA] hover:text-white',
                    )}
                  >
                    <GoatHornSVG className='h-5 w-5 transition-colors group-hover:fill-white' />
                    <span>Go to horn</span>
                  </Link>
                </SheetClose>
              )}
              <SheetClose asChild>
                <Button
                  variant='ghost'
                  className='text-md col-span-2 grid h-[60px] w-full grid-cols-subgrid items-center justify-start gap-3 rounded-none text-start hover:bg-[#4665BA] hover:text-white'
                  onClick={copyLink}
                >
                  <FaRegCopy size={18} />
                  <span>Copy link</span>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  disabled={!user}
                  variant='ghost'
                  className='text-md col-span-2 grid h-[60px] w-full grid-cols-subgrid items-center justify-start gap-3 rounded-none text-start hover:bg-[#4665BA] hover:text-white'
                  onClick={toggleLike}
                >
                  {user ? (
                    liked ? (
                      <>
                        <FaHeart />
                        <span>Unfavorite</span>
                      </>
                    ) : (
                      <>
                        <FaRegHeart />
                        <span>Favorite</span>
                      </>
                    )
                  ) : (
                    <>
                      <FaRegHeart />
                      <span>Sign in to favorite horns!</span>
                    </>
                  )}
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant='ghost'
                  className='text-md col-span-2 grid h-[60px] w-full grid-cols-subgrid items-center justify-start gap-3 rounded-none text-start hover:bg-[#4665BA] hover:text-white'
                  onClick={handleDownload}
                >
                  <MdFileDownload size={22} className='ml-[-2px]' />
                  <span>Download</span>
                </Button>
              </SheetClose>
              {isOwner && (
                <Button
                  variant='ghost'
                  className='text-md col-span-2 grid h-[60px] w-full grid-cols-subgrid items-center justify-start gap-3 rounded-none text-start hover:bg-[#4665BA] hover:text-white'
                  onClick={() => setTab('edit')}
                >
                  <FaEdit size={16} className='ml-0.5 mr-1' />
                  <span>Edit</span>
                </Button>
              )}
            </div>
            <div className='flex p-2 pt-1'>
              <SheetClose asChild>
                <Button
                  variant='outline'
                  className='h-[36px] flex-1 gap-2 rounded-full border-gray-600 text-sm hover:bg-[#4665BA] hover:text-white'
                >
                  Close
                </Button>
              </SheetClose>
            </div>
          </TabsContent>
          <TabsContent value='edit' className='data-[state=active]:pt-[10px]'>
            <SheetHeader className='mb-2 px-4 text-start text-sm uppercase text-gray-600'>
              Edit Horn
            </SheetHeader>
            <Separator className='mx-4 w-auto bg-gray-600' />
            <HornEditMenu horn={horn} />
            <div className='flex p-2 pt-1'>
              <Button
                variant='outline'
                className='h-[36px] flex-1 gap-2 rounded-full border-gray-600 text-sm hover:bg-[#4665BA] hover:text-white'
                onClick={() => setTab('main')}
              >
                &larr; Back
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
