const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

async function fetchData() {
  try {
    const { data, error } = await supabase
      .from("cosmetics")
      .select()
      .limit(5)
      .order("category");
    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fetchData();
