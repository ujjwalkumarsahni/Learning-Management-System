import { Webhook } from "svix";
import User from "../Models/User.js";
import Stripe from "stripe";
import Purchase from './../Models/Purchase.js';
import Course from "../Models/Course.js";


// Function to manage Clerk User with Database
export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify the webhook signature
        whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url,
                };
                await User.create(userData);
                return res.json({ success: true });
            }
            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, userData);
                return res.json({ success: true });
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true });
            }
            default:
                return res
                    .status(400)
                    .json({ success: false, message: "Unhandled event type" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id

            const session = await stripeInstance.checkout.session.list({
                payment_intent: paymentIntentId
            })
            const { purchaseId } = session.data[0].metadata

            const purchaseData = await Purchase.findById(purchaseId)
            const userData = await User.findById(purchaseId.userId)
            const courseData = await Course.findById(purchaseId.courseId.toString())

            courseData.enrolledStudents.push(userData)
            await courseData.save()

            userData.enrolledCourses.push(courseData._id)
            await userData.save()

            purchaseData.status = 'completed'
            await purchaseData.save()

            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id

            const session = await stripeInstance.checkout.session.list({
                payment_intent: paymentIntentId
            })
            const { purchaseId } = session.data[0].metadata

            const purchaseData = await Purchase.findById(purchaseId)

            purchaseData.status = 'failed'
            await purchaseData.save()

            break;
        }
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
};
