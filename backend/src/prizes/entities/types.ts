import { PaginateQuery } from 'nestjs-paginate';

export enum Proficiency {
  Programming = 'Programming',
  Python = 'Python',
  JavaScript = 'JavaScript',
  Writing = 'Writing',
  Design = 'Design',
  Translation = 'Translation',
  Research = 'Research',
  RealEstate = 'Real estate',
  Apps = 'Apps',
  Hardware = 'Hardware',
  Art = 'Art',
  Meta = 'Meta',
  AI = 'AI',
}
export enum Priority {
  ClimateChange = 'Climate change',
  NetworkCivilizations = 'Network civilizations',
  OpenSource = 'Open-source',
  CommunityCoordination = 'Community coordination',
  Health = 'Health',
  Education = 'Education',
}

export type PrizePaginateQuery = PaginateQuery & {
  proficiencies?: Proficiency[];
  priorities?: Priority[];
};
