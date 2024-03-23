import React from "react";
import { render, fireEvent, waitFor, screen, act } from "@testing-library/react-native"; // Import act from testing-library
import SignUp from "../screens/SignUp";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const mockStore = configureStore([]);

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn((auth, email, password) => {
    if (email === "existing@example.com") {
      return Promise.reject({ code: "auth/email-already-in-use" });
    } else {
      return Promise.resolve({ user: { email: email, uid: "123" } });
    }
  }),
}));

describe("SignUp Component", () => {
  describe("SignUp Screen", () => {
    let store;

    beforeEach(() => {
      store = mockStore({
        user: {
          error: null,
        },
      });
    });

    it("should render username, email, and password inputs", () => {
      const { getByLabelText } = render(
        <Provider store={store}>
          <SignUp />
        </Provider>,
      );
      const usernameInput = getByLabelText("Username");
      const emailInput = getByLabelText("Email");
      const passwordInput = getByLabelText("Password");

      expect(usernameInput).toBeDefined();
      expect(emailInput).toBeDefined();
      expect(passwordInput).toBeDefined();
    });

    it("signs up user with valid input", async () => {
      createUserWithEmailAndPassword.mockResolvedValue({
        user: { email: "test@example.com", uid: "123" },
      });
    
      const { getByTestId, getByLabelText } = render(
        <Provider store={store}>
          <SignUp />
        </Provider>,
      );
      const usernameInput = getByLabelText("Username");
      const emailInput = getByLabelText("Email");
      const passwordInput = getByLabelText("Password");
      const signUpButton = getByTestId("sign-up-button");
    
      fireEvent.changeText(usernameInput, "TestUser");
      fireEvent.changeText(emailInput, "test@example.com");
      fireEvent.changeText(passwordInput, "testPassword");
    
      await fireEvent.press(signUpButton);
    
      // Loguj wartość przechowywaną w store.getActions() w konsoli
      console.log("Actions:", store.getActions());
    
      // Sprawdź, czy akcja logowania została wywołana z odpowiednimi danymi
      expect(store.getActions()).toContainEqual({
        type: "user/login",
        payload: { email: "test@example.com", uid: "123456", displayName: "TestUser" },
      });
    });
  });
});
