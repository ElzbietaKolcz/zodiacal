import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, fireEvent, waitFor } from '@testing-library/react-native'; 
import Header from '../screens/Header';
import { logout } from '../features/userSlice';

const mockStore = configureStore([]);

describe('Header component', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      user: {
        userName: 'JohnDoe',
      },
    });
  });

  it('dispatches logout action when logout button is pressed', async () => { 
    const { getByTestId } = render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );
    
    const logoutButton = getByTestId('button');
    expect(logoutButton).toBeTruthy();
  
    fireEvent.press(logoutButton);
    
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual([{ type: logout.type }]);
    });
  });
});
