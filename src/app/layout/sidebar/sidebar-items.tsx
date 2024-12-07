// import { Icon } from "@iconify/react";
// import { Chip } from "@nextui-org/react";
import type { SidebarItem } from "./sidebar";

export const sectionItems: SidebarItem[] = [
    {
        key: "overview",
        title: "Übersicht",
        items: [
            {
                key: "MissionBoard",
                href: "/",
                icon: "solar:clipboard-linear",
                title: "Mission Board",
            },
            // {
            //     key: "projects",
            //     href: "#",
            //     icon: "solar:widget-2-outline",
            //     title: "Projects",
            //     endContent: (
            //         <Icon
            //             className="text-default-400"
            //             icon="solar:add-circle-line-duotone"
            //             width={24}
            //         />
            //     ),
            // },
            // {
            //     key: "tasks",
            //     href: "#",
            //     icon: "solar:checklist-minimalistic-outline",
            //     title: "Tasks",
            //     endContent: (
            //         <Icon
            //             className="text-default-400"
            //             icon="solar:add-circle-line-duotone"
            //             width={24}
            //         />
            //     ),
            // },
            // {
            //     key: "team",
            //     href: "#",
            //     icon: "solar:users-group-two-rounded-outline",
            //     title: "Team",
            // },
            // {
            //     key: "tracker",
            //     href: "#",
            //     icon: "solar:sort-by-time-linear",
            //     title: "Tracker",
            //     endContent: (
            //         <Chip size="sm" variant="flat">
            //             New
            //         </Chip>
            //     ),
            // },
        ],
    },
    // {
    //     key: "my_account",
    //     title: "My Account",
    //     items: [
    //         {
    //             key: "cap_table",
    //             href: "#",
    //             title: "Cap Table",
    //             icon: "solar:pie-chart-2-outline",
    //             items: [
    //                 {
    //                     key: "shareholders",
    //                     href: "#",
    //                     title: "Shareholders",
    //                 },
    //                 {
    //                     key: "note_holders",
    //                     href: "#",
    //                     title: "Note Holders",
    //                 },
    //                 {
    //                     key: "transactions_log",
    //                     href: "#",
    //                     title: "Transactions Log",
    //                 },
    //             ],
    //         },
    //         {
    //             key: "analytics",
    //             href: "#",
    //             icon: "solar:chart-outline",
    //             title: "Analytics",
    //         },
    //         {
    //             key: "perks",
    //             href: "/perks",
    //             icon: "solar:gift-linear",
    //             title: "Perks",
    //             endContent: (
    //                 <Chip size="sm" variant="flat">
    //                     3
    //                 </Chip>
    //             ),
    //         },
    //         {
    //             key: "expenses",
    //             href: "#",
    //             icon: "solar:bill-list-outline",
    //             title: "Expenses",
    //         },
    //         {
    //             key: "settings",
    //             href: "/settings",
    //             icon: "solar:settings-outline",
    //             title: "Settings",
    //         },
    //     ],
    // },
];
