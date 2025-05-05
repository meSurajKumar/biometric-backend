import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js'; // Assuming Employee model is in models folder;
const employeeSecret = process.env.EMPLOYEE_SECRET_KEY;

const verifyIdToken = async (req, res, next) => {
  // Get token from request header or body (depending on your implementation)
  const token = req.headers['authorization']?.split(' ')[1] || req.body.token;

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  try {
    // Decode the token to extract the sub (employeeId)
    const decoded = jwt.decode(token,employeeSecret);
    console.log('decode > ',decoded)

    if (!decoded || !decoded.sub) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Retrieve the stored token from the database
    const employee = await Employee.findOne({ employeeId: decoded.sub });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // const storedToken = employee?.employeeScoreCard?.biometricHpeData?.token;

    // Verify the token with the stored one
    // jwt.verify(token, employeeSecret, (err, verifiedToken) => {
    //   if (err) {
    //     return res.status(403).json({ message: 'Token verification failed' });
    //   }

      // Attach the decoded token to the request for use in subsequent steps
      req.user = employee.employeeId;
      next();
    // });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default verifyIdToken;
