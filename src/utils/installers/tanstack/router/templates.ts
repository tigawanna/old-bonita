export const vite_reactmain_tsx=`
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
} from "@tanstack/react-query";
import {
  ErrorComponent,
  Router,
  RouterContext,
  RouterProvider,
} from "@tanstack/router";

import App from "./App";
import { routes } from "./pages/routes/routes";

export const queryClient: QueryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: async (_, __, ___, mutation) => {
      if (Array.isArray(mutation.meta?.invalidates)) {
        return queryClient.invalidateQueries({
          queryKey: mutation.meta?.invalidates,
        });
      }
    },
  }),

  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const routerContext = new RouterContext<{
  queryClient: typeof queryClient;
}>();

// Create a root route
export const rootLayout = routerContext.createRootRoute({
  component: App,
  errorComponent: ErrorComponent,
});

const routeTree = rootLayout.addChildren(routes);

export const router = new Router({
  routeTree,
  context: {
    queryClient,
  },
});

// Register your router for maximum type safety
declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </QueryClientProvider>,
);
`


export const vite_react_app_tsx = `
import { Link, Outlet, useRouter } from "@tanstack/router";
import { Suspense, useEffect, useState } from "react";




function App() {

  const [drawerOpen, setDrawerOpen] = useState(false);

  const router = useRouter();
  const status = router.state.status;
  const toggleDrawer = () => {
    setDrawerOpen((open) => !open);
  };

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center ">
    
      <div className="drawer ">
        <input
          id="my-drawer-3"
          type="checkbox"
          className="drawer-toggle"
          onChange={toggleDrawer}
          checked={drawerOpen}
        />
        <div className="drawer-content flex flex-col ">
          {/* Navbar */}
          <div className="w-full flex items-center justify-between min-h-12 sticky top-0 ">
            {/* toggle drawer icon */}
            <div className="flex-none md:hidden ">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>

            <div className="bg-muted border-b-2 flex items-center justify-center p-1">
              <Link to="/" className="font-bold text-3xl  ">
                Home
              </Link>
            </div>
            <div className="flex-none hidden md:flex">
              <ul className="w-full h-full gap-5 flex items-center justify-center">
                {/* Navbar menu content here */}

                <li className="w-full  flex items-center  justify-start gap-5 bg-muted">
                  <Link
                    to="/"
                    activeProps={{ className: "text-info font-bold" }}
                  >
                    Home
                  </Link>
                  <Link
                    to="/posts"
                    activeProps={{ className: "text-info font-bold" }}
                  >
                    posts
                  </Link>
                  <Link
                    to="/profile"
                    activeProps={{ className: "text-info font-bold" }}
                  >
                    profile
                  </Link>
                  <Link
                    to="/admin"
                    activeProps={{ className: "text-info font-bold" }}
                  >
                    admin
                  </Link>
                </li>

                <li className="flex items-center justify-evenly">
                  <select data-choose-theme className=" select select-sm">
                    <option value="">Default</option>
                    <option value="bonita">Bonita</option>
                    <option value="dark">Dark</option>
                    <option value="light">light</option>
                    <option value="cupcake">Cupcake</option>
                  </select>
                </li>
              </ul>
            </div>
          </div>
          {/* Page content here */}

          <Outlet />
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="flex flex-col  h-full bg-base-200 gap-2 justify-start items-center">
            {/* Sidebar content here */}

            <div className="bg-muted border-b-2 flex items-center justify-center p-3">
              <Link to="/" className="font-bold text-3xl p-2 ">
                Home
              </Link>
            </div>
            <li
              onClick={() => setDrawerOpen(false)}
              className="w-full h-full flex flex-col  items-center justify-start gap-5 bg-muted"
            >
              <Link to="/" activeProps={{ className: "text-info font-bold" }}>
                Home
              </Link>
              <Link
                to="/posts"
                activeProps={{ className: "text-info font-bold" }}
              >
                posts
              </Link>

              <Link
                to="/profile"
                activeProps={{ className: "text-info font-bold" }}
              >
                profile
              </Link>
              <Link
                to="/admin"
                activeProps={{ className: "text-info font-bold" }}
              >
                admin
              </Link>
            </li>

            <li className="w-full p-4 flex items-center justify-evenly gap-2">
              <select data-choose-theme className=" select select-sm">
                <option value="">Default</option>
                <option value="bonita">Bonita</option>
                <option value="dark">Dark</option>
                <option value="light">light</option>
                <option value="cupcake">Cupcake</option>
              </select>
            </li>
          </ul>
        </div>
      </div>

      <Suspense fallback={null}>
        <DevTanStackQueryDevtools position="right" />
        <DevTanStackRouterDevtools />
      </Suspense>
    </div>
  );
}

export default App;

export const DevTanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );

export const DevTanStackQueryDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import("@tanstack/react-query-devtools").then((res) => ({
        default: res.ReactQueryDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );
`

export const vite_react_routes_ts=`
import { adminRoute } from "../admin/config";
import { authRoute } from "../auth/config";
import { homeRoute } from "../home/config";
import { postsRoute } from "../posts/config";
import { profileRoute } from "../profile/config";

// ADD NEW IMPORT HERE

// START
export const routes = [
  homeRoute,
  profileRoute,
  authRoute,
  adminRoute,
  postsRoute,
];
// END

`
