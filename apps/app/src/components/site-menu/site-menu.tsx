'use client';

import React from 'react';
import { Button } from '@ui/button';
import { IoMenu } from 'react-icons/io5';
import { Sheet, SheetContent, SheetTrigger } from '@ui/sheet';
import { MenuContent } from './menu-content';

interface Props {
  imageRef: React.RefObject<HTMLImageElement>;
}
export const SiteMenu = ({ imageRef }: Props) => {
  return (
    <div className='sticky right-0 top-0 z-10 flex h-min w-full flex-col'>
      {/* spacer */}
      <div className='aspect-[7] w-full' />
      <Sheet>
        <SheetTrigger asChild>
          <Button className='pointer-events-auto z-10 ml-auto h-10 w-10 rounded-full bg-[#3554A9] p-0 shadow-md hover:bg-[#354B87]'>
            <IoMenu />
          </Button>
        </SheetTrigger>
        <SheetContent side='right' className='border-0 p-0'>
          <MenuContent />
        </SheetContent>
      </Sheet>
    </div>
  );
};
