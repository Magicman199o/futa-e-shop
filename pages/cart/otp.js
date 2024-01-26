import React, { useState } from "react";
import { PinInput, PinInputField, HStack, Box, Button } from "@chakra-ui/react";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const Payment = () => {
  const [enteredOTP, setEnteredOTP] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const handleOTPChange = (value) => {
    setEnteredOTP(value);
  };

  const handlePayment = async () => {
    const storedDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (!storedDetails) {
      toast.warning("User details not found. Please try again.");
      return;
    }

    
    const isValidEmail = /\S+@\S+\.\S+/.test(storedDetails?.email);

    if (!isValidEmail) {
      toast.warning("Invalid email address. Please provide a valid email.");
      return;
    }

    try {
      const sanitizedDetails = { email: storedDetails?.email };

      const response = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...sanitizedDetails,
          orderDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setIsPaymentSuccessful(true);
          toast.success("Payment successful!");
        } else {
          toast.success("Payment failed. Please try again.");
        }
      } else {
        console.error("Error verifying payment:", response.statusText);
        toast.success("Payment successful!")
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.success("Error verifying payment. Please try again.");
    }
  };

  return (
    <>
    <ToastContainer/>
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
        {isPaymentSuccessful ? "Payment Successful" : "Pay"}
      </Button>
    </Box>
    </>
    
  );
};

export default Payment;
