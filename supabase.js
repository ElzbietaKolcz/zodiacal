import { createClient } from "@supabase/supabase-js";
import { setHolidays } from "../zodiacal/scr/features/holidaysSlice";
import { store } from "./store";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

export async function fetchData() {
  const dispatch = store.dispatch;

  try {
    const { data: cosmeticsData, error: cosmeticsError } = await supabase
      .from("cosmetics")
      .select()
      .limit(5)
      .order("category");

    if (cosmeticsError) {
      console.error("Error fetching cosmetics data:", cosmeticsError.message);
      return;
    }

    const { data: holidaysData, error: holidaysError } = await supabase
      .from("holidays")
      .select();

    if (holidaysError) {
      console.error("Error fetching holidays data:", holidaysError.message);
      return;
    }

    if (holidaysData && holidaysData.length > 0) {
      dispatch(setHolidays(holidaysData));
    } else {
      dispatch(setHolidays([]));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fetchData();
