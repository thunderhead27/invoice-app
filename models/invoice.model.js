import { Schema, model, models } from 'mongoose';

const AddressSchema = new Schema({
    street: String,
    city: String,
    postCode: String,
    country: String
});

const ItemSchema = new Schema({
    name: String,
    quantity: Number,
    price: Number,
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ItemSchema.virtual('total').get(function () {
    return this.quantity * this.price;
});

const InvoiceSchema = new Schema({
    id: String,
    createdAt: String,
    paymentDue: String,
    description: String,
    paymentTerms: Number,
    clientName: String,
    clientEmail: String,
    status: String,
    senderAddress: {
        type: AddressSchema,
        required: true,
    },
    clientAddress: {
        type: AddressSchema,
        required: true,
    },
    items: [ItemSchema],
    total: Number,
}, { versionKey: false });



const Invoice = models.Invoice || model("Invoice", InvoiceSchema);

export default Invoice;
