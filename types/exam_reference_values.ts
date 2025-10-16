import { ExamSubgroup } from './exam_subgroup';
import { ExamType } from './exam_types';

export interface ExamReferenceValues {
  id: number;
  name: string;
  adult_dog_reference: string;
  puppy_dog_reference: string;
  adult_cat_reference: string;
  puppy_cat_reference: string;
  exam_subgroup: ExamSubgroup;
  order: number;
  adult_dog_reference_relative: string;
  puppy_dog_reference_relative: string;
  adult_cat_reference_relative: string;
  puppy_cat_reference_relative: string;
  adult_dog_reference_absolute: string;
  puppy_dog_reference_absolute: string;
  adult_cat_reference_absolute: string;
  puppy_cat_reference_absolute: string;
  exam_type: ExamType;
}
