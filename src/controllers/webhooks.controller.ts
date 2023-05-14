import {Request, Response} from 'express';

export class WebhookController{

    constuctor(){}

    /**
     * Consume webhook events
     * @param req the http request object
     * @param res the http response object
     */
    public consumeWebhookEvents(req: Request, res: Response): void{
        try {
            if(req.body){
                console.log("📰 New webhook event received");
                console.log(req.body);
                res.status(200).send(`Webhook event ${req.body.eventId} received successfully`);
            }
          } catch (error) {
            res.status(500).json({"error": "something went wrong"});
        }
    }

}