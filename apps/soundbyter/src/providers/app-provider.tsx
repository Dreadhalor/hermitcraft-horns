'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Channel } from '@/trpc/routers/hermitcraft';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

type AppContextType = {
  zoomStart: number;
  setZoomStart: (value: number) => void;
  zoomEnd: number;
  setZoomEnd: (value: number) => void;
  playTime: number;
  setPlayTime: (value: number) => void;
  playSliderValue: number;
  setPlaySliderValue: (value: number) => void;
  clipStart: number;
  setClipStart: (value: number) => void;
  clipEnd: number;
  setClipEnd: (value: number) => void;
  duration: number;
  setDuration: (value: number) => void;
  playerRef: React.MutableRefObject<ReactPlayer | null>;
  playing: boolean;
  setPlaying: (value: boolean) => void;
  currentlySeeking: boolean;
  setCurrentlySeeking: (value: boolean) => void;
  hermit: Channel | null;
  setHermit: (value: Channel | null) => void;
  tagline: string;
  setTagline: (value: string) => void;
  videoUrl: string;
  setVideoUrl: (value: string) => void;
};

const AppContext = React.createContext<AppContextType>({} as AppContextType);

export const useApp = () => {
  return React.useContext(AppContext);
};

type Props = {
  children: React.ReactNode;
};
export const AppProvider = ({ children }: Props) => {
  const [zoomStart, setZoomStart] = useState(0);
  const [zoomEnd, setZoomEnd] = useState(0);

  const [playTime, setPlayTime] = useState(0);
  const [playSliderValue, setPlaySliderValue] = useState(0);

  const [clipStart, setClipStart] = useState(0);
  const [clipEnd, setClipEnd] = useState(0);

  const [duration, setDuration] = useState(0);

  const playerRef = React.useRef<ReactPlayer | null>(null);
  const [playing, setPlaying] = useState(false);

  const [currentlySeeking, setCurrentlySeeking] = useState(false);

  const [hermit, setHermit] = useState<Channel | null>(null);
  const [tagline, setTagline] = useState('');

  const [videoUrl, setVideoUrl] = useState(
    'https://www.youtube.com/watch?v=IM-Z6hJb4E4',
  );

  useEffect(() => {
    const player = playerRef.current;
    if (player && playing) {
      const interval = setInterval(() => {
        setPlayTime(player.getCurrentTime());
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }
  }, [playerRef, setPlayTime, playing]);

  return (
    <AppContext.Provider
      value={{
        zoomStart,
        setZoomStart,
        zoomEnd,
        setZoomEnd,
        playTime,
        setPlayTime,
        playSliderValue,
        setPlaySliderValue,
        clipStart,
        setClipStart,
        clipEnd,
        setClipEnd,
        duration,
        setDuration,
        playerRef,
        playing,
        setPlaying,
        currentlySeeking,
        setCurrentlySeeking,
        hermit,
        setHermit,
        tagline,
        setTagline,
        videoUrl,
        setVideoUrl,
      }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </AppContext.Provider>
  );
};
