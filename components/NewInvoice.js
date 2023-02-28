import Image from "next/image";
import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import OutsideAlerter from "../hooks/useOutsideAlerter";
import Calendar from "react-calendar";
import { useFieldArray, useForm } from 'react-hook-form';
import add from 'date-fns/add';
import { useRouter } from "next/router";

const Container = styled.nav`
  position: absolute;
  transition: transform 300ms;
  transform: ${({ open }) => (open ? 'translateX(0%)' : 'translateX(-100%)')};
`;

const CalContainer = styled.div`
    position: relative;
    bottom: -24px;
    display: ${({ open }) => (open ? 'block' : 'none')};
`;

const Input = styled.input`
    border: 1px solid var(--text-primary);
    background: var(--bg-secondary);
`;

const Field = styled.div`
    border: 1px solid var(--text-primary);
    background: var(--bg-secondary);
`;

const StyledField = tw(Field)`
rounded-md h-12 flex flex-row items-center place-content-center border-none text-secondary font-bold
`;

const StyledInput = styled(Input)(({ error }) => [
    tw`rounded-md hover:border-[#7C5DFA] hover:border-2 focus:outline-none focus:border-none focus:ring-[#7C5DFA] focus:ring-2 h-12 text-lg`,
    error && tw`border-[#EC5757] focus:ring-[#EC5757]`
]);

const Error = styled.p(({ error }) => [
    tw`text-[#EC5757]`,

    error ? tw`hidden` : tw`block`
]);


const objDate = (date) => {
    return new Date(date).toLocaleString("en-uk", { day: 'numeric', month: "short", year: 'numeric' });
};

const getPaymentDue = (date, days) => {
    const result = add(new Date(date), { days: days });
    return new Date(result).toLocaleString("en-ca", { year: 'numeric', month: "numeric", day: 'numeric' });
};

const getInvoiceDate = (date) => {
    return new Date(date).toLocaleString("en-ca", { year: 'numeric', month: "numeric", day: 'numeric' });
};

const paymentTerms = [1, 7, 14, 30];

