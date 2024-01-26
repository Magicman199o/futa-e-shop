import mailjet from "node-mailjet";
// MAILJET_API_KEY=
// MAILJET_SECRET_KEY=

const mailjetClient = mailjet.apiConnect(
  "03a3b0ae14b6f55681f72f58d8cf7797",
  "fbcd2fb5a6f1731daf6e2fc574b50820"
);

export default async function handler(req, res) {
  try {
    const {
      email,
      otp,
      orderNumber,
      orderDate,
      totalAmount,
      name,
      address,
      city,
      postalCode,
      country,
      phone,
      cardType,
      cardNumber,
      expirationDate,
    } = req.body;

    const request = mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "fixa@lagbajamobile.com",
            Name: "Payement details",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: "Order Confirmation - Futa-e-shop",
          TextPart: `
              Dear Customer,
  
              Thank you for your purchase with Your Futa-e-shop. Your order has been successfully processed, and we are excited to share the details with you.
  
              Order Summary:
              --------------------
              Order Number: ${orderNumber}
              Date: ${orderDate}
              Total Amount: ${totalAmount}
  
              Shipping Information:
              --------------------
              Name: ${name}
              Address: ${address}
              City: ${city}
              Postal Code: ${postalCode}
              Country: ${country}
              Phone: ${phone}
  
              Payment Details:
              --------------------
              Card Type: ${cardType}
              Card Number: ${cardNumber}
              Expiration Date: ${expirationDate}
  
             
  
              Thank you for choosing Your Futa-e-shop. If you have any questions or concerns, please don't hesitate to contact our customer support.
  
              Best Regards,
              Futa-e-shop
            `,
        },
      ],
    });

    // Execute the Mailjet request
    const result = await request;

    res.status(200).json({ success: true, message: "Email sent", result });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.toString() });
  }
}
