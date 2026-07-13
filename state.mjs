import { getStore } from "@netlify/blobs";

// Password ini harus SAMA PERSIS dengan ADMIN_PASSWORD di index.html
const ADMIN_PASSWORD = "epilog2026";

export default async (req) => {
  const store = getStore("epilog-data");

  if (req.method === "GET") {
    try {
      const data = await store.get("state", { type: "json" });
      return new Response(JSON.stringify(data || {}), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({}), {
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (req.method === "POST") {
    const password = req.headers.get("x-admin-password");
    if (password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    try {
      const body = await req.json();
      await store.setJSON("state", body);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Bad request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/state",
};
