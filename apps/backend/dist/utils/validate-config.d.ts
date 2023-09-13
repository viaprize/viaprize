import { ClassConstructor } from 'class-transformer/types/interfaces';
declare function validateConfig<T extends object>(config: Record<string, unknown>, envVariablesClass: ClassConstructor<T>): T;
export default validateConfig;
