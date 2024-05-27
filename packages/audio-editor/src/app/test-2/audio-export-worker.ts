// Declare global functions and types
declare const self: Worker;
declare function importScripts(...urls: string[]): void;

// Import the lamejs library
importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.0/lame.min.js'
);

// Ensure lamejs is declared
declare const lamejs: any;

self.onmessage = async function (event) {
  const { channels, sampleRate, buffers } = event.data;
  const mp3Blob = await exportAudio(channels, sampleRate, buffers);
  self.postMessage({ mp3Blob });
};

const exportAudio = async (
  channels: number,
  sampleRate: number,
  buffers: Float32Array[]
) => {
  const encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);
  const mp3Data: Int8Array[] = [];
  const chunkSize = 1152;

  // Scale audio data
  const leftBuffer = buffers[0];
  if (!leftBuffer) {
    throw new Error('Left buffer is undefined');
  }
  const leftScaled = new Int16Array(leftBuffer.length);
  for (let i = 0; i < leftBuffer.length; i++) {
    leftScaled[i] = leftBuffer[i]! * 32767.5;
  }

  let rightScaled: Int16Array;
  if (channels > 1) {
    const rightBuffer = buffers[1];
    if (!rightBuffer) {
      throw new Error('Right buffer is undefined');
    }
    rightScaled = new Int16Array(rightBuffer.length);
    for (let i = 0; i < rightBuffer.length; i++) {
      rightScaled[i] = rightBuffer[i]! * 32767.5;
    }
  } else {
    rightScaled = leftScaled;
  }

  for (let i = 0; i < leftScaled.length; i += chunkSize) {
    const leftChunk = leftScaled.subarray(i, i + chunkSize);
    const rightChunk =
      channels > 1 ? rightScaled.subarray(i, i + chunkSize) : leftChunk;
    const mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(new Int8Array(mp3buf));
    }
  }

  const mp3buf = encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(new Int8Array(mp3buf));
  }

  const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });
  return mp3Blob;
};
