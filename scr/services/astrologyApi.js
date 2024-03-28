import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const astrologyApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.SUPABASE_URL,
  }),
  endpoints: (builder) => ({
    getHoroscope: builder.query({
      query: (sign) => `horoscope/${sign}/today`,
    }),
  }),
});

export const { useGetHoroscopeQuery } = astrologyApi;