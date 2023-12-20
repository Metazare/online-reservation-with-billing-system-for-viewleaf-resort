import React, { useState } from 'react';
import axios from './useAxios'

interface Data {
  sendSMS: (data: SendSMSData ) => void;
}

interface SendEmailData {
  email: string,
  subject: string,
  content: string
}

interface SendSMSData {
  phone: string,
  content: string
}

function useSMS(): Data {
  const sendEmail = async (data: SendEmailData) => {
    try {
      await axios
      .post('/emails', {
        to: data.email,
        subject: data.subject,
        content: data.content
      })
      .then((response:any)=>{
        console.log(response.data);
      });
    } catch (error: any) {
      alert(error?.response?.data?.error ?? "Error sending email. Please try again later,");
    }
  }

  const sendSMS = async (data: SendSMSData) => {
    try {
      await axios
      .post('/sms', {
        phone: data.phone,
        content: data.content
      })
      .then((response:any)=>{
        console.log(response.data);
      });
    } catch (error: any) {
      console.log(error);
      alert(error?.response?.data?.error ?? "Error sending sms. Please try again later,");
    }
  }

  return { 
    sendSMS
  };
}

export default useSMS;