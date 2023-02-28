import Image from "next/image";
import React, { useState } from 'react';
import { useRouter } from "next/router";
import tw, { styled } from 'twin.macro';
import { Sidebar } from "../../components/Sidebar/Sidebar";
import OutsideAlerter from "../../hooks/useOutsideAlerter";
import { EditInvoice } from "../../components/EditInvoice";
import { mutate } from 'swr';
import dbConnect from "../../lib/dbConnect";
import Invoice from "../../models/invoice.model";

const StatusBox = styled.div`
    display: flex;
    flex-direction: row;
    height: 40px;
    width: 104px;
    border-radius: 6px;
    justify-content: center;
    gap: 8px;
    align-items: center;
	text-transform: capitalize;
    ${({ status }) => (status ? `background-color: rgba${status}, 0.06); color: rgb${status})` : ``)};
`;

const Circle = styled.div`
    ${({ status }) => (status ? `background-color: rgb${status});` : ``)};
`;

const Overlay = styled.div`
    ${({ overlay }) => (overlay ? `background-color: rgba(0,0,0,0.5); filter: brightness(50%)` : ``)};
`;

const Deletion = styled.div`
    position: absolute;
    visibility: hidden;
    z-index: 40;
    ${({ deletion }) => (deletion ? `visibility: visible` : ``)};
`;

const getColor = (status) => {
    if (status == "paid") return '(51, 214, 159';
    else if (status == "pending") return '(255, 143, 0';
    else return '(55, 59, 83';
};

const objDate = (date) => {
    return new Date(date).toLocaleString("en-uk", { day: 'numeric', month: "short", year: 'numeric' });
};


