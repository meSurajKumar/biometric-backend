import authService from './auth.service.js';

class AuthController {
  async userLogin(req, res, next) {
    try {
      const loginUser = await authService.authLogin(req.body);
      res.status(loginUser.status).send({refresh_token:loginUser.refresh_token,id_token:loginUser.id_token,access_token:loginUser.access_token,expires_in:loginUser.expires_in });
    } catch (error) {
      console.log('Error:', error);
      next(error);
    }
  }

  async dashboardMethod(req, res, next) {
    try {
        console.log('controller')
        console.log('req data ',req)
    //   const tokenParsed = req.kauth.grant.access_token.content;
      const tokenParsed = req.kauth.grant.access_token.content;
      const userData = await authService.getDashboardUser(tokenParsed);
      res.status(userData.status).send(userData);
    } catch (error) {
      console.log('Dashboard error:', error);
      next(error);
    }
  }

  async submitData(req, res, next) {
    try {
      const response = await authService.submitExtraData(req.body);
      res.status(response.status).send(response);
    } catch (error) {
      console.log('Submit Data error:', error);
      next(error);
    }
  }

  async getUserData(req, res, next) {
    try {
      const response = await authService.getUserById(req.params);
      res.status(response.status).send({data:response.data ,message:response.message});
    } catch (error) {
      console.log('Submit Data error:', error);
      next(error);
    }
  }


}

const authController = new AuthController();
export default authController;
