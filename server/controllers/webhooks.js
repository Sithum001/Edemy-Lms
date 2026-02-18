import { Webhook } from "svix";
import User from "../models/User.js"

//API contoller function to manage clerk user with database

export const clerkWebhooks = async (req, res)=>{
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        })

        const {data,type} = req.body

        switch (key) {
            case value:
                
                break;
        
            default:
                break;
        }

    } catch (error) {
        
    }
}