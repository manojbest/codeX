import { Type } from '../../util/type';
import { AnalysisMetadata } from './metadata/analysis-metadata';
import { JavaMetadata } from './metadata/java-metadata';
import { NodeMetadata } from './metadata/node-metadata';
import { PythonMetadata } from './metadata/python-metadata';

export class AnalysisMetadataFactory {
  public getAnalysisMetaDataInstance(type: Type): AnalysisMetadata {
    switch (type) {
      case Type.JAVA:
        return new JavaMetadata();
      case Type.NODE:
        return new NodeMetadata();
      case Type.PYTHON:
        return new PythonMetadata();
      default:
        return {} as AnalysisMetadata;
    }
  }
}
