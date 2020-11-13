import Dockerode, { Container, ContainerCreateOptions } from 'dockerode';

/**
 * Singleton docker class
 */
export class Docker {
  private static instance: Docker;

  // the dockerode instance
  private docker: Dockerode;

  private constructor() {
    // create dockerode instance
    this.docker = new Dockerode({});
  }

  /**
   * Get Docker instance
   */
  public static getInstance(): Docker {
    if (!Docker.instance) {
      Docker.instance = new Docker();
    }
    return Docker.instance;
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
