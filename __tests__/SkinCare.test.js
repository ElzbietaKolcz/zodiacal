import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Exfoliation from '../scr/components/skinCare/routines/Exfoliation';


const mockStore = configureStore([]);


describe('Exfoliation', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      cosmetics: [],
      userCosmetics: [
        { id: '1', product_name: 'Lipstick', brand: 'Brand A', expiration_date: '2023-12-31' },
        { id: '2', product_name: 'Foundation', brand: 'Brand B', expiration_date: '2024-01-15' },
      ],
    });
  });

  it('displays selected cosmetic in the table', () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <Exfoliation />
      </Provider>
    );
    fireEvent.press(getByText('Lipstick')); 
    expect(getByTestId('cosmetic-row-1')).toBeTruthy(); 
  });

  it('renders the Exfoliation component correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Exfoliation />
      </Provider>
    );
    expect(getByText('Exfoliation')).toBeTruthy();
    expect(getByText('List of Cosmetics')).toBeTruthy();
  });
});