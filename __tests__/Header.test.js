import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../screens/Header';

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

  it('renders correctly with user name', () => {
    const tree = render(
      <Provider store={store}>
        <Header />
      </Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('dispatches logout action when logout button is pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );
    // Log the rendered output for debugging
    console.log(getByTestId('button'));
  
    const logoutButton = getByTestId('button');
    fireEvent.press(logoutButton);
  
    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'user/logout' });
  });
});
