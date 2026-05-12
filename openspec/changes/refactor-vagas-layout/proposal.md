# Proposal: Layout Refactor for Vagas Listing

## Objective
Refactor the public job listing page (`/vagas`) to implement a **Master-Detail** pattern. Moving discovery tools (filters) to the top console and utilizing the sidebar for job list navigation, while reserving the main area for detailed job information.

## Problem Statement
The current layout uses a traditional sidebar for filters, which reduces the horizontal space for job listings. Additionally, clicking a job takes the user to a new page, breaking the flow of browsing multiple opportunities.

## Proposed Solution
1.  **Integrated Discovery Console**: Move all filters (Technical Area, Environment, Contract Type) from the `JobFilterSidebar` into the top `CardComponent` area. This creates a unified "Search & Filter" experience.
2.  **Navigation Sidebar**: Repurpose the left sidebar to display the list of available jobs (`JobCardPublic` in a more compact format). This allows users to quickly switch between jobs.
3.  **Content Hub (Main)**: Use the main content area to display the full details of the selected job. This eliminates the need for full-page navigations when browsing.

## Design Goals (Balha v9.1.0)
-   **Visual Hierarchy**: High-contrast Navy (#031525) background for the Hero, with clean white/card backgrounds for the discovery and content areas.
-   **Interactivity**: Smooth selection transitions between jobs in the sidebar.
-   **Efficiency**: Reduce scrolling by keeping the list visible while reading details.

## Impact
-   **UX**: Significantly improved browsing speed for candidates.
-   **Design**: Modernized layout aligned with high-end job boards and ATS platforms.
-   **SEO**: Maintain existing URL structures while enhancing the SPA experience.
