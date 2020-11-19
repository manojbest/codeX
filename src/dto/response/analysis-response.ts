import {Status} from '../../util/status'

// define json format as required
export interface AnalysisResponse {
    status: Status
    type: string
    error: string
}
