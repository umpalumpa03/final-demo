import { Routes } from "@angular/router";

export const navRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import("./navigation-tabs").then((c) => c.Navigation),

        children: [
            {
                path: "test", 
                loadComponent: () => import("./test/test-overview").then((c) => c.TestOverview),

            },
            {
                path: "reports", 
                loadComponent: () => import("./test/test-reports").then((c) => c.TestReports),
            }
        ]
    },

]