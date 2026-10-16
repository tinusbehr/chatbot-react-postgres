import { Outlet, useLoaderData } from "react-router";
import Sidebar from "../components/Sidebar.jsx";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
/**
 * CLIENT LOADER FUNCTION
 *
 * Loads the list of chat threads before the layout renders.
 * Key concepts:
 * 1. PARENT ROUTE LOADER: Runs before any child route loaders
 * 2. SHARED DATA: Data is available to this component and can be accessed by children
 * 3. SIMULATED API CALL: We add a delay to mimic fetching from a database
 * 4. MOCK DATA: Returns static data that will later come from Supabase
 *
 * This loader runs:
 * - On initial page load
 * - When navigating to any route under this layout
 * - When React Router revalidates (after mutations)
 */
export async function clientLoader() {
  const url = `${supabaseUrl}/rest/v1/threads` + "?select=*&order=created_at.desc";
  const response = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });
  if (!response.ok) throw new Error("Kunne ikke hente tråde");
  const threads = await response.json();

  return { threads };
};


/**
 * Layout Component
 *
 * Now uses DATA LOADING instead of local state!
 *
 * Key concepts:
 * 1. useLoaderData() HOOK: Accesses data from clientLoader
 * 2. NO STATE MANAGEMENT: Data comes from loader, not useState
 * 3. LAYOUT PATTERN: Wraps child routes with consistent UI (sidebar)
 * 4. OUTLET: Renders the matched child route component
 */
export default function Layout() {
  // Access threads data from the loader
  const { threads } = useLoaderData();

  // Delete functionality will be re-implemented with clientAction later
  const deleteThread = (threadId) => {
    console.log("Delete thread:", threadId);
    console.log("(Mutations will be implemented in the next phase)");
  };

  return (
    <div className="app-layout">
      <Sidebar threads={threads} onDeleteThread={deleteThread} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
