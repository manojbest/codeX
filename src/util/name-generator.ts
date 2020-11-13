import {
  adjectives,
  animals,
  colors,
  countries,
  starWars,
  uniqueNamesGenerator,
} from 'unique-names-generator';

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
      dictionaries: [adjectives, animals, countries, colors, starWars],
      style: 'capital',
      separator: '',
    }).replace(/ /g, '');
  }
}

export const nameGenerator = new NameGenerator();
