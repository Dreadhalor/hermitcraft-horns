'use client';
import React, { useState } from 'react';
import { Card } from '@ui/card';
import { HornTile } from './horn-tile';
import { trpc } from '@/trpc/client';
import { useHHUser } from '@/providers/user-provider';
import { FaSliders } from 'react-icons/fa6';
import { Button } from '@ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@ui/drawer';
import { Hermit } from '@drizzle/db';
import { useApp } from '@/providers/app-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';

interface Props {
  id?: string;
}

export const HornsList = ({ id }: Props) => {
  const { user } = useHHUser();
  const { hermits } = useApp();
  const [selectedHermitId, setSelectedHermitId] = useState<string | null>(null);

  const [selectedSort, setSelectedSort] = useState<string>('newest');

  const { data: clips, isLoading } = trpc.getClips.useQuery({
    userId: user?.id ?? '',
    filterUserId: id,
    hermitId: selectedHermitId ?? undefined,
    sort: selectedSort,
  });

  const handleHermitSelect = (hermit: Hermit) => {
    setSelectedHermitId(hermit.ChannelID);
  };

  if (isLoading || !clips) {
    return <div>Loading...</div>;
  }

  return (
    <Card className='flex w-full flex-col gap-[10px] overflow-hidden rounded-lg border-none bg-[#4665BA] p-[20px] text-white'>
      <div className='flex items-center justify-between'>
        <Select value={selectedSort} onValueChange={setSelectedSort}>
          <SelectTrigger className='w-[160px]'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='most_liked'>Most Liked</SelectItem>
            <SelectItem value='most_downloaded'>Most Downloaded</SelectItem>
            <SelectItem value='newest'>Newest</SelectItem>
          </SelectContent>
        </Select>
        <Drawer nested>
          <DrawerTrigger asChild>
            <Button variant='ghost' className='text-white'>
              <FaSliders className='mr-2' />
              Filter
            </Button>
          </DrawerTrigger>
          <DrawerContent className='max-h-[90%] border-0 p-0'>
            <div className='h-full w-full overflow-auto pb-4'>
              <DrawerHeader>
                <DrawerTitle>Select Hermit</DrawerTitle>
                <DrawerDescription>
                  Choose a hermit to filter by
                </DrawerDescription>
              </DrawerHeader>
              <div className='grid grid-cols-3'>
                {hermits.map((hermit) => (
                  <DrawerClose asChild key={hermit.ChannelID}>
                    <Button
                      variant='ghost'
                      className='flex h-auto w-auto flex-col items-center rounded-md p-1'
                      onClick={() => handleHermitSelect(hermit)}
                    >
                      <span className='justify-center text-sm'>
                        {hermit.DisplayName}
                      </span>
                      <img
                        src={hermit.ProfilePicture}
                        alt={hermit.DisplayName}
                        className='aspect-square w-full'
                      />
                    </Button>
                  </DrawerClose>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className='grid w-full grid-cols-2 gap-[10px]'>
        {clips.map((clip: any) => (
          <HornTile key={clip.id} horn={clip} />
        ))}
      </div>
    </Card>
  );
};
