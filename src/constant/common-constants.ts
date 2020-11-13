import { Type } from '../util/type';

/**
 * all application docker image tags
 */
export const DOCKER_IMAGE_TAGS = {
  [Type.JAVA]: 'openjdk:14-jdk-alpine',
  [Type.NODE]: 'mhart/alpine-node:14',
};
