import React from "react";
import { render } from "@testing-library/react-native";
import MonthCalendar from "../scr/components/MonthCalendar";

it('renders MonthCalendar with basic data', () => {
  const { getByText } = render(
    <MonthCalendar
      currentYear={2024}
      month={8}
      userBirthdays={[{ id: 1, day: 15, month: 8, name: 'John Doe' }]}
      userEvents={[{ id: 2, day: 20, month: 8, name: 'Conference' }]}
      userHolidays={[{ id: 3, day: 25, month: 8, name: 'Holiday' }]}
    />
  );

  expect(getByText('15 John Doe')).toBeTruthy();
  expect(getByText('20 Conference')).toBeTruthy();
  expect(getByText('25 Holiday')).toBeTruthy();
});

it('displays user birthdays correctly in the calendar', () => {
  const { getByText } = render(
    <MonthCalendar
      currentYear={2024}
      month={8}
      userBirthdays={[{ id: 1, day: 15, month: 8, name: 'John Doe' }]}
      userEvents={[]}
      userHolidays={[]}
    />
  );
  expect(getByText('15 John Doe')).toBeTruthy();
});

it('displays user events correctly in the calendar', () => {
  const { getByText } = render(
    <MonthCalendar
      currentYear={2024}
      month={8}
      userBirthdays={[]}
      userEvents={[{ id: 2, day: 20, month: 8, name: 'Conference' }]}
      userHolidays={[]}
    />
  );

  expect(getByText('20 Conference')).toBeTruthy();
});

it('displays user holidays correctly in the calendar', () => {
  const { getByText } = render(
    <MonthCalendar
      currentYear={2024}
      month={8}
      userBirthdays={[]}
      userEvents={[]}
      userHolidays={[{ id: 3, day: 25, month: 8, name: 'Holiday' }]}
    />
  );

  expect(getByText('25 Holiday')).toBeTruthy();
});

it('renders correctly when there are no birthdays, events, or holidays in the given month', () => {
  const { queryByText } = render(
    <MonthCalendar
      currentYear={2024}
      month={8}
      userBirthdays={[{ id: 1, day: 15, month: 9, name: 'John Doe' }]}
      userEvents={[{ id: 2, day: 20, month: 9, name: 'Conference' }]}
      userHolidays={[{ id: 3, day: 25, month: 9, name: 'Holiday' }]}
    />
  );

  expect(queryByText('15 John Doe')).toBeNull();
  expect(queryByText('20 Conference')).toBeNull();
  expect(queryByText('25 Holiday')).toBeNull();
});
