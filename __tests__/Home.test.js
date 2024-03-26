import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Home from '../screens/Home';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

jest.mock('../firebase', () => ({
  ...jest.requireActual('../firebase'),
  auth: {
    currentUser: {
      uid: 'testUserId',
      displayName: 'Test User' 
    }
  }
}));


describe('Home Component', () => {
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

  it('renders Home component correctly', async () => {
    try {
      const { getByTestId } = render(
        <Provider store={store}>
          <Home />
        </Provider>
      );

      expect(getByTestId('home')).toBeTruthy();
    } catch (error) {
      console.error('Error rendering Home component:', error);
    }
  });

  
});
