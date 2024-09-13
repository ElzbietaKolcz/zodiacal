import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { render } from "@testing-library/react-native";
import Header from "../scr/components/Header";
import { NavigationContainer } from "@react-navigation/native"; 
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
  let navigation;

  beforeEach(() => {
    store = mockStore({
      user: {
        error: null,
      },
    });

    navigation = {
      navigate: jest.fn(),
    };
  });

  // it("dispatches logout action when logout button is pressed", async () => {
  //   const { getByTestId } = render(
  //     <Provider store={store}>
  //       <NavigationContainer> {/* Wrap with NavigationContainer */}
  //         <Header />
  //       </NavigationContainer>
  //     </Provider>,
  //   );

  //   const logoutButton = getByTestId("button");
  //   expect(logoutButton).toBeTruthy();

  //   fireEvent.press(logoutButton);

  //   await waitFor(() => {
  //     const actions = store.getActions();
  //     expect(actions).toEqual([{ type: logout.type }]);
  //   });
  // });

  it("displays username correctly when user is logged in", async () => {
    auth.onAuthStateChanged.mockImplementation((callback) =>
      callback({ displayName: "JohnDoe" }),
    );

    const { getByTestId, findByTestId } = render(
      <Provider store={store}>
        <NavigationContainer> {/* Wrap with NavigationContainer */}
          <Header />
        </NavigationContainer>
      </Provider>,
    );

    await findByTestId("header-welcome-text");

    const headerWelcomeText = getByTestId("header-welcome-text");
    const welcomeMessage = headerWelcomeText.props.children.join("");
    expect(welcomeMessage).toEqual("Welcome JohnDoe!");
  });
});
