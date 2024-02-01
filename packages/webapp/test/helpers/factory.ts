import {
  defineCategoryFactory,
  defineGeneratedProblemFactory,
  defineProblemGeneratorFactory,
  defineUserFactory,
} from '../../src/__generated__/fabbrica';

export const UserFactory = defineUserFactory();
export const CategoryFactory = defineCategoryFactory();
export const ProblemGeneratorFactory = defineProblemGeneratorFactory({
  defaultData: {
    category: CategoryFactory,
  },
});
export const GeneratedProblemFactory = defineGeneratedProblemFactory({
  defaultData: {
    userAssigned: UserFactory,
    category: CategoryFactory,
    problemGenerator: ProblemGeneratorFactory,
  },
});
