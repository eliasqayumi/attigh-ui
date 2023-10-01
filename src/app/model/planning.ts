import {Project} from "./project";
import {District} from "./district";

export interface Planning {
  id: number;
  project: Project;
  district: District;
  area: number;
}
