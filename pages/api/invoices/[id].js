import dbConnect from "../../../lib/dbConnect";
import Invoice from "../../../models/invoice.model";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const invoice = await Invoice.findById(id);
                if (!invoice) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: invoice });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case 'PUT' /* Edit a model by its ID */:
            try {
                const invoice = await Invoice.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!invoice) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: invoice });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case 'DELETE':
            try {
                const deletedInvoice = await Invoice.deleteOne({ _id: id });
                if (!deletedInvoice) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}