import { LanguageMetadata } from './metadata/language-metadata';
import { Type } from '../../util/type';
import { JavaMetadata } from './metadata/java-metadata';
import { NodeMetadata } from './metadata/node-metadata';
import { PythonMetadata } from './metadata/python-metadata';

export class LanguageMetadataFactory {
  public getLanguageMetadataInstance(type: Type): LanguageMetadata {
    switch (type) {
      case Type.JAVA:
        return new JavaMetadata();
      case Type.NODE:
        return new NodeMetadata();
      case Type.PYTHON:
        return new PythonMetadata();
      default:
        return {} as LanguageMetadata;
    }
  }
}
