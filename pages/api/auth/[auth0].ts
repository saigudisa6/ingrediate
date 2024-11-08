import { handleAuth, handleLogin, handleCallback, handleLogout } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default handleAuth({
    signup: handleLogin({ 
        authorizationParams: { screen_hint: "signup" },
        returnTo: '/generateRecipes',
    }),

    logout: handleLogout({
      returnTo: 'https://ingrediate-dsf0mbs5p-saigudisa6s-projects.vercel.app/', // Change this to your desired redirect URL after logout
    }),

    async login(req : NextApiRequest, res : NextApiResponse) {
        // Redirect to /generateRecipes after successful login
        await handleLogin(req, res, {
          returnTo: '/generateRecipes',
        });
      },  
});