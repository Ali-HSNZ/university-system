import { EnrollmentStatusModel } from "../../models/enrollmentStatus.model"

const enrollmentStatusService = {
    getEnrollmentStatus: async (status_id: number) => {
        const enrollmentStatus = await EnrollmentStatusModel.findOne({
            where: {
                id: status_id
            }
        })
        return enrollmentStatus
    }
}

export default enrollmentStatusService