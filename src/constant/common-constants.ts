import { Type } from '../util/type';

/**
 * all application docker image tags
 */
export const DOCKER_IMAGE_TAGS = {
  [Type.JAVA]: 'openjdk:14-jdk-alpine',
  [Type.NODE]: 'mhart/alpine-node:14',
  [Type.PYTHON]: 'python:3.9.0-alpine3.12',
};

export const DOCKER_IMAGE_TEST_TAGS = {
  [Type.JAVA]: 'openjdk:8-jdk-alpine',
};
