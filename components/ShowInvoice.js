import Image from "next/image";
import Link from "next/link";
import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import OutsideAlerter from "../hooks/useOutsideAlerter";

const Filter = styled.div`
    ${({ filterDropdown }) => (filterDropdown ? `visibility:visible;` : `visibility: hidden`)};
`;

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


const getColor = (status) => {
    if (status == "paid") return '(51, 214, 159';
    else if (status == "pending") return '(255, 143, 0';
    else return '(55, 59, 83';
};

const objDate = (date) => {
    return new Date(date).toLocaleString("en-uk", { day: 'numeric', month: "short", year: 'numeric' });
};

export const ShowInvoice = ({ data, newInvoice, setNewInvoice }) => {
    const [filterDropdown, setFilterDropdown] = useState(false);
    const [checkbox, setCheckbox] = useState({ draft: true, pending: true, paid: true });

    const onChangeCheckbox = (e) => {
        const { value, checked } = e.target;

        setCheckbox({ ...checkbox, [value]: checked });
        console.log(checkbox);
    };


    const getFilteredResult = (data, checkbox) => {
        const filteredCheckbox = Object.keys(checkbox).reduce((p, c) => {
            if (checkbox[c]) p[c] = checkbox[c];
            return p;
        }, {});

        const checkboxCopy = Object.keys(filteredCheckbox);

        const filtered = data.filter(invoice => checkboxCopy.includes(invoice.status));

        return filtered.sort((a, b) => {
            return checkboxCopy.indexOf(a.status) - checkboxCopy.indexOf(b.status);
        });
    };

    const numberOfInvoices = (data, checkbox) => {
        const { draft, pending, paid } = checkbox;
        if (data.length === 0 || !data) return "No";
        else if (draft === true && pending === false && paid === false) return `There are ${getFilteredResult(data, checkbox).length} draft`;
        else if (pending === true && draft === false && paid === false) return `There are ${getFilteredResult(data, checkbox).length} pending`;
        else if (paid === true && draft === false && pending === false) return `There are ${getFilteredResult(data, checkbox).length} paid`;
        else return `There are ${data.length} total`;
    };

    return (
        <div tw="flex flex-col font-sans gap-y-4 w-[327px] tablet:w-[672px] laptop:w-[730px] pt-8 tablet:pt-16 laptop:pt-20">
            <div tw="flex flex-row justify-between mb-8 tablet:mb-[55px] laptop:mb-16">
                <div tw="flex flex-col">
                    <span tw="font-bold text-2xl tablet:text-3xl">Invoices</span>
                    <span tw="tablet:hidden font-medium text-sm text-tertiary"> invoices</span>
                    <span tw="hidden tablet:block font-medium text-sm text-tertiary">{numberOfInvoices(data, checkbox)} invoices</span>
                </div>
                <div tw="flex flex-row items-center gap-x-[18px]">
                    <div tw="flex flex-col">
                        <div tw="flex flex-row gap-x-3 items-center" onClick={() => setFilterDropdown(!filterDropdown)}>
                            <span tw="tablet:hidden font-bold">Filter</span>
                            <span tw="hidden tablet:block font-bold">Filter by status</span>
                            {filterDropdown ? <div tw="w-[11px] h-[7px] rotate-180"><Image src="/assets/icon-arrow-down.svg" width={11} height={7} alt="arrowDown" /></div> : <div tw="w-[11px] h-[7px]"><Image src="/assets/icon-arrow-down.svg" width={11} height={7} alt="arrowUp" /></div>}
                        </div>
                        <OutsideAlerter setFunction={setFilterDropdown}>
                            <Filter filterDropdown={filterDropdown} tw="absolute flex flex-col font-bold top-[162px] laptop:top-[132px] w-[192px] h-[128px] bg-secondary rounded-lg px-6 py-6">
                                <div>
                                    <input type="checkbox" id="draft" name="status" value="draft" checked={checkbox.draft} onChange={onChangeCheckbox} tw="accent-[#7C5DFA] h-4 w-4" />
                                    <label htmlFor="draft"> Draft</label>
                                </div>
                                <div>
                                    <input type="checkbox" id="pending" name="status" value="pending" checked={checkbox.pending} onChange={onChangeCheckbox} tw="accent-[#7C5DFA] h-4 w-4" />
                                    <label htmlFor="pending"> Pending</label>
                                </div>
                                <div>
                                    <input type="checkbox" id="paid" name="status" value="paid" checked={checkbox.paid} onChange={onChangeCheckbox} tw="accent-[#7C5DFA] h-4 w-4" />
                                    <label htmlFor="paid"> Paid</label>
                                </div>
                            </Filter>
                        </OutsideAlerter>
                    </div>
                    <div tw="font-sans font-bold text-white text-sm flex flex-row tablet:hidden bg-[#7C5DFA] w-[90px] h-[44px] rounded-full items-center">
                        <div tw="flex flex-row w-8 h-8 bg-white rounded-full ml-2 mr-2 items-center justify-center">
                            <Image src="/assets/icon-plus.svg" width={10} height={10} alt="plusIcon" />
                        </div>
                        <button onClick={() => setNewInvoice(prev => !prev)}>New</button>
                    </div>
                    <div tw="font-sans font-bold text-white text-sm flex flex-row hidden tablet:flex bg-[#7C5DFA] w-[150px] h-[44px] rounded-full items-center">
                        <div tw="flex flex-row w-8 h-8 bg-white rounded-full ml-2 mr-4 items-center justify-center">
                            <Image src="/assets/icon-plus.svg" width={10} height={10} alt="plusIcon" />
                        </div>
                        <button onClick={() => setNewInvoice(prev => !prev)}>New Invoice</button>
                    </div>
                </div>
            </div>
            {data && getFilteredResult(data, checkbox).map(invoice =>
                <Link href={`/invoices/${invoice._id}`} tw="self-center"><div tw="w-full h-[134px] tablet:h-[72px] px-6 py-6 grid grid-cols-2 grid-rows-3 tablet:grid-rows-1 tablet:grid-cols-[100px_120px_140px_120px_120px_50px] laptop:grid-cols-[100px_120px_200px_120px_120px_50px] tablet:justify-items-center font-sans bg-secondary text-sm" key={invoice.id}>
                    <div tw="font-bold tablet:mr-7">#{invoice.id}</div>
                    <div tw="row-start-2 col-start-1 tablet:col-start-2 tablet:row-start-1 text-tertiary">Due {objDate(invoice.paymentDue)}</div>
                    <div tw="row-start-3 col-start-1 text-primary font-bold tablet:row-start-1 tablet:col-start-4">{Intl.NumberFormat('en-GB', { style: "currency", currency: 'GBP' }).format(invoice.total)}</div>
                    <div tw="text-secondary tablet:col-start-3">{invoice.clientName}</div>
                    <StatusBox status={getColor(invoice.status)} tw="justify-self-end self-center row-start-2 row-span-2 font-bold tablet:row-start-1 tablet:col-start-5"><Circle status={getColor(invoice.status)} tw="h-2 w-2 rounded-full"></Circle>{invoice.status}</StatusBox>
                    <Image src="/assets/icon-arrow-right.svg" alt="arrowRight" width={4} height={8} />
                </div>
                </Link>)}
            {(!data) || data.length === 0 &&
                <div tw="flex flex-col w-full h-full place-items-center mt-16">
                    <Image tw="mb-16" src="/assets/illustration-empty.svg" width={241} height={200} alt="emptyIllustration" />
                    <span tw="font-bold text-3xl mb-6">There is nothing here</span>
                    <span tw="w-[240px] text-center text-tertiary">  Create an invoice by clicking the
                        New Invoice button and get started</span>
                </div>}
        </div>
    );
};


