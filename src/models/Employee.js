import { Schema, model } from 'mongoose';

const employeeSchema = new Schema({
  employeeId: { type: String,},
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String,  },
  employeeScoreCard: {
    biometricHpeData: {
      shoulderError: { type: String },
      backError: { type: String },
      kneeError: { type: String },
      totalError: { type: String },
      greenPercentage: { type: String },
      redPercentage: { type: String },
      token: { type: String },
      tokenExpireTime: { type: String },
    },
  },
}, { timestamps: true, versionKey: false });

const Employee = model('Employee', employeeSchema);
export default Employee;
