import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Header from "../scr/components/Header";
import { logout } from "../scr/features/userSlice";
import { auth } from "../firebase";

jest.mock("../firebase", () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
  },
}));

const mockStore = configureStore([]);

describe("Header component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        userName: "JohnDoe",
      },
    });
  });

  it("dispatches logout action when logout button is pressed", async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    const logoutButton = getByTestId("button");
    expect(logoutButton).toBeTruthy();

    fireEvent.press(logoutButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual([{ type: logout.type }]);
    });
  });

  it("displays username correctly when user is logged in", async () => {
    auth.onAuthStateChanged.mockImplementation((callback) =>
      callback({ displayName: "JohnDoe" }),
    );

    const { getByTestId, findByTestId } = render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

    await findByTestId("header-welcome-text");

    const headerWelcomeText = getByTestId("header-welcome-text");
    const welcomeMessage = headerWelcomeText.props.children.join("");
    expect(welcomeMessage).toEqual("Welcome back JohnDoe!");
  });
});
