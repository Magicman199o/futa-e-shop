import Layout from "../../layouts/Main";
import { useSelector } from "react-redux";
import CheckoutStatus from "../../components/checkout-status";
import CheckoutItems from "../../components/checkout/items";
import { RootState } from "store";
import { useEffect, useState } from "react";
import { SimpleGrid, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const priceTotal = useSelector((state: RootState) => {
    const cartItems = state.cart.cartItems;
    let totalPrice = 0;
    if (cartItems.length > 0) {
      cartItems.map((item) => (totalPrice += item.price * item.count));
    }

    return totalPrice;
  });

  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    email: "",
    address: "",
    firstName: "",
    lastName: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    country: "Nigeria",
    cardNumber: "",
    cardHolderName: "",
    expirationDate: "",
    cvv: "",
  });

  const [otp, setOtp] = useState("");

  const generateRandomOTP = () => {
    const length = 6;
    const characters = "0123456789";
    let otp = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters.charAt(randomIndex);
    }

    return otp;
  };

  const handleGenerateOtp = () => {
    const generatedOtp = generateRandomOTP();
    setOtp(generatedOtp);
    return generatedOtp;
  };

  useEffect(() => {
    const generatedOtp = handleGenerateOtp();
    console.log("Generated OTP:", generatedOtp);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo) => ({ ...prevUserInfo, [name]: value }));
  };

  const handleContinueToPayment = async () => {
    try {
      const allUserDetails = { ...userInfo, otp, priceTotal };

      localStorage.setItem("userDetails", JSON.stringify(allUserDetails));

      console.log("Collected User Information:", { ...userInfo, otp });
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userInfo.email, otp }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        toast.success(result.message)
        router.push("/cart/otp")
      } else {
        console.error("Error sending email:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending email");
    }
  };

  return (
    <Layout>
      <section className="cart">
        <div className="container">
          <div className="cart__intro">
            <h3 className="cart__title">Shipping and Payment</h3>
            <CheckoutStatus step="checkout" />
          </div>

          <div className="checkout-content">
            <div className="checkout__col-6">
              

              <div className="block">
                <h3 className="block__title">Shipping information</h3>
                <form className="form">
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        name="email"
                        onChange={handleInputChange}
                        value={userInfo.email}
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Email"
                      />
                    </div>

                    <div className="form__col">
                      <input
                        name="address"
                        onChange={handleInputChange}
                        value={userInfo.address}
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Address"
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        name="firstName"
                        onChange={handleInputChange}
                        value={userInfo.firstName}
                        type="text"
                        placeholder="First name"
                      />
                    </div>

                    <div className="form__col">
                      <input
                        name="city"
                        onChange={handleInputChange}
                        value={userInfo.city}
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="City"
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        name="lastName"
                        onChange={handleInputChange}
                        value={userInfo.lastName}
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Last name"
                      />
                    </div>

                    <div className="form__col">
                      <input
                        name="postalCode"
                        onChange={handleInputChange}
                        value={userInfo.postalCode}
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Postal code / ZIP"
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        name="phoneNumber"
                        onChange={handleInputChange}
                        value={userInfo.phoneNumber}
                        type="text"
                        placeholder="Phone number"
                      />
                    </div>

                    <div className="form__col">
                      <div className="select-wrapper select-form">
                        <select
                          name="country"
                          value={userInfo.country}
                          onChange={handleInputChange}
                        >
                          <option>Country</option>
                          <option value="Nigeria">Nigeria</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="checkout__col-4">
              <div className="block">
                <h3 className="block__title">Payment method</h3>
                <ul className="round-options round-options--three">
                  <li className="round-item">
                    <img src="/images/logos/paypal.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/visa.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/mastercard.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/maestro.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/discover.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/ideal-logo.svg" alt="Paypal" />
                  </li>
                </ul>
              </div>

              {/* <div className="block">
                <h3 className="block__title">Delivery method</h3>
                <ul className="round-options round-options--two">
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/inpost.svg" alt="Paypal" />
                    <p>N20.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/dpd.svg" alt="Paypal" />
                    <p>N12.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/dhl.svg" alt="Paypal" />
                    <p>N15.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/maestro.png" alt="Paypal" />
                    <p>N10.00</p>
                  </li>
                </ul>
              </div> */}
              <div className="block">
                <h3 className="block__title">Add card details</h3>
                <form className="form">
                  <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="20px" my={4}>
                    <Input
                      placeholder="Card Number"
                      name="cardNumber"
                      value={userInfo.cardNumber}
                      borderRadius={100}
                      onChange={handleInputChange}
                    />

                    <Input
                      placeholder="Card Holder Name"
                      name="cardHolderName"
                      value={userInfo.cardHolderName}
                      borderRadius={100}
                      onChange={handleInputChange}
                    />

                    <Input
                      placeholder="MM/YY"
                      name="expirationDate"
                      pattern="\d{2}/\d{2}"
                      title="Enter a valid MM/YY date"
                      value={userInfo.expirationDate}
                      onChange={handleInputChange}
                      borderRadius={100}
                    />
                    <Input
                      placeholder="CVV"
                      name="cvv"
                      value={userInfo.cvv}
                      borderRadius={100}
                      onChange={handleInputChange}
                    />
                  </SimpleGrid>
                </form>
              </div>
            </div>

            <div className="checkout__col-2">
              <div className="block">
                <h3 className="block__title">Your cart</h3>
                <CheckoutItems />

                <div className="checkout-total">
                  <p>Total cost</p>
                  <h3>N{priceTotal}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-actions cart-actions--checkout">
            <a href="/cart" className="cart__btn-back">
              <i className="icon-left"></i> Back
            </a>
            <div className="cart-actions__items-wrapper">
              <button type="button" className="btn btn--rounded btn--border">
                Continue shopping
              </button>
              <button
                type="button"
                className="btn btn--rounded btn--yellow"
                onClick={handleContinueToPayment}
              >
                Proceed to payment
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
