import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EditBirthdays from "../scr/screens/yearlyCalendar/EditBirthdays";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { removeBirthday } from "../scr/features/birthdaySlice";

const mockStore = configureStore([]);

jest.mock("../scr/features/birthdaySlice", () => ({
  ...jest.requireActual("../scr/features/birthdaySlice"),
  removeBirthday: jest.fn(),
}));

const createStore = (birthdays = [], username = "testUsername", uid = "testUserId") => {
  return mockStore({
    birthdays,
    user: {
      user: {
        username,
        uid,
      },
    },
  });
};

const renderWithStore = (store) => {
  return render(
    <Provider store={store}>
      <EditBirthdays />
    </Provider>
  );
};

describe("EditBirthdays component", () => {
  it("renders correctly", async () => {
    const store = createStore();  // Using default initial state

    const { getByTestId, queryByText } = renderWithStore(store);

    const title = getByTestId("title");
    expect(title.props.children).toBe("List of birthday");

    await waitFor(() => {});

    expect(queryByText("Day")).toBeTruthy();
    expect(queryByText("Month")).toBeTruthy();
    expect(queryByText("Name")).toBeTruthy();
    expect(queryByText("Delete")).toBeTruthy();
  });

  it("displays data in the table", async () => {
    const birthdays = [
      { id: "1", name: "John", day: 1, month: 7 },
      { id: "2", name: "Jane", day: 5, month: 8 },
    ];
    const store = createStore(birthdays);

    const { getByText } = renderWithStore(store);

    await waitFor(() => {});

    expect(getByText("01")).toBeTruthy();
    expect(getByText("07")).toBeTruthy();
    expect(getByText("05")).toBeTruthy();
    expect(getByText("08")).toBeTruthy();
    expect(getByText("John")).toBeTruthy();
    expect(getByText("Jane")).toBeTruthy();
  });

  it("deletes birthday", async () => {
    const birthdays = [
      { id: "1", name: "John", day: 1, month: 7 },
      { id: "2", name: "Jane", day: 5, month: 8 },
    ];
    const store = createStore(birthdays);

    const { getByTestId } = renderWithStore(store);
    const deleteButton = getByTestId("delete-button-2");

    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(removeBirthday).toHaveBeenCalled();
    });
  });
});
