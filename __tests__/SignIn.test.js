import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import SignIn from "../scr/screens/SignIn";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { signInWithEmailAndPassword } from "firebase/auth";

const mockStore = configureStore([]);

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

describe("SignIn Component", () => {
  describe("SignIn Screen", () => {
    let store;

    beforeEach(() => {
      store = mockStore({
        user: {
          error: null,
        },
      });
    });

    it("should render email and password inputs", () => {
      const { getByLabelText } = render(
        <Provider store={store}>
          <SignIn />
        </Provider>,
      );
      const emailInput = getByLabelText("Email");
      const passwordInput = getByLabelText("Password");

      expect(emailInput).toBeDefined();
      expect(passwordInput).toBeDefined();
    });

    it("displays error message for invalid input", async () => {
      signInWithEmailAndPassword.mockRejectedValue(
        new Error("Invalid credentials"),
      );

      const { getByTestId, getByLabelText, queryByText } = render(
        <Provider store={store}>
          <SignIn />
        </Provider>,
      );
      const emailInput = getByLabelText("Email");
      const passwordInput = getByLabelText("Password");
      const signInButton = getByTestId("sign-in-button");

      fireEvent.changeText(emailInput, "invalid@example.com");
      fireEvent.changeText(passwordInput, "invalidPassword");

      await act(async () => {
        fireEvent.press(signInButton);
        await waitFor(() => {
          expect(queryByText("Invalid email or password")).not.toBeNull();
        });
      });
    });

    it("logs in user with valid input", async () => {
      signInWithEmailAndPassword.mockResolvedValue({
        user: { email: "test@example.com", uid: "123" },
      });

      const { getByTestId, getByLabelText } = render(
        <Provider store={store}>
          <SignIn />
        </Provider>,
      );
      const emailInput = getByLabelText("Email");
      const passwordInput = getByLabelText("Password");
      const signInButton = getByTestId("sign-in-button");

      fireEvent.changeText(emailInput, "test@example.com");
      fireEvent.changeText(passwordInput, "testPassword");

      await act(async () => {
        await fireEvent.press(signInButton);
      });

      await waitFor(() => {
        expect(store.getActions()).toContainEqual({
          type: "user/login",
          payload: { email: "test@example.com", uid: "123" },
        });
      });
    });

    it("navigates to SignUp screen when 'Sign up' button is pressed", () => {
      const navigation = {
        navigate: jest.fn(),
      };

      const { getByText } = render(
        <Provider store={store}>
          <SignIn navigation={navigation} />
        </Provider>,
      );

      const signUpButton = getByText("Sign up");
      fireEvent.press(signUpButton);

      expect(navigation.navigate).toHaveBeenCalledWith("SignUp");
    });
  });
});
