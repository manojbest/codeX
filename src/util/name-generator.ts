import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

/**
 * Name generator
 */
class NameGenerator {
  /**
   * Unique name generator
   * useful for file names
   */
  public generateName(): string {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      style: 'capital',
      separator: '',
    }).replace(/ /g, '');
  }
}

export const nameGenerator = new NameGenerator();
