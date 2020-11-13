import Dockerode, {
  Container,
  ContainerCreateOptions,
  ImageInfo,
  ImageInspectInfo,
} from 'dockerode';
import { DOCKER_IMAGE_TAGS } from '../constant/common-constants';
import { Logger } from './logger';

class Docker {
  // the dockerode instance
  private docker: Dockerode;

  constructor() {
    // create dockerode instance
    this.docker = new Dockerode({});
  }

  /**
   * Bootstrap the docker image pull
   */
  public bootstrap(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // pull all docker images
      Promise.all(
        Object.values(DOCKER_IMAGE_TAGS).map((dockerImageTag: string) =>
          this.docker.pull(dockerImageTag)
        )
      )
        .then((streams) => {
          // check all streams
          streams.forEach((stream, index) => {
            // attach to stdout
            stream.pipe(process.stdout);
            // check current stream is the last or not
            if (index === Object.values(DOCKER_IMAGE_TAGS).length - 1) {
              stream.once('end', async () => {
                const table: any = [];
                const imageInfoPromises: Promise<ImageInspectInfo>[] = [];
                const imageInfoList = await this.docker.listImages();
                // extract image info list
                imageInfoList.forEach((imageInfo: ImageInfo) => {
                  Object.values(DOCKER_IMAGE_TAGS).forEach((imageTag) => {
                    // needs only to show the images for this application
                    if (imageInfo.RepoTags.includes(imageTag)) {
                      imageInfoPromises.push(this.docker.getImage(imageInfo.Id).inspect());
                    }
                  });
                });
                // resolve image info promises
                Promise.all(imageInfoPromises).then((imageInspectInfo: ImageInspectInfo[]) => {
                  imageInspectInfo.forEach((imageInspectInfoItem: ImageInspectInfo) => {
                    table.push({
                      id: imageInspectInfoItem.Id,
                      tags: imageInspectInfoItem.RepoTags,
                      size: imageInspectInfoItem.Size,
                    });
                  });
                  console.log('Docker images in this application');
                  console.table(table);
                  resolve(true);
                });
              });
            }
          });
        })
        .catch((error) => {
          // error occurred while bootstrapping
          Logger.error('bootstrap : ', error);
          reject(error);
        });
    });
  }

  /**
   * Create dockerode container
   *
   * @param options - the container options
   */
  public createContainer(options: ContainerCreateOptions): Promise<Container> {
    return this.docker.createContainer(options);
  }
}

export const docker = new Docker();
