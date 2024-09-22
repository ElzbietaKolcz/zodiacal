import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CustomAgenda from '../scr/components/CustomAgenda';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { auth, db } from '../firebase'; 
import { getDocs } from 'firebase/firestore';

jest.mock('../firebase', () => ({
  auth: {
    currentUser: {
      uid: 'testUserId', 
    },
  },
  db: jest.fn(),
}));

jest.mock('firebase/firestore', () => {
  const actualFirestore = jest.requireActual('firebase/firestore');
  return {
    ...actualFirestore,
    collection: jest.fn(),
    query: jest.fn(),
    getDocs: jest.fn().mockImplementation(() => {
      return {
        forEach: jest.fn((callback) => {
          const mockEvents = [
            {
              id: 'checkbox-event-1',
              data: () => ({
                id: 'checkbox-event-1',
                day: 18,
                month: 9,
                name: 'Event 1 for current week',
                state: false,
                tag: 'event',
              }),
            },
          ];
          mockEvents.forEach(callback); 
        }),
      };
    }),
  };
});


// Mockowanie FlatList
jest.mock('react-native/Libraries/Lists/FlatList', () => {
  const { View } = require('react-native');
  return props => (
    <View>
      {props.data && props.data.map((item, index) => props.renderItem({ item, index }))}
    </View>
  );
});

const mockStore = configureStore([]);

const createStore = ( username = 'testUsername', uid = 'testUserId') => {
  return mockStore({
    user: {
      user: {
        username,
        uid,
      },
    },
  });
};

it('renders CustomAgenda component correctly', () => {
  const store = createStore();

  const { getByTestId } = render(
    <Provider store={store}>
      <CustomAgenda />
    </Provider>
  );

  expect(getByTestId('agenda')).toBeTruthy(); // Sprawdza, czy Agenda się renderuje
});

it("updates item state when checkbox is pressed", async () => {
  const mockEvents = [
    {
      data: () => ({
        id: 'checkbox-event-1',
        day: 18,
        month: 9,
        name: 'Event 1 for current week',
        state: false,
        tag: 'event',
      }),
    },
  ];
  const store = createStore(mockEvents);

  const { getByTestId } = render(
    <Provider store={store}>
      <CustomAgenda />
    </Provider>
  );
  const checkbox = getByTestId('checkbox-event-1');
  expect(checkbox.props.status).toBe(false);
  fireEvent.press(checkbox);
  await waitFor(() => {
    expect(checkbox.props.status).toBe(true);
  });
});



