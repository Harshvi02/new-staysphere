import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://kawniuxdmfabuumufczj.supabase.co",  // 👈 dashboard से copy करो
  "sb_publishable_T3rnFCbLMPzFndyYgZTQAA_Zxl8dmIw"                        // 👈 dashboard से copy करो
);