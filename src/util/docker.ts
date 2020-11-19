import Dockerode, { Container, ContainerCreateOptions, ImageInspectInfo } from 'dockerode';
import { CUSTOM_DOCKER_IMAGES, DOCKER_IMAGE_TAGS } from '../constant/common-constants';
import { Logger } from './logger';

class Docker {
  private static BASE_DOCKERFILE_DIRECTORY = `${process.env.PROJECT_ROOT}/src/docker-config`;

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
      // first build docker images
      Promise.all([this.buildImages()])
        // pull all docker images
        .then(() => Promise.all([this.pullImages()]))
        .then(async () => {
          const table: any = [];
          const imageInfoPromises: Promise<ImageInspectInfo>[] = [];
          const imageInfoList = await this.docker.listImages();
          // build custom docker image tag list
          const customImageTags = Object.values(CUSTOM_DOCKER_IMAGES).map(
            (item) => `${item.tag}:latest`
          );
          // check docker images availability
          const available = [...Object.values(DOCKER_IMAGE_TAGS), ...customImageTags].every(
            (imageTag) => {
              // find the docker image info
              const image = imageInfoList.find((image) => image.RepoTags?.includes(imageTag));
              if (image) {
                // if valid docker image info found, process with image inspection
                imageInfoPromises.push(this.docker.getImage(image.Id).inspect());
              }
              return !!image;
            }
          );
          // proceed further, if all required docker images are present after bootstrapping
          if (available) {
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
          } else {
            Logger.error('bootstrap : All required docker images are not ready');
            reject();
          }
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

  /**
   * Run dockerode container
   *
   * @param image - the image name
   * @param cmd - the command set
   * @param outputStream - the output stream
   * @param createOptions - the create options (optional)
   * @param startOptions - the start options (optional)
   */
  public run(
    image: string,
    cmd: string[],
    outputStream: NodeJS.WritableStream | NodeJS.WritableStream[],
    createOptions?: {},
    startOptions?: {}
  ): Promise<any> {
    return this.docker.run(
      image,
      cmd,
      outputStream,
      { Tty: false, ...createOptions },
      startOptions
    );
  }

  /**
   * Build all docker images
   *
   * @private
   */
  private buildImages(): Promise<any> {
    // build all local docker images
    return this.resolveStream(
      Object.values(CUSTOM_DOCKER_IMAGES).map((image) =>
        this.docker.buildImage(
          {
            context: `${Docker.BASE_DOCKERFILE_DIRECTORY}/${image.folder}`,
            src: ['Dockerfile'],
          },
          { t: image.tag }
        )
      )
    );
  }

  /**
   * Pull all required docker images
   *
   * @private
   */
  private pullImages(): Promise<any> {
    // pull all docker images
    return this.resolveStream(
      Object.values(DOCKER_IMAGE_TAGS).map((dockerImageTag: string) =>
        this.docker.pull(dockerImageTag)
      )
    );
  }

  /**
   * Resolve parallel streams
   *
   * @param streamsList - the lis of stream processes
   * @private
   */
  private resolveStream(streamsList: Promise<any>[]): Promise<boolean> {
    return new Promise<any>((resolve, reject) => {
      Promise.all(streamsList)
        .then((streams) =>
          // do the process attachment and inspection
          Promise.all(
            streams.map(
              (stream) =>
                new Promise((resolveStream) => {
                  // attach to stdout
                  stream.pipe(process.stdout);
                  stream.on('end', () => {
                    // done with stream processing
                    resolveStream();
                  });
                })
            )
          )
        )
        .then(() => resolve(true))
        .catch((reason) => reject(reason));
    });
  }
}

export const docker = new Docker();
