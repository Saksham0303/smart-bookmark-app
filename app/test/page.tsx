"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestPage() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*");

      if (error) setError(error.message);
      else setData(data || []);
    };

    fetchData();
  }, []);

  return (
    <div className="p-10 text-white">
      <h1>Supabase Test</h1>

      {error && <p>Error: {error}</p>}

      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
                                                                                                                