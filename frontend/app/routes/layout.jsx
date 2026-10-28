import { Outlet, useLoaderData, redirect } from "react-router";
import Sidebar from "../components/Sidebar.jsx";

/**
 * CLIENT LOADER FUNCTION
 *
 * Fetches the list of chat threads from our custom API before the layout renders.
 * Key concepts:
 * 1. PARENT ROUTE LOADER: Runs before any child route loaders
 * 2. SHARED DATA: Data is available to this component and can be accessed by children
 * 3. CUSTOM API: Direct HTTP calls to our Express API server
 * 4. ENVIRONMENT VARIABLES: Secure way to store API endpoint URLs
 *
 * This loader runs:
 * - On initial page load
 * - When navigating to any route under this layout
 * - When React Router revalidates (after mutations)
 */
export async function clientLoader() {
  // Get our API URL from environment variables
  const apiUrl = import.meta.env.VITE_API_URL;

  // Construct the API endpoint URL
  // Our custom API handles sorting internally (ORDER BY created_at DESC)
  const url = `${apiUrl}/api/threads`;

  // Make the request to our custom API
  // No special headers needed - our API is public for now
  const response = await fetch(url);

  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`Failed to fetch threads: ${response.status}`);
  }

  // Parse the JSON response
  const threads = await response.json();

  return { threads };
}

/**
 * CLIENT ACTION FUNCTION
 *
 * Handles thread deletion requests.
 * Key concepts:
 * 1. INTENT PATTERN: Uses form field to identify the action type
 * 2. DELETE REQUEST: Sends DELETE request to Supabase
 * 3. CASCADE DELETE: Supabase automatically deletes related messages
 * 4. AUTOMATIC REVALIDATION: Loader re-runs to refresh thread list
 *
 * The action runs:
 * - When a Form with method="post" is submitted
 * - Checks the "intent" field to determine the action
 */
export async function clientAction({ request }) {
  const apiUrl = import.meta.env.VITE_API_URL

  // Extract form data
  const formData = await request.formData();
  const intent = formData.get("intent");
  const threadId = formData.get("threadId");

  // Handle delete intent
  if (intent === "delete" && threadId) {
    try {
      // DELETE request to Supabase
      // Messages are automatically deleted due to CASCADE
      const response = await fetch(`${apiUrl}/api/threads/${threadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return { error: `Failed to delete thread: ${response.status}` };
      }

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  return null;
}

export default function Layout() {
  // Access threads data from the loader
  const { threads } = useLoaderData();

  return (
    <div className="app-layout">
      <Sidebar threads={threads} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
