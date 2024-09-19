import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import '@testing-library/jest-native/extend-expect';
import FormDate from "../scr/components/horoscop/FormDate";
import configureStore from 'redux-mock-store';  
import { Provider } from 'react-redux';
import { updateDoc } from '@firebase/firestore';


const mockStore = configureStore([]);

jest.mock('@firebase/firestore', () => ({
  ...jest.requireActual('@firebase/firestore'),
  updateDoc: jest.fn(),
}));

it('shows validation errors for invalid day and month inputs', async () => {
  const store = mockStore({}); 
  const { getByLabelText, getByTestId } = render(
    <Provider store={store}>
      <FormDate />
    </Provider>
  );
  fireEvent.changeText(getByLabelText('Day'), '32');   
  fireEvent.changeText(getByLabelText('Month'), '13'); 
  await waitFor(() => {
    expect(getByTestId('error-month')).toHaveTextContent('Must be at most 12');
    expect(getByTestId('error-day')).toHaveTextContent('Must be at most 31');
  });
});

it("handles FAB press correctly for updating zodiac sign", async () => {
  const initialState = {
    user: {
      user: {
        username: "testUsername",
      },
    },
  };
  const store = mockStore(initialState);
  const { getByLabelText, getByTestId } = render(
    <Provider store={store}>
      <FormDate />
    </Provider>,
  );

  fireEvent.changeText(getByLabelText("Day"), "15");
  fireEvent.changeText(getByLabelText("Month"), "8"); 
  const fabButton = getByLabelText("FAB");
  fireEvent.press(fabButton);

  //   await waitFor(() => {
  //   expect(updateDoc).toHaveBeenCalled();
  //   expect(updateDoc).toHaveBeenCalledWith(
  //     expect.anything(), 
  //     { sign: "leo" }   
  //   );
  // });

  await waitFor(() => {
    // Sprawdź, czy błąd dla miesiąca jest wyświetlony i ma oczekiwany tekst
    expect(getByTestId('sign')).toHaveTextContent('Zodiac sign: leo');
  });
});

it('displays the correct zodiac sign based on day and month inputs', () => {
  const store = mockStore({});
  const { getByLabelText, getByText } = render(
    <Provider store={store}>
      <FormDate />
    </Provider>
  );
  fireEvent.changeText(getByLabelText('Day'), '15');
  fireEvent.changeText(getByLabelText('Month'), '8');
  expect(getByText('Zodiac sign: leo')).toBeTruthy();
});

