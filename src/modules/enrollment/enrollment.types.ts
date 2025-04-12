 type TEnrollmentRequestBodyType = {
  student_id: number;
  class_schedule_id: number;
}

type TEnrollmentUpdateRequestBodyType = {
  status: 'pending' | 'approved' | 'rejected';
}

export type { TEnrollmentRequestBodyType, TEnrollmentUpdateRequestBodyType }