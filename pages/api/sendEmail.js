import mailjet from "node-mailjet";
// MAILJET_API_KEY=
// MAILJET_SECRET_KEY=

const mailjetClient = mailjet.apiConnect(
  "03a3b0ae14b6f55681f72f58d8cf7797",
  "fbcd2fb5a6f1731daf6e2fc574b50820"
);

export default async function handler(req, res) {
  try {
    const { email, otp } = req.body;

    const result = await mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "fixa@lagbajamobile.com",
            Name: "OTP",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: "Your OTP Code",
          TextPart: `Your OTP code is: ${otp}`,
        },
      ],
    });

    console.log(result.response.data);

    


    res.status(200).json({ success: true, message: "Email sent", result: result.response.data });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.toString() });
  }
}
