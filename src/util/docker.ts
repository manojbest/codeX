import Dockerode, { Container, ContainerCreateOptions, ImageInspectInfo } from 'dockerode';
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
        .then(async () => {
          const table: any = [];
          const imageInfoPromises: Promise<ImageInspectInfo>[] = [];
          const imageInfoList = await this.docker.listImages();
          // check docker images availability
          const available = Object.values(DOCKER_IMAGE_TAGS).every((imageTag) => {
            // find the docker image info
            const image = imageInfoList.find((image) => image.RepoTags?.includes(imageTag));
            if (image) {
              // if valid docker image info found, process with image inspection
              imageInfoPromises.push(this.docker.getImage(image.Id).inspect());
            }
            return !!image;
          });
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
            reject('All required docker images are not ready');
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
}

export const docker = new Docker();
