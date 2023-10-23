import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const astrologyApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://sandipbgt.com/theastrologer/api/",
  }),
  endpoints: (builder) => ({
    getHoroscope: builder.query({
      query: (sign) => `horoscope/${sign}/today`,
    }),
  }),
});

export const { useGetHoroscopeQuery } = astrologyApi;