function generateUID() {
    // I generate the UID from two parts here 
    // to ensure the random number provide enough bits.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}

export const NewInvoice = ({ newInvoice, setNewInvoice }) => {
    const [value, onChange] = useState(new Date());
    const [calendar, setCalendar] = useState(false);
    const [selected, setSelected] = useState(paymentTerms[0]);
    const [itemList, setItemList] = useState([{
        name: '',
        quantity: '',
        price: '',
        total: '',
    }]);

    const router = useRouter();

    const initialState = {
        id: '',
        createdAt: '',
        paymentDue: '',
        description: '',
        paymentTerms: '',
        clientName: '',
        clientEmail: '',
        status: '',
        senderAddress: {
            street: '',
            city: '',
            postCode: '',
            country: '',
        },
        clientAddress: {
            street: '',
            city: '',
            postCode: '',
            country: '',
        },
        items: [],
        total: '',
    };

    const [formData, setFormData] = useState(initialState);

    const { register, handleSubmit, getValues, control, formState: { errors } } = useForm();

    const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "items", // unique name for your Field Array
        rules: {
            required: "Please append at least 1 item"
        }
    });

    const postData = async (form) => {
        try {
            const res = await fetch('/api/invoices/add', {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(form),
            });
            router.push('/');
            router.reload();
            // Throw error with status code in case Fetch API req failed
            if (!res.ok) {
                throw new Error(res.status);
            }

        } catch (error) {
            console.log(error);
        }
    };

    async function handleSubmitDraft(data) {
        const form = {
            id: generateUID(),
            createdAt: getInvoiceDate(value),
            paymentDue: getPaymentDue(value, selected),
            description: data.description,
            paymentTerms: selected,
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            status: "draft",
            senderAddress: {
                street: data.senderAddress,
                city: data.senderCity,
                postCode: data.senderPostCode,
                country: data.senderCountry
            },
            clientAddress: {
                street: data.clientAddress,
                city: data.clientCity,
                postCode: data.clientPostCode,
                country: data.clientCountry
            },
            items: data.items,
            total: data.items.reduce((acc, cur) => acc + cur.quantity * cur.price, 0)
        };
        setFormData(form);

        postData(form);

        setFormData(initialState);

    };

    async function handleSubmitSend(data) {
        const form = {
            id: generateUID(),
            createdAt: getInvoiceDate(value),
            paymentDue: getPaymentDue(value, selected),
            description: data.description,
            paymentTerms: selected,
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            status: "pending",
            senderAddress: {
                street: data.senderAddress,
                city: data.senderCity,
                postCode: data.senderPostCode,
                country: data.senderCountry
            },
            clientAddress: {
                street: data.clientAddress,
                city: data.clientCity,
                postCode: data.clientPostCode,
                country: data.clientCountry
            },
            items: data.items,
            total: data.items.reduce((acc, cur) => acc + cur.quantity * cur.price, 0)
        };
        setFormData(form);
        console.log(form);

        postData(form);
        setFormData(initialState);

    };

    const Dropdown = () => {
        return (
            <select tw="border-[#7C5DFA] h-12 bg-secondary pl-6 font-bold" value={selected} onChange={e => setSelected(e.target.value)}>
                {paymentTerms.map(value => (
                    <option value={value} key={value}>{value === 1 ? 'Net 1 day' : `Net ${value} days`}</option>
                ))}
            </select>
        );
    };

    return (
        <OutsideAlerter setFunction={setNewInvoice}>
            <Container tw="bg-secondary w-full pt-8 px-6 top-[72px] laptop:top-0 tablet:w-[616px] laptop:w-[719px] laptop:h-screen laptop:pl-40 laptop:pt-14 z-30 rounded-r-lg overflow-y-auto" open={newInvoice}>
                <div tw="flex flex-col font-sans gap-y-6">
                    <div tw="flex flex-row gap-x-6 font-sans items-center">
                        <div tw="h-[9px] w-[5px]"><Image src="/assets/icon-arrow-left.svg" width={5} height={9} alt="leftArrow"></Image></div>
                        <div tw="font-bold" onClick={() => setNewInvoice(false)}>Go back</div>
                    </div>
                    <div tw="font-bold text-2xl">New Invoice</div>
                    <form>
                        <div tw="text-[#7C5DFA] font-bold mb-6">Bill From</div>
                        <div tw="flex flex-col mb-6">
                            <label htmlFor="senderAddress" tw="text-secondary">Street Address</label>
                            <StyledInput error={errors.senderAddress} type="text" id="senderAddress" {...register("senderAddress", { required: "Can't be empty" })} />
                            <Error>{errors.senderAddress?.message}</Error>
                        </div>
                        <div tw="grid grid-cols-2 grid-rows-2 tablet:grid-cols-3 tablet:grid-rows-1 gap-x-6 gap-y-6 mb-10">
                            <div tw="flex flex-col row-start-1 col-span-1">
                                <label htmlFor="senderCity" tw="text-secondary">City</label>
                                <StyledInput error={errors.senderCity} type="text" id="senderCity" {...register("senderCity", { required: "Can't be empty" })} />
                                <Error>{errors.senderCity?.message}</Error>
                            </div>
                            <div tw="flex flex-col row-start-1 col-span-1">
                                <label htmlFor="senderPostCode" tw="text-secondary">Post Code</label>
                                <StyledInput error={errors.senderPostCode} type="text" id="senderPostCode" {...register("senderPostCode", { required: "Can't be empty" })} />
                                <Error>{errors.senderPostCode?.message}</Error>
                            </div>
                            <div tw="flex flex-col row-start-2 col-span-2 tablet:col-start-3 tablet:row-start-1">
                                <label htmlFor="senderCountry" tw="text-secondary">Country</label>
                                <StyledInput error={errors.senderCountry} type="text" id="senderCountry" {...register("senderCountry", { required: "Can't be empty" })} />
                                <Error>{errors.senderCountry?.message}</Error>
                            </div>
                        </div>
                        <div tw="text-[#7C5DFA] font-bold mb-6">Bill To</div>
                        <div tw="flex flex-col gap-y-6 mb-6">
                            <div tw="flex flex-col">
                                <label htmlFor="clientName" tw="text-secondary">Client's Name</label>
                                <StyledInput error={errors.clientName} tw="" type="text" id="clientName" {...register("clientName", { required: "Can't be empty" })} />
                                <Error>{errors.clientName?.message}</Error>
                            </div>
                            <div tw="flex flex-col">
                                <label htmlFor="clientEmail" tw="text-secondary">Client's Email</label>
                                <StyledInput error={errors.clientEmail} type="text" id="clientEmail" {...register("clientEmail", { required: "Can't be empty" })} />
                                <Error>{errors.clientEmail?.message}</Error>
                            </div>
                            <div tw="flex flex-col col-span-2 tablet:col-span-3">
                                <label htmlFor="clientAddress" tw="text-secondary">Street Address</label>
                                <StyledInput error={errors.clientAddress} type="text" id="clientAddress" {...register("clientAddress", { required: "Can't be empty" })} />
                                <Error>{errors.clientAddress?.message}</Error>
                            </div>
                        </div>
                        <div tw="grid grid-cols-2 grid-rows-2 tablet:grid-cols-3 tablet:grid-rows-1 gap-x-6 gap-y-6 mb-10">
                            <div tw="flex flex-col row-start-1 col-span-1">
                                <label htmlFor="clientCity" tw="text-secondary">City</label>
                                <StyledInput error={errors.clientCity} type="text" id="clientCity" {...register("clientCity", { required: "Can't be empty" })} />
                                <Error>{errors.clientCity?.message}</Error>
                            </div>
                            <div tw="flex flex-col col-start-2 col-span-1">
                                <label htmlFor="clientPostCode" tw="text-secondary">Post Code</label>
                                <StyledInput error={errors.clientPostCode} type="text" id="clientPostCode" {...register("clientPostCode", { required: "Can't be empty" })} />
                                <Error>{errors.clientPostCode?.message}</Error>
                            </div>
                            <div tw="flex flex-col row-start-2 col-span-2 tablet:col-span-1 tablet:row-start-1 tablet:col-start-3">
                                <label htmlFor="clientCountry" tw="text-secondary">Country</label>
                                <StyledInput error={errors.clientCountry} type="text" id="clientCountry" {...register("clientCountry", { required: "Can't be empty" })} />
                                <Error>{errors.clientCountry?.message}</Error>
                            </div>
                        </div>
                        <div tw="flex flex-col tablet:flex-row tablet:gap-x-6 mb-6">
                            <div tw="w-1/2">
                                <label htmlFor="invoiceDate" tw="text-secondary">Invoice Date</label>
                                <Field tw="flex flex-row rounded-md h-12 items-center px-[20px] justify-between" onClick={() => setCalendar(true)}>
                                    <div tw="font-bold">{objDate(value)}</div>
                                    <div><Image src="/assets/icon-calendar.svg" width={16} height={16} alt="calendar" /></div>
                                </Field>
                                <OutsideAlerter setFunction={setCalendar}><CalContainer open={calendar}><Calendar onChange={onChange} value={value} calendarType={'US'} /></CalContainer></OutsideAlerter>
                            </div>
                            <div tw="flex flex-col w-1/2">
                                <label htmlFor="paymentTerms" tw="text-secondary">Payment Terms</label>
                                <Dropdown />
                            </div>
                        </div>
                        <div tw="flex flex-col mb-6 tablet:mb-10">
                            <label htmlFor="description" tw="text-secondary">Project Description</label>
                            <StyledInput error={errors.description} type="text" id="description" {...register("description", { required: "Can't be empty" })} />
                            <Error>{errors.description?.message}</Error>
                        </div>
                        <div tw="flex flex-col mb-8">
                            <div tw="text-[#777F98] font-bold text-lg">Item List</div>
                            {fields.map((field, i) =>
                                <div key={field.id} tw="grid grid-rows-2 grid-cols-[64px_100px_100px_auto] tablet:flex tablet:flex-row gap-x-6 gap-x-4 gap-y-4 mb-4">
                                    <div tw="flex flex-col col-span-4 tablet:w-[220px]">
                                        <label htmlFor="itemName" tw="text-secondary">Item Name</label>
                                        <StyledInput type="text" id="itemName" {...register(`items.${i}.name`, { required: "Can't be empty" })} />
                                        <Error>{errors?.['item']?.[i]?.['name']?.['message']}</Error>
                                    </div>
                                    <div tw="flex flex-col row-start-2 col-start-1 tablet:w-12">
                                        <label htmlFor="itemsQuantity" tw="text-secondary">Qty.</label>
                                        <StyledInput type="text" id="itemsQuantity" {...register(`items.${i}.quantity`, { valueAsNumber: true }, { required: "Can't be empty" })} />
                                        <Error>{errors?.['item']?.[i]?.['quantity']?.['message']}</Error>
                                    </div>
                                    <div tw="flex flex-col row-start-2 col-start-2 tablet:w-20">
                                        <label htmlFor="itemPrice" tw="text-secondary">Price</label>
                                        <StyledInput type="text" id="itemPrice" {...register(`items.${i}.price`, { valueAsNumber: true }, { required: "Can't be empty" })} />
                                        <Error>{errors?.['item']?.[i]?.['price']?.['message']}</Error>
                                    </div>
                                    <div tw="flex flex-col row-start-2 col-start-3 tablet:w-20">
                                        <label htmlFor="itemPrice" tw="text-secondary">Total</label>
                                        <StyledField>{Intl.NumberFormat('en-GB', { style: "currency", currency: 'GBP' }).format(getValues(`items.${i}.price`) * getValues(`items.${i}.quantity`))}</StyledField>
                                    </div>
                                    <div onClick={() => remove(i)} tw="flex flex-col pt-4 row-start-2 col-start-4 tablet:w-auto place-content-center cursor-pointer">
                                        <Image src="/assets/icon-delete.svg" width={12} height={16} alt="recyclingBin" />
                                    </div>
                                </div>)}
                            <Error>{errors.items?.root?.message}</Error>
                            <div onClick={() => append({ name: '', quantity: '', price: '' })} tw="flex flex-row items-center place-content-center bg-primary h-12 rounded-full text-secondary font-bold cursor-pointer">+ Add New Item</div>
                        </div>
                        <div tw="flex flex-row justify-between">
                            <div><button tw="w-24 h-12 bg-primary rounded-full text-tertiary font-bold">Discard</button></div>
                            <div tw="flex flex-row gap-x-2">
                                <button onClick={handleSubmit(data => { handleSubmitDraft(data); })} tw="w-[133px] h-12 bg-alt rounded-full text-secondary font-bold">Save as Draft</button>
                                <button onClick={handleSubmit(data => { handleSubmitSend(data); })} tw="w-[128px] h-12 bg-[#7C5DFA] rounded-full text-white font-bold">Save & Send</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Container >
        </OutsideAlerter >
    );
};
