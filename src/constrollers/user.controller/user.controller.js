import authService from './auth.service.js'



class AuthController {

/**
 * User Login :- 
 * @param {email , password}
 * @return {json}
 */

async userLogin(req , res , next){
    try {
        const loginUser = await authService.authLogin(req.body)
        return res.status(loginUser.status).send({message:loginUser.message ,token: loginUser.token, id_token:loginUser.id_token, refresh_token:loginUser.refresh_token,expires_in: loginUser.expires_in})

        
    } catch (error) {
     console.log('Error Data :',error)
     next(error)   
    }
}



}

const authController = new AuthController();
export default authController