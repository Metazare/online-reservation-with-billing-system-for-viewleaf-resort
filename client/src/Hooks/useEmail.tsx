import React, { useState } from 'react';
import axios from './useAxios'

interface Data {
  sendEmail: (data: SendEmailData ) => void;
  sendReservation: (data: SendEmailData) => void;
}

interface SendEmailData {
  email: string,
  subject: string,
  content: string
}

function useEmail(): Data {

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
      console.log(error)
      alert(error?.response?.data?.error ?? "Error sending email. Please try again later,");
    }
  }

  const sendOtp = async (data: SendEmailData) => {
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
      console.log(error);
    }
  }

  const sendReservation = async (data: any) => {
    console.log(data)
    try {
      await axios
      .post('/emails', {
        to: data.email,
        subject: data.subject,
        content: reservationDetails(data)
      })
      .then((response:any)=>{
        console.log(response.data);
      });
    } catch (error: any) {
      console.log(error);
    }
  }

  const reservationDetails = (data: any) => {
    return `
      <html lang="en">
        <body style="
            background-color: #ffffff;
            margin: 0 auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        ">
          <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto">
            <tr style="width: 100%">
              <td>
                <table style="margin-top: 32px" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                    <tbody></tbody>
                </table>
                <h1 style="color: #1d1c1d; font-size: 36px; font-weight: 700; margin: 30px 0; padding: 0; line-height: 42px">VIEW LEAF RESERVATION DETAILS</h1>
                <p style="font-size: 20px; line-height: 28px; margin: 16px 0; margin-bottom: 30px">The details of your reservation are as follows:</p>
                <table style="background: rgb(245, 244, 245); border-radius: 4px; margin-right: 50px; margin-bottom: 30px; padding: 43px 23px"
                  align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td>
                        <p style="font-size: 20px; line-height: 24px; margin: 16px 0; text-align: center; vertical-align: middle">
                          Reservation Number: ${data?.reservationId}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="font-size: 20px; line-height: 24px; margin: 16px 0; text-align: center; vertical-align: middle">
                          Reservation Date: ${data?.schedule}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="font-size: 20px; line-height: 24px; margin: 16px 0; text-align: center; vertical-align: middle">
                          Reservation Status: ${data?.status}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="font-size: 20px; line-height: 24px; margin: 16px 0; text-align: center; vertical-align: middle">
                          ${JSON.stringify(data)}
                        </p>
                      </td>
                    </tr>

                  </tbody>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  }

  

  return { 
    sendEmail,
    sendReservation
  };
}

export default useEmail;