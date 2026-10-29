import type { ImageMetadata } from 'astro';
import { withBase } from '../lib/paths';
import hero from '../assets/hero.png';
import capture from '../assets/capture.jpg';
import edit from '../assets/edit.webp';
import save from '../assets/save.jpg';

export type ImageAsset = {
  kind: 'image';
  image: ImageMetadata;
  alt: string;
};
export type VideoAsset = {
  kind: 'video';
  src: string;
  poster: string;
  alt: string;
};
export type MediaAsset = ImageAsset | VideoAsset;

/** Downloaded original product media; no remote request is needed at build or runtime. */
export const assets = {
  hero: {
    kind: 'image',
    image: hero,
    alt: '야간 테마파크에서 촬영한 순간과 짧은 동영상 메이커, 1초 카메라 샤디 소개',
  },
  capture: {
    kind: 'image',
    image: capture,
    alt: '샤디 카메라에서 셔터 한 번으로 카페의 순간을 짧게 촬영하는 화면',
  },
  edit: {
    kind: 'image',
    image: edit,
    alt: '여러 짧은 영상을 선택하고 순서대로 이어 붙이는 샤디 편집 화면',
  },
  save: {
    kind: 'image',
    image: save,
    alt: '식사와 산책, 여행지의 순간을 연결해 저장한 나만의 영상 이야기',
  },
} satisfies Record<'hero' | 'capture' | 'edit' | 'save', ImageAsset>;

/** Local H.264 conversion of the original animated cover. */
export const heroVideo = { src: withBase('/media/hero.mp4') } as const;
