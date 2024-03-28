import React from "react";
import { act, fireEvent, waitFor, screen, render } from '@testing-library/react-native';
import YearlyCalendar from "../screens/YearlyCalendar";
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { setBirthdays } from '../features/birthdaySlice'; 

const mockStore = configureStore([]);

jest.mock('../features/birthdaySlice', () => ({
  ...jest.requireActual('../features/birthdaySlice'),
  setBirthdays: jest.fn(payload => ({ type: 'birthdays/setBirthdays', payload }))
}));

jest.mock('../firebase', () => ({
  ...jest.requireActual('../firebase'),
  db: {
    collection: jest.fn(() => ({
      orderBy: jest.fn(() => ({
        getDocs: jest.fn(() => ({
          docs: [{ data: () => ({ id: '1', name: 'John', day: 1 }) }, { data: () => ({ id: '2', name: 'Jane', day: 5 }) }]
        }))
      }))
    })),
    auth: {
      currentUser: {
        uid: 'testUserId' 
      }
    }
  }
}));

describe('YearlyCalendar', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      birthdays: [],
      user: {
        user: {
          username: 'testUsername' 
        }
      }
    });
  });

  it('renders correctly', () => {
    const { getByLabelText, getByText } = render(
      <Provider store={store}>
        <YearlyCalendar />
      </Provider>
    );

    expect(getByLabelText('Day')).toBeTruthy();
    expect(getByLabelText('Month')).toBeTruthy();
    expect(getByLabelText('Name')).toBeTruthy();
    expect(getByText('Add new data')).toBeTruthy();
  });
  
  it('handles FAB press correctly for adding new user birthday', async () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <YearlyCalendar />
      </Provider>
    );

    const FAB = getByLabelText("FAB");
    fireEvent.press(FAB);

    await waitFor(() => {
      store.dispatch(setBirthdays({name: "John Doe", day: 15, month: 6 }));
    });

    expect(store.getActions()).toContainEqual(
      setBirthdays({name: "John Doe", day: 15, month: 6 })
    );
  });

  it('displays error message for invalid input', async () => {
    const { getByLabelText, queryByText } = render(
      <Provider store={store}>
        <YearlyCalendar />
      </Provider>
    );
  
    const dayInput = getByLabelText("Day");
    const monthInput = getByLabelText("Month");
    const nameInput = getByLabelText("Name");
  
    fireEvent.changeText(dayInput, '32');
    fireEvent.changeText(monthInput, '13');
    fireEvent.changeText(nameInput, '');
  
    await act(async () => {
      await waitFor(() => {
        expect(queryByText("Must be at most 31")).not.toBeNull();
        expect(queryByText("Must be at most 12")).not.toBeNull();
        expect(queryByText("Required")).not.toBeNull();
      });
    });
  });

  it('renders EditBirthdays modal when FAB is pressed', () => {
    const { getByLabelText, getByTestId } = render(
      <Provider store={store}>
        <YearlyCalendar />
      </Provider>
    );
  
    const FAB = getByLabelText("FAB");
    fireEvent.press(FAB);
  
    const modal = getByTestId("edit-birthdays-modal");
    expect(modal).toBeTruthy();
  });
});
