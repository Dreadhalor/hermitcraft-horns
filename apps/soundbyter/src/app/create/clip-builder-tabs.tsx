'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useEffect } from 'react';
import { ClipBuilderPane } from './clip-builder/clip-builder-pane';
import { ClipMetadataBuilder } from './metadata-builder/clip-metadata-builder';
import { PreviewPane } from './preview-pane';
import { NextStepButton } from './next-step-button';
import { useClipBuilder } from '@/providers/clip-builder-provider';
import { Hermit } from '../../../drizzle/db';

interface Props {
  hermits: Hermit[];
}
export const ClipBuilderTabs = ({ hermits }: Props) => {
  const [activeTab, setActiveTab] = React.useState('clip-builder');
  const { setHermits } = useClipBuilder();

  useEffect(() => {
    setHermits(hermits);
  }, [hermits]);

  return (
    <Tabs
      className='flex max-h-full w-full flex-1 flex-col'
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsContent value='clip-builder' className='flex-1'>
        <ClipBuilderPane />
      </TabsContent>
      <TabsContent value='metadata' className='flex-1 overflow-auto'>
        <ClipMetadataBuilder />
      </TabsContent>
      <TabsContent value='preview' className='flex-1 overflow-auto'>
        <PreviewPane />
      </TabsContent>
      <div className='mx-4 flex gap-2'>
        <TabsList className='flex gap-2 bg-transparent'>
          <TabsTrigger
            value='clip-builder'
            className='aspect-square h-[20px] rounded-full bg-[#4665BA]/30 p-0 data-[state=active]:bg-[#354B87]'
          />
          <TabsTrigger
            value='metadata'
            className='aspect-square h-[20px] rounded-full bg-[#4665BA]/30 p-0 data-[state=active]:bg-[#354B87]'
          />
          <TabsTrigger
            value='preview'
            className='aspect-square h-[20px] rounded-full bg-[#4665BA]/30 p-0 data-[state=active]:bg-[#354B87]'
          />
        </TabsList>
        <NextStepButton activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </Tabs>
  );
};