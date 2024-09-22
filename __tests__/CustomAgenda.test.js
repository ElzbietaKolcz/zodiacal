import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import { useGetHoroscopeQuery } from "../scr/services/astrologyApi";
import Horoscope from "../scr/screens/horoscop/Horoscope";
import images from "../assets/images";

jest.mock('../scr/services/astrologyApi', () => ({
  useGetHoroscopeQuery: jest.fn(),
}));

const mockStore = configureStore([]);

const renderWithStore = (store) => {
  return render(
    <Provider store={store}>
      <Horoscope />
    </Provider>
  );
};

const createStore = (sign) => {
  return mockStore({
    user: {
      user: {
        sign,
      },
    },
  });
};

describe("CustomAgenda component", () => {
  
  it("renders CustomAgenda component correctly", () => {
    const store = createStore("leo");
    useGetHoroscopeQuery.mockReturnValue({
      data: null,
      isError: false,
      isLoading: true,
      isSuccess: false,
    });

    const { getByText } = renderWithStore(store);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("updates event state when checkbox is pressed", () => {
    const store = createStore("leo");
    useGetHoroscopeQuery.mockReturnValue({
      data: { horoscope: "You will have a great day!" },
      isError: false,
      isLoading: false,
      isSuccess: true,
    });

    const { getByText, getByTestId } = renderWithStore(store);

    expect(getByText("Your horoscope for today")).toBeTruthy();
    expect(getByText("You will have a great day!")).toBeTruthy();

    // Check if the image is rendered
    const image = getByTestId('horoscope-image');
    expect(image.props.source).toEqual(images["leo"]);
  });

  it("updates task state when checkbox is pressed", () => {
    const store = createStore("leo");
    useGetHoroscopeQuery.mockReturnValue({
      data: { horoscope: "You will have a great day!" },
      isError: false,
      isLoading: false,
      isSuccess: true,
    });

    const { getByText, getByTestId } = renderWithStore(store);

    expect(getByText("Your horoscope for today")).toBeTruthy();
    expect(getByText("You will have a great day!")).toBeTruthy();

    // Check if the image is rendered
    const image = getByTestId('horoscope-image');
    expect(image.props.source).toEqual(images["leo"]);
  });

  it("fetches data from Firebase on render", () => {
    const store = createStore("leo");
    useGetHoroscopeQuery.mockReturnValue({
      data: null,
      isError: true,
      isLoading: false,
      isSuccess: false,
    });

    const { getByText } = renderWithStore(store);

    expect(getByText("Error loading horoscope data.")).toBeTruthy();
  });
});
