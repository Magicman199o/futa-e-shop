import React, { useState } from "react";
import { PinInput, PinInputField, HStack, Box, Button } from "@chakra-ui/react";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { useRouter } from "next/router";

const Payment = () => {
  const [enteredOTP, setEnteredOTP] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const router = useRouter();

  const handleOTPChange = (value: React.SetStateAction<string>) => {
    setEnteredOTP(value);
    console.log(enteredOTP)
  };

  const backToHome = () => {
    router.push("/")
  }

  const handlePayment = async () => {
    const storedDetails = JSON.parse(localStorage.getItem("userDetails")!);

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
      {isPaymentSuccessful ? 
      <Box>
        <h3>
        Thank you for your patronage! Check your email for the reciept and Order No.
        </h3>
        <Button
        colorScheme="yellow"
        size="lg"
        width="auto"
        onClick={backToHome}
      >
        Go Back to Shopping
      </Button>
      </Box> : <>
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
        Pay
      </Button>
      </>
}
    </Box>
    </>
    
  );
};

export default Payment;
