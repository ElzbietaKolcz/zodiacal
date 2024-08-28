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

describe("EditBirthdays component", () => {
  it("renders correctly", async () => {
    const initialState = {
      birthdays: [],
      user: {
        user: {
          username: "testUsername",
        },
      },
    };

    const store = mockStore(initialState);

    const { getByTestId, queryByText } = render(
      <Provider store={store}>
        <EditBirthdays />
      </Provider>,
    );

    const title = getByTestId("title");
    expect(title.props.children).toBe("List of birthday");

    await waitFor(() => {});

    expect(queryByText("Day")).toBeTruthy();
    expect(queryByText("Month")).toBeTruthy();
    expect(queryByText("Name")).toBeTruthy();
    expect(queryByText("Delete")).toBeTruthy();
  });

  it("displays data in the table", async () => {
    const initialState = {
      birthdays: [
        { id: "1", name: "John", day: 1, month: 7 },
        { id: "2", name: "Jane", day: 5, month: 8 },
      ],
      user: {
        user: {
          username: "testUsername",
          uid: "testUserId",
        },
      },
    };

    const store = mockStore(initialState);

    const { getByText } = render(
      <Provider store={store}>
        <EditBirthdays />
      </Provider>,
    );

    await waitFor(() => {});

    expect(getByText("01")).toBeTruthy();
    expect(getByText("07")).toBeTruthy();
    expect(getByText("05")).toBeTruthy();
    expect(getByText("08")).toBeTruthy();
    expect(getByText("John")).toBeTruthy();
    expect(getByText("Jane")).toBeTruthy();
  });

  it("deletes birthday", async () => {
    const initialState = {
      birthdays: [
        { id: "1", name: "John", day: 1, month: 7 },
        { id: "2", name: "Jane", day: 5, month: 8 },
      ],
      user: {
        user: {
          username: "testUsername",
          uid: "testUserId",
        },
      },
    };

    const store = mockStore(initialState);

    const { getByTestId } = render(
      <Provider store={store}>
        <EditBirthdays />
      </Provider>,
    );
    await waitFor(() => {});

    const deleteButton = getByTestId("delete-button-2");
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(removeBirthday).toHaveBeenCalled();
    });
  });
});
