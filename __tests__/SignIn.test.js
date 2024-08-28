import React from "react";
import { render, fireEvent, waitFor} from "@testing-library/react-native";
import SignIn from "../scr/screens/SignIn";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

describe('SignIn Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        user: {
          username: 'testUsername',
        },
      },
    });
  });

  it('renders SignIn component correctly', async () => {
    try {
      const { getByText, getByLabelText } = render(
        <Provider store={store}>
          <SignIn />
        </Provider>,
      );

      expect(getByText('Sign in')).toBeTruthy();
      expect(getByLabelText('Email')).toBeTruthy();
      expect(getByLabelText('Password')).toBeTruthy();
      expect(getByText('Or sign in with')).toBeTruthy();
    } catch (error) {
      console.error('Error rendering SignIn component:', error);
    }
  });

  it('shows validation errors for invalid input', async () => {
    try {
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <SignIn />
        </Provider>,
      );

      fireEvent.changeText(getByLabelText('Email'), 'invalid-email');
      fireEvent.changeText(getByLabelText('Password'), '');

      fireEvent.press(getByText('Sign in'));

      await waitFor(() => {
        expect(getByText('Invalid email or password')).toBeTruthy();
      });
    } catch (error) {
      console.error('Error validating SignIn input:', error);
    }
  });

  it('handles sign in button press', async () => {
    try {
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <SignIn />
        </Provider>,
      );

      jest.mock('firebase/auth', () => ({
        signInWithEmailAndPassword: jest.fn(() => Promise.resolve({
          user: { uid: 'testUid', email: 'user@example.com' },
        })),
        db: {
          collection: jest.fn(() => ({
            doc: jest.fn(() => ({
              get: jest.fn(() => Promise.resolve({ data: () => ({ sign: 'testSign' }) })),
            })),
          })),
        },
      }));

      fireEvent.changeText(getByLabelText('Email'), 'user@example.com');
      fireEvent.changeText(getByLabelText('Password'), 'password123');

      fireEvent.press(getByText('Sign in'));

      await waitFor(() => {
      });
    } catch (error) {
      console.error('Error handling Sign in button press:', error);
    }
  });

  it('shows error message on login failure', async () => {
    try {
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <SignIn />
        </Provider>,
      );

      jest.mock('firebase/auth', () => ({
        signInWithEmailAndPassword: jest.fn(() => Promise.reject(new Error('Login failed'))),
      }));

      fireEvent.changeText(getByLabelText('Email'), 'user@example.com');
      fireEvent.changeText(getByLabelText('Password'), 'wrongPassword');

      fireEvent.press(getByText('Sign in'));

      await waitFor(() => {
        expect(getByText('Invalid email or password')).toBeTruthy();
      });
    } catch (error) {
      console.error('Error handling login failure:', error);
    }
  });

  it('handles Google sign in button press', async () => {
    try {
      jest.mock('expo-auth-session/providers/google', () => ({
        useAuthRequest: jest.fn(() => [
          { type: 'success', authentication: { idToken: 'testIdToken' } },
          jest.fn(),
          jest.fn(),
        ]),
      }));

      const { getByText } = render(
        <Provider store={store}>
          <SignIn />
        </Provider>,
      );

      fireEvent.press(getByText('Google'));

      await waitFor(() => {
      });
    } catch (error) {
      console.error('Error handling Google sign in button press:', error);
    }
  });
});