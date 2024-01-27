import React, { useState } from "react";
import { PinInput, PinInputField, HStack, Box, Button } from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payment = () => {
  const [enteredOTP, setEnteredOTP] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const handleOTPChange = (value) => {
    setEnteredOTP(value);
  };

  const handlePayment = async () => {
    const storedDetails = JSON.parse(localStorage.getItem("userDetails"));

    try {
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: storedDetails.email,
          orderNumber: storedDetails.otp,
          orderDate: new Date().toISOString(),
          totalAmount: storedDetails.priceTotal,
          name: storedDetails.firstName,
          address: storedDetails.address,
          city: storedDetails.city,
          postalCode: storedDetails.postalCode,
          country: storedDetails.country,
          phone: storedDetails.phoneNumber,
          cardType: "MasterCard",
          cardNumber: storedDetails.cardNumber,
          expirationDate: storedDetails.expirationDate,
        }),
      });

      if (response) {
        const result = await response.json();
        if (result.success) {
          setIsPaymentSuccessful(true);
          toast.success("Payment successful!");
        } else {
          console.error("Payment failed. Please try again.");
        }
      } else {
        console.error("Error verifying payment:", response.statusText);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        height="100vh"
        alignItems="center"
        justifyContent="center"
        style={{ padding: "4%" }}
      >
        <h1>Enter OTP:</h1>
        <HStack>
          <PinInput otp onChange={(value) => handleOTPChange(value)}>
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>

        <Button
          colorScheme="yellow"
          size="lg"
          width="auto"
          onClick={handlePayment}
          disabled={isPaymentSuccessful}
        >
          { "Pay"}
        </Button>
      </Box>
    </>
  );
};

export default Payment;
