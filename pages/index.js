import React, { useState } from 'react';
import tw from 'twin.macro';
import { ShowInvoice } from "../components/ShowInvoice";
import { Sidebar } from "../components/Sidebar/Sidebar";
import Head from "next/head";
import { NewInvoice } from "../components/NewInvoice";
import dbConnect from "../lib/dbConnect";
import Invoice from "../models/invoice.model";


const IndexPage = ({ data }) => {
  const [newInvoice, setNewInvoice] = useState(false);

  return (
    <div>
      <Head>
        <title>Invoice</title>
      </Head>
      <main>
        <div tw="bg-primary flex flex-col">
          <Sidebar />
          <NewInvoice newInvoice={newInvoice} setNewInvoice={setNewInvoice} />
          <div tw="ml-auto mr-auto left-0 right-0">
            <ShowInvoice data={data} newInvoice={newInvoice} setNewInvoice={setNewInvoice} />
          </div>
        </div>
      </main>
    </div>
  );
};


export async function getServerSideProps() {
  await dbConnect();

  /* find all the data in our database */
  const result = await Invoice.find({});
  console.log(result);


  const invoiceInfo = result.map((doc) => {
    const invoice = doc.toObject();
    invoice._id = invoice._id.toString();
    return invoice;
  });

  return { props: { data: JSON.parse(JSON.stringify(invoiceInfo)) } };
}

export default IndexPage;
