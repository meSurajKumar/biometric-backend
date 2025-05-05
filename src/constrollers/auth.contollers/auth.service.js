import Employee from '../../models/Employee.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const employeeSecret = process.env.EMPLOYEE_SECRET_KEY;
const tokenExpireTime = process.env.TOKEN_EXPIRE_TIME;

class AuthServices {
    // Login logic via Keycloak-authenticated data
    authLogin = async (body) => {
        const { username, password } = body;
        if (!username || !password) return { message: 'Username and password required', status: 400 };

        try {
            const params = new URLSearchParams();
            params.append('client_id', 'biometric-client-app');
            params.append('grant_type', 'password');
            params.append('username', username);
            params.append('password', password);
            params.append('scope', 'openid profile email')
            const tokenResponse = await axios.post(
                'http://localhost:8080/realms/biometric_realm/protocol/openid-connect/token',
                params,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            const { access_token, refresh_token, expires_in } = tokenResponse.data;
            // Fetch user info using the access token          
            const userInfoResponse = await axios.get(
                "http://localhost:8080/realms/biometric_realm/protocol/openid-connect/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            const userInfo = userInfoResponse.data;
            const { sub, email, given_name, family_name } = userInfo;
            //  Check if user exists
            let employee = await Employee.findOne({ employeeId: sub });
            // If not exists, create
            if (!employee) {
                employee = await Employee.create({
                    employeeId: sub,
                    firstName: given_name || '',
                    lastName: family_name || '',
                    email: email || '',
                });
            };
            const id_token = jwt.sign({ sub: userInfo.sub }, employeeSecret, { expiresIn: tokenExpireTime });
            return { status: 200, access_token: access_token, id_token: id_token, refresh_token: refresh_token, expires_in: expires_in,id: userInfo.sub };
        } catch (error) {
            console.error(error.response?.data || error.message);
            return { status: 400, error: 'Invalid username or password' };
        }
    };

    getDashboardUser = async (tokenParsed) => {
        console.log('token parsed ', tokenParsed)
        return {
            message: 'Dashboard data fetched successfully',
            user: {
                email: tokenParsed.email,
                name: tokenParsed.name,
                preferred_username: tokenParsed.preferred_username,
                given_name: tokenParsed.given_name,
                family_name: tokenParsed.family_name,
            },
            status: 200,
        };
    };

    submitExtraData = async (req) => {
        const { body, user } = req;
        const userId = user.sub;
      
        const {
          email,
          shoulderErr,
          kneeErr,
          backErr,
          totalErr,
          greenPercentage,
          redPercentage,
        } = body;
      
        const employee = await Employee.findOne({ employeeId: userId });
      
        if (employee) {
          employee.email = email;
      
          // Ensure nested objects exist
          if (!employee.employeeScoreCard) {
            employee.employeeScoreCard = {};
          }
          if (!employee.employeeScoreCard.biometricHpeData) {
            employee.employeeScoreCard.biometricHpeData = {};
          }
      
          // Update nested fields
          employee.employeeScoreCard.biometricHpeData.shoulderError = shoulderErr;
          employee.employeeScoreCard.biometricHpeData.kneeError = kneeErr;
          employee.employeeScoreCard.biometricHpeData.backError = backErr;
          employee.employeeScoreCard.biometricHpeData.totalError = totalErr;
          employee.employeeScoreCard.biometricHpeData.greenPercentage = greenPercentage;
          employee.employeeScoreCard.biometricHpeData.redPercentage = redPercentage;
      
          await employee.save();
      
          return { message: 'Data saved', status: 200 };
        }
      
        return { message: 'Employee not found', status: 404 };
      };
      
      

      getUserById = async (params) => {
        const { id } = params; // employeeId (Keycloak sub)
        try {
          const user = await Employee.findOne({ employeeId: id }).select(
            'email firstName lastName employeeScoreCard.biometricHpeData'
          );
      
          if (!user) return { message: 'User not found', status: 404 };
      
          const biometricData = user.employeeScoreCard?.biometricHpeData;
      
          return {
            message: 'User data',
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              scoreData: biometricData || null, // Ensure it's `null` if undefined
            },
            status: 200,
          };
        } catch (err) {
          return { message: err.message || err, status: 400 };
        }
      };

      updateScore = async (req) => {
        try {
          const { body, user } = req;
          const userId = user;
          console.log('user id >',userId)
      
          if (!userId) {
            return { message: 'Invalid token payload', status: 400 };
          }
      
          // Perform the update
          const updateResult = await Employee.updateOne(
            { employeeId: userId },
            { $set: { 'employeeScoreCard.biometricHpeData': body } }
          );
      
          if (updateResult.matchedCount === 0) {
            return { message: 'User not found', status: 404 };
          }
      
          // Retrieve the updated document
          const updatedUser = await Employee.findOne({ employeeId: userId }).select('id email firstName lastName scoreData');
      
          return { message: 'Score updated', user: updatedUser, status: 200 };
        } catch (error) {
          console.error('Error updating score:', error);
          return { message: 'Server error while updating score', status: 500 };
        }
      };
      
      

}

    const authService = new AuthServices();
export default authService;
