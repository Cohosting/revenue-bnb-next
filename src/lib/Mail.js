import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";



const getResultHTML = (id, address, coordinates, name, bedrooms, token) => {


    return ` <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
      <head>
          <!--[if gte mso 9]>
          <xml>
              <o:OfficeDocumentSettings>
                  <o:AllowPNG />
                  <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          <meta http-equiv="content-type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="x-ua-compatible" content="IE=edge">
          <meta name="x-apple-disable-message-reformatting">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=DM+Serif+Display&display=swap" rel="stylesheet">
          <title></title>
          <!--Outlook Fallback Styles-->
          <!--[if gte mso 9]>
          <style type="text/css">
              html{
              font-family: 'Roboto', 'Arial', sans-serif;
              font-family: 'Roboto', 'Times New Roman', serif;
              }
              body{
              font-family: 'Roboto', 'Arial', sans-serif;
              font-family: 'Roboto', 'Times New Roman', serif;
              }
              a,td {
              font-family: 'Roboto', 'Arial', sans-serif;
              font-family: 'Roboto', 'Times New Roman', serif;
              }
          </style>
          <![endif]-->
          <style>
              @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=DM+Serif+Display&display=swap');
              body {
                  font-family: 'Roboto', 'Arial', sans-serif;
                  font-family: 'Roboto', 'Times New Roman', serif;
              }
              h1,
              h2,
              p,
              a {
                  font-family: 'Roboto', 'Arial', sans-serif;
                  font-family: 'Roboto', 'Times New Roman', serif;
                  font-weight: 800;
              }
          </style>
          <style type="text/css" data-premailer="ignore">
              /* What it does: Remove spaces around the email design added by some email clients. */
              /* Beware: It can remove the padding / Margin and add a background color to the compose a reply window. */
              html, body {
              Margin: 0 auto !important;
              padding: 0 !important;
              width: 100% !important;
              height: 100% !important;
              }
              /* What it does: Stops email clients resizing small text. */
              * {
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
              text-rendering: optimizeLegibility;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              }
              /* What it does: Forces Outlook.com to display emails full width. */
              .ExternalClass {
              width: 100%;
              }
              /* What is does: Centers email on Android 4.4 */
              div[style*="Margin: 16px 0"] {
              Margin:0 !important;
              }
              /* What it does: Stops Outlook from adding extra spacing to tables. */
              table,
              th {
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              }
              /* What it does: Fixes Outlook.com line height. */
              .ExternalClass,
              .ExternalClass * {
              line-height: 100% !important;
              }
              /* What it does: Fixes Outlook.com line height. */
              .ExternalClass * {
              line-height: 100% !important;
              }
              /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
              table {
              border-spacing: 0 !important;
              border-collapse: collapse !important;
              border: none;
              Margin: 0 auto;
              direction: ltr;
              }
              div[style*="Margin: 16px 0"] {
              Margin:0 !important;
              }
              /* What it does: Uses a better rendering method when resizing images in IE. */
              img {
              -ms-interpolation-mode:bicubic;
              }
              /* What it does: Overrides styles added when Yahoo's auto-senses a link. */
              .yshortcuts a {
              border-bottom: none !important;
              }
              /* What it does: Overrides blue, underlined link auto-detected by iOS Mail. */
              /* Create a class for every link style needed; this template needs only one for the link in the footer. */
              /* What it does: A work-around for email clients meddling in triggered links. */
              *[x-apple-data-detectors],  /* iOS */
              .x-gmail-data-detectors,    /* Gmail */
              .x-gmail-data-detectors *,
              .aBn {
              border-bottom: none !important;
              cursor: default !important;
              color: inherit !important;
              text-decoration: none !important;
              font-size: inherit !important;
              font-family: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              }
              *[class="hide"] {
              max-height:0; /* Gmail*/
              display:none; /* Generic*/
              mso-hide:all; /* Outlook clients*/
              overflow:hidden; /* Generic */
              } 
              /* What it does: Overrides blue, underlined link auto-detected by Gmail. */
              u   #body a {
              color: inherit;
              text-decoration: none;
              font-size: inherit;
              font-family: inherit;
              font-weight: inherit;
              line-height: inherit;
              }
              /* What it does: Prevents Gmail from displaying an download button on large, non-linked images. */
              .a6S {
              display: none !important;
              opacity: 0.01 !important;
              }
              /* If the above doesn't work, add a .g-img class to any image in question. */
              img.g-img   div {
              display:none !important;
              }
              /* What it does: Prevents underlining the button text in Windows 10 */
              a,
              a:link,
              a:visited {
              color: #384251;
              text-decoration: none !important;
              }
              @media only screen and (max-width: 480px) {
              table#canspamBar td {
              font-size:14px !important;
              }
              table#canspamBar td a {
              display:block !important;
              margin-top:10px !important;
              }
              /* Targets Gmail */
              u ~ div .full-wrap {width:100% !important; min-width:auto !important; }
  
              u ~ div .full-image-container {width: 100% !important; display: block !important; height:auto !important; max-width:100% !important; }

              u ~ div .zero-padding { padding-top: 0px !important; }

              /* Targets Gmail on Android */
              div > u ~ div .full-wrap {width:100% !important; min-width:auto !important; }

              div > u ~ div .full-image-container {width: 100% !important; display: block !important; height:auto !important; max-width:100% !important; }

              div > u ~ div .zero-padding { padding-top: 0px !important; }

              /* General Styles */
              .full-wrap {width:100% !important; min-width:auto !important; }

              .full-image-container {width: 100% !important; display: block !important; height:auto !important; max-width:100% !important; }

              .zero-padding { padding-top: 0px !important; }
              }
          </style>
      </head>
      <body id="body" bgcolor="#E9E9E9" style="height:100% !important;margin:0 !important;padding:0 !important;width:100% !important;">
              <!-- PRE-HEADER STARTS -->
              <span style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Hello %%first_name%%, Review your results for your ${bedrooms} Bedroom Vacation Rental</span>
              <span style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
                  <!--EOA COMMENT: This snippet of white space has been added to ensure short preview text does not run into the following text of your email.-->
              &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</span>
           <center class="wrapper zero-padding"  style="background-color: #e9e9e9;width: 100%;padding-top: 20px;padding-bottom: 20px;table-layout: fixed;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%">
              <div class="webkit" style="Margin: 0 auto;max-width: 600px">
                  <table align="center" bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" class="full-wrap" role="presentation" style="width: 600px; max-width: 600px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;background-color: #FFFFFF; background: #FFFFFF;" width="600">
                      <tbody>
                          <tr>
                              <td align="center">
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="full-wrap" role="presentation" style="width: 600px; max-width: 600px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" width="600">
                                      <tbody>
                                          <tr>
                                              <td align="center" class="mobile-padding" style="padding-bottom: 34px; padding-top: 34px; padding-right: 10px; padding-left:10px;">
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;" width="100%">
                                                      <tbody>
                                                          <tr align="center">
                                                              <td align="center" style=" mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; padding-bottom: 15px;" valign="middle">
                                                                  <img align="absbottom" alt="" border="0" src="https://firebasestorage.googleapis.com/v0/b/price-prediction-52b23.appspot.com/o/Test%2FPath_3.png?alt=media&token=abacea80-4b9e-4745-92b9-d62d15a36fba" style="width: 31px; display: block; vertical-align:middle; border:0; height:auto;padding: 0px; margin: 0px;" width="31">
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td align="center" data-editable="standard" style="font-size: 16px; line-height: 20px; mso-line-height-rule: exactly; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; color: #000000; font-style: normal; text-align: center; font-weight: 400; font-family: 'Roboto', 'Arial', sans-serif; padding-top: 10px; " valign="middle">
                                                                  Hello ${name}
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td align="center" data-editable="standard" style="font-size: 28px; line-height: 32px; mso-line-height-rule: exactly; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; color: #000000; font-style: normal; text-align: center; font-weight: 400; font-family: 'Roboto', 'Times New Roman', sans-serif; padding-bottom: 8px; padding-top: 8px; " valign="middle">
                                                                  Thank You for using RevenueBnb
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td align="center" data-editable="standard" style="font-size: 15px; line-height: 18px; mso-line-height-rule: exactly; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; color: #6B6B6B; font-style: normal; text-align: center; font-weight: 400; font-family: 'Roboto', 'Times New Roman', sans-serif;padding-bottom: 10px; " valign="middle">
                                                                  Review your results for your 3 Bedroom Vacation Rental
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td align="center" style="font-size: 16px; line-height: 18px; mso-line-height-rule: exactly; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; color: #22D3D3; font-style: normal; text-align: center; font-weight: 300; font-family: 'Roboto', 'Times New Roman', sans-serif;" valign="middle">
                                                                  <a href="#" style="color: #22D3D3!important; text-decoration: none !important" target="_blank"><span style="color: #22D3D3;">View Results &#10140;</span></a>
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td align="center" style="padding-bottom: 30px;  padding-top: 15px;">
                                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="full-wrap" style="font-family: sans-serif;border-spacing: 0;border-collapse: separate !important;mso-table-lspace: 0pt;mso-table-rspace: 0pt;width: 400px;background-color: #FFFAFA;" width="400">
                                                                      <tbody>
                                                                          <tr>
                                                                              <th style="background-color: #FFFAFA; padding: 0px;background-color: #FFFAFA; border: 1px solid #E5E5E5; border-radius: 20px; padding-right: 10px; padding-left: 10px;">
                                                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" height="60" style="height: 20px;text-align: center;Margin: 0 auto;font-family: sans-serif;border-spacing: 0;border: none;border-collapse: separate !important;mso-table-lspace: 0pt;mso-table-rspace: 0pt;max-width: 100%;" width="100%">
                                                                                      <tbody>
                                                                                          <tr>
                                                                                              <td align="center" style="height: 20px;text-align: center;border-radius: 20px;">
                                                                                                  <div>
                                                                                                      <a href="${window.location.origin}/verify/${token}" style=" color: #012333; display: inline-block; font-size: 12px; line-height: 14px; text-align: center; text-decoration: none; -webkit-text-size-adjust: none; font-weight: 700; font-family: 'Roboto', 'Arial', sans-serif;text-decoration: none;"><span style="color:#6B6B6B; text-decoration: none ;border-radius: 20px;">${window.location.origin}/verify/${token}</span></a>
                                                                                                  </div>
                                                                                              </td>
                                                                                          </tr>
                                                                                      </tbody>
                                                                                  </table>
                                                                              </th>
                                                                          </tr>
                                                                      </tbody>
                                                                 </table>
                                                              </td>
                                                          </tr>
                                                          <tr align="center">
                                                              <td align="center" style=" mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" valign="middle">
                                                                  <img class="full-image-container" align="absbottom" alt="" border="0" src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${coordinates[0]},${coordinates[1]},14.25,0/518x230?access_token=pk.eyJ1IjoiaGltZWwxMjYiLCJhIjoiY2wxZ2FoeHM4MDd2OTNyb3JlcHZub3R4biJ9.iXUC5niBfA83FT2MYlWvpg" style="border-radius: 20px;display: block; vertical-align:middle; border:0; height:auto;padding: 0px; margin: 0px; width: 520px;" width="520">
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td align="center" style="padding-bottom: 20px;  padding-top: 15px;">
                                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="full-wrap" style="font-family: sans-serif;border-spacing: 0;border-collapse: separate !important;mso-table-lspace: 0pt;mso-table-rspace: 0pt;width: 340px;background-color: #FFFFFF; border-radius: 12px;" width="340">
                                                                      <tbody>
                                                                          <tr>
                                                                              <th style=" padding: 0px;background-color: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 12px; padding-right: 10px; padding-left: 10px;">
                                                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" height="45" style="height: 45px;text-align: center;Margin: 0 auto;font-family: sans-serif;border-spacing: 0;border: none;border-collapse: separate !important;mso-table-lspace: 0pt;mso-table-rspace: 0pt;max-width: 100%;" width="100%">
                                                                                      <tbody>
                                                                                          <tr>
                                                                                              <td width="20" align="left" style=" mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; width: 20px; max-width: 20px;" valign="middle">
                                                                                                  <img align="absbottom" alt="" border="0" src="img/icon-feather.png" style="width: 14px; display: block; vertical-align:bottom; border:0; height:auto; padding: 0px; margin: 0px;" width="14">
                                                                                              </td>
                                                                                              <td align="center" style="text-align: center;border-radius: 20px;font-size: 14px; line-height: 18px; mso-line-height-rule: exactly; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; color: #6B6B6B; font-style: normal; text-align: left; font-weight: 400; font-family: 'Roboto', 'Arial', sans-serif;">
                                                                                                 ${address}
                                                                                              </td>
                                                                                          </tr>
                                                                                      </tbody>
                                                                                  </table>
                                                                              </th>
                                                                          </tr>
                                                                      </tbody>
                                                                 </table>
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td align="center" style="padding-bottom: 60px;  padding-top: 15px;">
                                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="full-wrap" style="font-family: sans-serif;border-spacing: 0;border-collapse: separate !important;mso-table-lspace: 0pt;mso-table-rspace: 0pt;width: 400px;background-color: #009DAE;border-radius: 24px;" width="400">
                                                                      <tbody>
                                                                          <tr>
                                                                              <th style=" padding: 0px;background-color: #009DAE; border-radius: 16px; padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 15px;">
                                                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" height="45" style="height: 45px;text-align: center;Margin: 0 auto;font-family: sans-serif;border-spacing: 0;border: none;border-collapse: separate !important;mso-table-lspace: 0pt;mso-table-rspace: 0pt;max-width: 100%;" width="100%">
                                                                                      <tbody>
                                                                                          <tr>
                                                                                              <td align="center" style="font-size: 14px; line-height: 16px; mso-line-height-rule: exactly; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; color: #FFFFFF; font-style: normal; text-align: center; font-weight: 400; font-family: 'Roboto', 'Arial', sans-serif; padding-bottom: 5px; " valign="middle">
                                                                                                  Review your results with one of our
                                                                                              </td>
                                                                                          </tr>
                                                                                          <tr>
                                                                                              <td align="center" style="font-size: 22px; line-height: 26px; mso-line-height-rule: exactly; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; color: #FFFFFF; font-style: normal; text-align: center; font-weight: 700; font-family: 'Roboto', 'Arial', sans-serif; padding-bottom: 5px; " valign="middle">
                                                                                                  Vacation Rental Expert
                                                                                              </td>
                                                                                          </tr>
                                                                                          <tr>
                                                                                              <td align="center" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" valign="center">
                                                                                                  <table align="center" bgcolor="#000000" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: separate !important;background-color: #000000; background: #000000; mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;border-radius: 20px">
                                                                                                      <tbody>
                                                                                                          <tr>
                                                                                                              <th bgcolor="#000000" align="center" style="width: 150px; mso-padding-alt: 0px 12px 0px 12px; height: 38px;border-radius: 20px" valign="middle" width="150">
                                                                                                                  <a href="#" style="text-decoration: none; color: #FFFFFF; display: block!important; font-size: 12px; line-height: 22px; mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; font-family: 'Roboto', 'Arial', sans-serif; text-align: center;word-break: keep-all; font-weight: 700;padding: 8px 10px 8px 10px; background-color: #000000; border-radius: 20px">
                                                                                                                  <span style="text-decoration: none !important; color: #FFFFFF;">Schedule a call</span>
                                                                                                                  </a>
                                                                                                              </th>
                                                                                                          </tr>
                                                                                                      </tbody>
                                                                                                  </table>
                                                                                              </td>
                                                                                          </tr>
                                                                                      </tbody>
                                                                                  </table>
                                                                              </th>
                                                                          </tr>
                                                                      </tbody>
                                                                 </table>
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td align="center" data-editable="standard" style="font-size: 12px; line-height: 14px; mso-line-height-rule: exactly; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; color: #6B6B6B; font-style: normal; text-align: center; font-weight: 400; font-family: 'Roboto', 'Arial', sans-serif;" valign="middle">
                                                                  Copyright (C) 2022 RevenueBnb. All rights reserved.
                                                                  <br />
                                                                  You are receiving this email as a user of RevenueBnb with your search results
                                                                  <br /><br />
                                                                  Our mailing address is:
                                                                  <br />
                                                                  26 E 630 S, La Verkin, UT, 84745
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </center>
      </body>
      </html>`;
}



export const sentResultMail = async (id, address, coordinates, email, name, bedrooms, token) => {
  const ref = collection(db, 'mail')

  await addDoc(ref, {
    to: email,
    message: {
      subject: "Here is your result!",
        html: getResultHTML(id, address, coordinates, name, bedrooms, token)

        }
    })

}

