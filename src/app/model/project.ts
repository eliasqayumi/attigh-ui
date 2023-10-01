import {ImplementationType} from "./implementation-type";
import {Type} from "./type";

export interface Project {
  id: number;
  projectName: string;
  projectCode: string;
  type: Type;
  implementationType: ImplementationType;
}
