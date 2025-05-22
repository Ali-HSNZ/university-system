import { EnrollmentModel } from './enrollment.model'
import { EnrollmentStatusModel } from './enrollmentStatus.model'

// Define associations
EnrollmentModel.hasMany(EnrollmentStatusModel, { foreignKey: 'enrollment_id', onDelete: 'CASCADE' })
EnrollmentStatusModel.belongsTo(EnrollmentModel, { foreignKey: 'enrollment_id', onDelete: 'CASCADE' })
