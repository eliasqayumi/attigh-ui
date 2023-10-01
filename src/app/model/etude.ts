import {Project} from "./project";
import {Neighbourhood} from "./neighbourhood";

export interface Etude {
  id: number;
  project: Project;
  neighbourhood: Neighbourhood;
  regulationArea: number;
  numberOfBlock: number;
  numberOfBusiness: number;
  cadNumberOfParcels: number;
  way: number;
}
