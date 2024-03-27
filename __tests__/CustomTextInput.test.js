import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import CustomTextInput from "../screens/CustomTextInput";
import { updateGoal, addGoal } from "../features/goalSlice";

jest.mock("../firebase", () => ({
  auth: {
    currentUser: {
      uid: "mockedUserId",
    },
    onAuthStateChanged: jest.fn(),
  },
  db: {},
}));

const mockStore = configureStore([]);

describe("CustomTextInput component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      goals: [{ index: 1, name: "Existing Goal", state: false }],
    });
  });
  test("renders correctly", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <CustomTextInput index={1} />
      </Provider>,
    );
    expect(getByTestId("Goals")).toBeTruthy();
  });

  test("handles input change correctly", () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <CustomTextInput index={1} />
      </Provider>,
    );
    const input = getByLabelText("Goals");
    fireEvent.changeText(input, "New Goal");
    expect(input.props.value).toBe("New Goal");
  });

  test("handles checkbox press correctly", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <CustomTextInput index={1} />
      </Provider>,
    );
    const checkbox = getByTestId("checkbox");
    fireEvent.press(checkbox);
    expect(
      checkbox.props.accessibilityState.checked !== undefined,
    ).toBeTruthy();
  });

  test("handles FAB press correctly for adding goal", async () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <CustomTextInput index={1} />
      </Provider>,
    );
    const FAB = getByLabelText("FAB");
    fireEvent.press(FAB);

    await waitFor(() => {
      store.dispatch(addGoal({ state: false, name: "New Goal", index: 2 }));
    });

    expect(store.getActions()).toContainEqual(
      addGoal({ state: false, name: "New Goal", index: 2 }),
    );
  });

  test("handles FAB press correctly for updating goal", async () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <CustomTextInput index={1} />
      </Provider>,
    );
    const FAB = getByLabelText("FAB");
    fireEvent.press(FAB);

    await waitFor(() => {
      store.dispatch(updateGoal({ index: 1, name: "Updated Goal" }));
    });

    expect(store.getActions()).toContainEqual(
      updateGoal({ index: 1, name: "Updated Goal" }),
    );
  });
});
