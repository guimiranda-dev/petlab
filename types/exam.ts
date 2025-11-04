import { ExamReferenceValues } from './exam_reference_values';
import { ExamSubgroup } from './exam_subgroup';
import { ExamType } from './exam_types';
import { PetType } from './pet';
import { VetType } from './vet';

export interface ExamInterface {
  id: string;
  pet_id: string;
  vet_id: string;
  date: string;
  vet: VetType;
  pet: PetType & { owner: { name: string; id: string; external_id?: string } };
  exam_values: ExamValues[];
  exam_type: ExamType;
  obs: string;
}

export interface ExamValues {
  exam_reference_id: number;
  value: string;
  relative: string;
  exam_id: number;
  reference_value: string;
  exam_reference_values: ExamReferenceValues;
}

export interface ExamFormProps {
  vet_id: string;
  vet: VetType | null;
  pet_id: string;
  pet: PetType | null;
  owner: { id: string; name: string } | null;
  date: string;
  owner_id: string;
  obs: string;
  exams: {
    type: ExamType | null;
    values: {
      exam_reference_id: number;
      reference_value: string;
      reference_relative_value: string;
      exam_subgroup: ExamSubgroup;
      unit: string;
      value: string;
      relative_value: string;
      name: string;
      method: string;
      sample_type: string;
    }[];
  };
}
