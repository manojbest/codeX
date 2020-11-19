import { CustomType, Type } from '../util/type';

/**
 * Custom docker images for static code analysis images
 */
export const CUSTOM_DOCKER_IMAGES = {
  [CustomType.CUSTOM_JAVA]: { tag: 'analyzer_java', folder: 'java' },
  [CustomType.CUSTOM_NODE]: { tag: 'analyzer_node', folder: 'node' },
  [CustomType.CUSTOM_PYTHON]: { tag: 'analyzer_python', folder: 'python' },
};
/**
 * all application docker image tags
 */
export const DOCKER_IMAGE_TAGS = {
  [Type.JAVA]: 'openjdk:14-jdk-alpine',
  [Type.NODE]: 'mhart/alpine-node:14',
  [Type.PYTHON]: 'python:3.9.0-alpine3.12',
  [CustomType.CUSTOM_JAVA]: `${CUSTOM_DOCKER_IMAGES[CustomType.CUSTOM_JAVA].tag}:latest`,
  [CustomType.CUSTOM_NODE]: `${CUSTOM_DOCKER_IMAGES[CustomType.CUSTOM_NODE].tag}:latest`,
  [CustomType.CUSTOM_PYTHON]: `${CUSTOM_DOCKER_IMAGES[CustomType.CUSTOM_PYTHON].tag}:latest`,
};