export default function InvoicePage({ invoiceInfo }) {
    const router = useRouter();
    const [overlay, setOverlay] = useState(false);
    const [editInvoice, setEditInvoice] = useState(false);

    const markAsPaid = async () => {
        const { id } = router.query;

        try {
            const form = { status: 'paid' };

            const res = await fetch(`/api/invoices/${id}`, {
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(form),
            });

            // Throw error with status code in case Fetch API req failed
            if (!res.ok) {
                throw new Error(res.status);
            }

            const { data } = await res.json();

            mutate(`/api/invoices/${id}`, data, false); // Update the local data without a revalidation
        } catch (error) {
            console.log(error);
        }

    };

    const deleteInvoice = async () => {
        const invoiceId = router.query.id;

        try {
            await fetch(`/api/invoices/${invoiceId}`, {
                method: 'DELETE',
            });

            router.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div tw="flex flex-col">
            <OutsideAlerter tw="" setFunction={setOverlay}>
                <Deletion tw="flex flex-col font-sans p-8 mt-auto mb-auto top-0 bottom-0 ml-auto mr-auto left-0 right-0 w-[327px] h-[220px] tablet:w-[480px] tablet:h-[250px] bg-secondary rounded-lg" deletion={overlay}>
                    <span tw="text-2xl font-bold tablet:mb-8">Confirm Deletion</span>
                    <span tw="text-secondary text-sm">Are you sure you want to delete invoice #{invoiceInfo.id}? This action cannot be undone.</span>
                    <div tw="flex flex-row gap-x-2 self-end mt-8">
                        <button tw="w-[90px] h-12 bg-primary text-secondary font-bold rounded-full" onClick={() => setOverlay(false)}>Cancel</button>
                        <button tw="w-[90px] h-12 bg-[#EC5757] text-white font-bold rounded-full" onClick={() => { deleteInvoice(); router.push('/'); }}>Delete</button>
                    </div>
                </Deletion>
            </OutsideAlerter>
            <div tw="bg-primary flex flex-col">
                <Sidebar />
                <EditInvoice editInvoice={editInvoice} setEditInvoice={setEditInvoice} invoiceInfo={invoiceInfo} />
                <Overlay overlay={overlay}>
                    <div tw="flex flex-col ml-auto mr-auto left-0 right-0 w-[327px] tablet:w-[688px] laptop:w-[730px] font-sans pt-8 tablet:pt-12 laptop:pt-16">
                        <div tw="flex flex-row items-center gap-x-6 mb-8">
                            <div><Image src="/assets/icon-arrow-left.svg" width={5} height={9} alt="leftArrow" /></div>
                            <button tw="font-bold" onClick={() => router.back()}>Go Back</button>
                        </div>
                        {/* Tablet and Desktop Only */}
                        <div tw="hidden tablet:flex tablet:flex-row items-center justify-between bg-secondary h-[88px] tablet:px-8 rounded-lg mb-6">
                            <div tw="flex flex-row gap-x-[20px] items-center">
                                <span>Status</span>
                                <StatusBox status={getColor(invoiceInfo.status)} tw="justify-self-end self-center row-start-2 row-span-2 font-bold tablet:row-start-1 tablet:col-start-5"><Circle status={getColor(invoiceInfo.status)} tw="h-2 w-2 rounded-full"></Circle>{invoiceInfo.status}</StatusBox>
                            </div>
                            <div tw="flex flex-row gap-x-2 font-bold text-sm">
                                <button tw="h-12 w-[73px] rounded-full bg-[#F9FAFE] text-[#7E88C3]" onClick={() => setEditInvoice(!editInvoice)}>Edit</button>
                                <button tw="h-12 w-[89px] rounded-full bg-[#EC5757] text-white" onClick={() => { setOverlay(true); }}>Delete</button>
                                <button tw="h-12 w-[131px] rounded-full bg-[#7C5DFA] text-white" disabled={invoiceInfo.status === 'paid'} onClick={() => { markAsPaid(); router.reload(); }}>Mark as Paid</button>
                            </div>
                        </div>
                        {/* Mobile */}
                        <div tw="flex flex-row tablet:hidden items-center justify-between px-8 bg-secondary h-[90px] rounded-lg mb-4">
                            <span>Status</span>
                            <StatusBox status={getColor(invoiceInfo.status)} tw="justify-self-end self-center row-start-2 row-span-2 font-bold tablet:row-start-1 tablet:col-start-5"><Circle status={getColor(invoiceInfo.status)} tw="h-2 w-2 rounded-full"></Circle>{invoiceInfo.status}</StatusBox>
                        </div>
                        <div tw="grid grid-cols-2 grid-rows-[64px_84px_48px_48px_48px_auto_80px] gap-y-12 gap-x-8 tablet:grid-cols-4 tablet:grid-rows-[64px_84px_48px_auto_80px] bg-secondary rounded-lg w-full pt-6 pb-16 px-6 tablet:py-8 tablet:px-8">
                            <div tw="flex flex-col">
                                <div tw="font-bold"><span tw="text-secondary">#</span><span>{invoiceInfo.id}</span></div>
                                <span tw="text-secondary font-medium">{invoiceInfo.description}</span>
                            </div>
                            <div tw="flex flex-col row-start-2 tablet:row-start-1 tablet:col-start-4 text-secondary font-medium tablet:justify-self-end tablet:text-end">
                                <span>{invoiceInfo.senderAddress.street}</span>
                                <span>{invoiceInfo.senderAddress.city}</span>
                                <span>{invoiceInfo.senderAddress.postCode}</span>
                                <span>{invoiceInfo.senderAddress.country}</span>
                            </div>
                            <div tw="flex flex-col col-start-1 row-start-3 tablet:row-start-2">
                                <span tw="text-secondary font-medium mb-2">Invoice Date</span>
                                <span tw="font-bold">{objDate(invoiceInfo.createdAt)}</span>
                            </div>
                            <div tw="flex flex-col col-start-1 row-start-4 tablet:row-start-3">
                                <span tw="text-secondary font-medium mb-2">Payment Due</span>
                                <span tw="font-bold">{objDate(invoiceInfo.paymentDue)}</span>
                            </div>
                            <div tw="flex flex-col col-start-2 row-start-3 row-span-2 tablet:col-start-2 tablet:row-start-2">
                                <span tw="text-secondary font-medium mb-2">Bill To</span>
                                <span tw="font-bold mb-2">{invoiceInfo.clientName}</span>
                                <div tw="flex flex-col text-secondary font-medium">
                                    <span>{invoiceInfo.clientAddress.street}</span>
                                    <span>{invoiceInfo.clientAddress.city}</span>
                                    <span>{invoiceInfo.clientAddress.postCode}</span>
                                    <span>{invoiceInfo.clientAddress.country}</span>
                                </div>
                            </div>
                            <div tw="flex flex-col col-start-1 row-start-5 tablet:row-start-2 tablet:col-start-3">
                                <span tw="text-secondary font-medium mb-2">Sent to</span>
                                <span tw="font-bold">{invoiceInfo.clientEmail}</span>
                            </div>

                            {/* Tablet and Desktop Only Table */}
                            <div tw="hidden tablet:flex tablet:flex-col tablet:row-start-4 tablet:col-span-4 bg-primary pt-8 pb-8 px-8 tablet:gap-y-8 rounded-t-lg overflow-y-scroll">
                                <div tw="text-secondary flex flex-row justify-between">
                                    <span tw="font-medium w-[200px]">Item Name</span>
                                    <span tw="font-medium">QTY.</span>
                                    <span tw="font-medium">Price</span>
                                    <span tw="font-medium">Total</span>
                                </div>
                                {invoiceInfo.items.map((item, i) =>
                                    <div tw="flex flex-row justify-between font-bold" key={i}>
                                        <span tw="w-[200px]">{item.name}</span>
                                        <span tw="text-secondary ml-12">{item.quantity}</span>
                                        <span tw="text-secondary ml-8">{Intl.NumberFormat('en-GB', { style: "currency", currency: 'GBP' }).format(item.price)}</span>
                                        <span tw="">{Intl.NumberFormat('en-GB', { style: "currency", currency: 'GBP' }).format(item.total)}</span>
                                    </div>)}
                            </div>
                            <div tw="hidden tablet:flex flex-row items-center px-8 h-[80px] relative bg-alt tablet:row-start-5 tablet:col-span-4 bottom-12 rounded-b-lg justify-between">
                                <span tw="text-white">Amount Due</span>
                                <span tw="text-white text-3xl font-bold">{Intl.NumberFormat('en-GB', { style: "currency", currency: 'GBP' }).format(invoiceInfo.total)}</span>
                            </div>

                            <div tw="flex flex-col row-start-6 col-span-2 tablet:hidden">
                                {invoiceInfo.items.map((item, i) =>
                                    <div key={i} tw="flex flex-row px-6 py-6 items-center justify-between bg-primary rounded-t-lg">
                                        <div tw="flex flex-col">
                                            <span tw="font-bold">{item.name}</span>
                                            <span tw="font-medium text-secondary">{item.quantity} x {Intl.NumberFormat('en-GB', { style: "currency", currency: 'GBP' }).format(item.price)}</span>
                                        </div>
                                        <div tw="font-bold">{Intl.NumberFormat('en-GB', { style: "currency", currency: 'GBP' }).format(item.total)}</div>
                                    </div>)}
                            </div>
                            <div tw="bg-alt flex flex-row justify-between items-center text-white px-6 py-6 row-start-7 col-span-2 tablet:hidden relative bottom-12 rounded-b-lg">
                                <span>Grand Total</span>
                                <span tw="font-bold text-2xl">{Intl.NumberFormat('en-GB', { style: "currency", currency: 'GBP' }).format(invoiceInfo.total)}</span>
                            </div>
                        </div>

                    </div>
                    {/* Mobile only footer */}
                    <div tw="flex flex-row font-sans place-content-center items-center tablet:hidden fixed bottom-0 w-full gap-x-2 font-bold text-sm bg-secondary h-[90px]">
                        <button tw="h-12 w-[73px] rounded-full bg-[#F9FAFE] text-[#7E88C3]">Edit</button>
                        <button tw="h-12 w-[89px] rounded-full bg-[#EC5757] text-white" onClick={() => { setOverlay(true); }}>Delete</button>
                        router.reload();
                        <button tw="h-12 w-[131px] rounded-full bg-[#7C5DFA] text-white" disabled={invoiceInfo.status === 'paid'} onClick={() => { markAsPaid(); router.reload(); }}>Mark as Paid</button>
                    </div>
                </Overlay>
            </div>
        </div>
    );
};


export const getServerSideProps = async ({ params }) => {
    await dbConnect();

    const invoiceInfo = await Invoice.findById(params.id).lean();
    invoiceInfo._id = invoiceInfo._id.toString();

    return {
        props: {
            invoiceInfo: JSON.parse(JSON.stringify(invoiceInfo))
        }
    };
};
