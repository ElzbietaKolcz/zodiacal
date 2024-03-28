import React from "react";
import { render } from "@testing-library/react-native";
import MonthCalendar from "../screens/MonthCalendar";

describe("MonthCalendar component", () => {
  const markedDates = [
    { id: 1, name: "John", day: 10, month: 3 },
    { id: 2, name: "Alice", day: 15, month: 3 },
  ];

  it("renders correctly with provided birthdays", () => {
    const { getByText } = render(
      <MonthCalendar
        currentYear={2024}
        month={3}
        userBirthdays={markedDates}
      />,
    );

    expect(getByText("10 John")).toBeTruthy();
    expect(getByText("15 Alice")).toBeTruthy();
  });

  it("displays only birthdays for the current month", () => {
    const { queryByText } = render(
      <MonthCalendar
        currentYear={2024}
        month={4}
        userBirthdays={markedDates}
      />,
    );

    expect(queryByText("10 John")).toBeNull();
    expect(queryByText("15 Alice")).toBeNull();
  });

  it("marks birthdays on the calendar", () => {
    const { getByText } = render(
      <MonthCalendar
        currentYear={2024}
        month={3}
        userBirthdays={markedDates}
      />,
    );

    expect(getByText("10")).toBeTruthy();
    expect(getByText("15")).toBeTruthy();
  });
});
