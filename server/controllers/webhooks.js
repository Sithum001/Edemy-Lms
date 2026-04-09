import { Webhook } from "svix";
import User from "../models/User.js"

//API contoller function to manage clerk user with database

export const clerkWebhooks = async (req, res)=>{
    console.log('>>> clerkWebhooks function called <<<')
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        })

        const {data,type} = req.body

        console.log('Webhook event type:', type)
        console.log('Webhook data:', JSON.stringify(data, null, 2))

        switch (type) {
            case 'user.created':{
                const userData ={
                    _id: data.id,
                    email:data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                console.log('Creating user:', userData)
                await User.create(userData)
                console.log('User created successfully')
                res.json({success: true})
                break;
            }

            case 'user.updated':{
                const userData ={
                    _id: data.id,
                    email:data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                console.log('Updating user:', userData)
                await User.findByIdAndUpdate(data.id,userData)
                console.log('User updated successfully')
                res.json({success: true})
                break;
            }

               case 'user.deleted':{
                console.log('Deleting user:', data.id)
                await User.findByIdAndDelete(data.id)
                console.log('User deleted successfully')
                res.json({success: true})
                break;
            }
                
        
            default:
                console.log('Unhandled webhook event type:', type)
                res.json({success: true})
                break;
        }

    } catch (error) {
         console.error('Webhook error:', error.message)
         console.error('Error stack:', error.stack)
         res.json({success: false, message: error.message})
        
    }
}