import { Type } from '../util/type';

/**
 * all application docker image tags
 */
export const DOCKER_IMAGE_TAGS = {
  [Type.JAVA]: 'anapsix/alpine-java:latest',
  [Type.NODE]: 'mhart/alpine-node:14',
};
