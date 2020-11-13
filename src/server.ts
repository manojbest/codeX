import {Container, ImageInfo, ImageInspectInfo} from 'dockerode';
import { Docker } from './util/docker';
import { Logger } from './util/logger';
import { App } from './app';
import { ExecutorController } from './controller/executor-controller';
import { BaseController } from './controller/base-controller';
import { ActuatorController } from './controller/actuator-controller';
import { DOCKER_IMAGE_TAGS } from './constant/common-constants';

const port: number = parseInt(process.env.PORT || '7070');

// all application controllers should register here
const controllers: BaseController[] = [
  new ActuatorController(),
  new ExecutorController(),
];

// initialize app instance
const app = new App(controllers, port);

// download all the docker images
const dockerImages: any[] = [];

DOCKER_IMAGE_TAGS.forEach((dockerImageTag: string) => {
  dockerImages.push(Docker.pull(dockerImageTag));
});

Promise.all(dockerImages).then((streams) => {
  streams.forEach((stream, index) => {
    stream.pipe(process.stdout);
    if (index == DOCKER_IMAGE_TAGS.length - 1) {
      stream.once('end', () => {
        const table: any = [];
        Docker.listImages().then((imageInfoList: ImageInfo[]) => {
          const imageInfoPromises: Promise<ImageInspectInfo>[] = [];
          imageInfoList.forEach((imageInfo: ImageInfo) => {
            DOCKER_IMAGE_TAGS.forEach((dockerImageTag) => {
              // needs only to show the images for this application
              if (imageInfo.RepoTags.includes(dockerImageTag)) {
                imageInfoPromises.push(Docker.getImage(imageInfo.Id).inspect());
              }
            });
          });

          Promise.all(imageInfoPromises).then(
            (imageInspectInfo: ImageInspectInfo[]) => {
              imageInspectInfo.forEach(
                (imageInspectInfoItem: ImageInspectInfo) => {
                  table.push({
                    id: imageInspectInfoItem.Id,
                    tags: imageInspectInfoItem.RepoTags,
                    size: imageInspectInfoItem.Size,
                  });
                }
              );
              console.log(
                '##############################################################'
              );
              console.log('Docker images in this application');
              console.table(table);
              console.log(
                '##############################################################'
              );
              app.start();
            }
          );
        });
      });
    }
  });
});

process.on('uncaughtException', (err) => {
  Logger.error('uncaughtException : ', err.message, err.stack);
  process.exit(1);
});
