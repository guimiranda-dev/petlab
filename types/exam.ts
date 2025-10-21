import { ExamType } from './exam_types';
import { PetType } from './pet';
import { VetType } from './vet';

export interface ExamInterface {
  id: string;
  pet_id: string;
  vet_id: string;
  date: string;
  vet: VetType;
  pet: PetType & { owner: { name: string } };
  exam_values: ExamValues[];
  exam_type: keyof typeof ExamType;
}

export interface ExamValues {
  exam_reference_id: number;
  value: number;
  exam_id: number;
  reference_value: string;
}

export interface ExamFormProps {
  vet_id: string;
  pet_id: string;
  pet: PetType | null;
  owner: { id: string; name: string } | null;
  date: string;
  owner_id: string;
  exams: {
    type: ExamType | null;
    values: {
      exam_reference_id: number;
      reference_value: string;
      value: number;
      name: string;
    }[];
  };
}
