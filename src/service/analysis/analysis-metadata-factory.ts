import {AnalysisMetadata} from './metadata/analysis-metadata'
import {Type} from '../../util/type'
import {JavaMetadata} from '../analysis/metadata/java-metadata'
import {NodeMetadata} from '../analysis/metadata/node-metadata'
import {PythonMetadata} from '../analysis/metadata/python-metadata'

export class AnalysisMetadataFactory{

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
