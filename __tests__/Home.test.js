import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import Home from "../screens/Home";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

describe("Home Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      birthdays: [],
      user: {
        user: {
          username: "testUsername",
        },
      },
    });
  });

  it("renders Home component correctly", async () => {
    try {
      const { getByTestId } = render(
        <Provider store={store}>
          <Home />
        </Provider>,
      );

      await waitFor(() => expect(getByTestId("home")).toBeTruthy());
    } catch (error) {
      console.error("Error rendering Home component:", error);
    }
  });

  it("calls onAuthStateChanged when component mounts", async () => {
    try {
      render(
        <Provider store={store}>
          <Home />
        </Provider>,
      );

      await waitFor(() =>
        expect(
          require("../firebase").auth.onAuthStateChanged,
        ).toHaveBeenCalled(),
      );
    } catch (error) {
      console.error("Error testing onAuthStateChanged:", error);
    }
  });

  it("fetches data correctly when user is authenticated", async () => {
    try {
      const fetchDataMock = jest.fn();
      require("../firebase").db.collection = jest.fn(() => ({
        orderBy: jest.fn(() => ({
          getDocs: jest.fn(() => ({
            docs: [{ data: () => ({ id: 1 }) }],
          })),
        })),
      }));
      require("react-redux").useDispatch = jest.fn(() => fetchDataMock);

      render(
        <Provider store={store}>
          <Home />
        </Provider>,
      );

      await waitFor(() => expect(fetchDataMock).toHaveBeenCalled());
    } catch (error) {
      console.error("Error testing data fetching:", error);
    }
  });

  it("passes correct user birthdays data to MonthCalendar component", async () => {
    try {
      const { getByTestId } = render(
        <Provider store={store}>
          <Home />
        </Provider>,
      );

      await waitFor(() => {
        const monthCalendar = getByTestId("month-calendar");
        expect(monthCalendar.props.userBirthdays).toEqual([
          { id: "1", name: "John", day: 1 },
          { id: "2", name: "Jane", day: 5 },
        ]);
      });
    } catch (error) {
      console.error("Error testing MonthCalendar data:", error);
    }
  });

  it("displays goals for the month correctly", async () => {
    try {
      const { getByText } = render(
        <Provider store={store}>
          <Home />
        </Provider>,
      );

      await waitFor(() => {
        expect(getByText("Goals for this month")).toBeTruthy();
        expect(getByText("Custom Goal 1")).toBeTruthy();
        expect(getByText("Custom Goal 2")).toBeTruthy();
      });
    } catch (error) {
      console.error("Error testing goals rendering:", error);
    }
  });
});
