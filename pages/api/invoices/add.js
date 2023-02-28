import dbConnect from "../../../lib/dbConnect";
import Invoice from "../../../models/invoice.model";

export default async function add(req, res) {
    const { method } = req;
    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const invoices = await Invoice.find({}); /* find all the data in our database */
                res.status(200).json({ success: true, data: invoices });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {
                const invoice = await Invoice.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({ success: true, data: invoice });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }

}