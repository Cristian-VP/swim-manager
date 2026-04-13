Objective: Upgrade your static prototype into a dynamic, multi-page React application. You will connect your UI to the local Athletics Sports Club REST API, handle asynchronous data fetching, manage loading and error states, and implement routing.

1. Planning and design setup

Go through the following steps before you start coding.

User stories and mock-ups.

Your application must now represent the UI for exactly four user stories. Reuse your stories from phase 1 and create the necessary new ones to reach four. For the new stories, deliver the same visual assets as before:

    Set the title using the format "As a [persona], I want [goal] so that [benefit]."
    Define a workflow that solves it. Include forks, arrows, error messages, cancellations, and alternative endings.
    Create the mock-up representing the steps the user follows to achieve it, and use arrows to define the flow. Use labels to highlight relevant details.
    Format: Delivered as a single file (image or vector) per story.



2. Technical requirements

Your work must meet the following technical requirements:

API Integration (GET requests only).

You must run the provided Athletics Sports Club API locally using Docker Compose. Replace your previous static JSON imports with the fetch() API to retrieve real data from the backend. Focus strictly on *implementing the read-only parts* of your user stories. For now, focus on presenting the data.

Endpoints.

You must use all the necessary GET endpoints required to completely fulfill the read operations for your 4 user stories. Available endpoint bases include /athletes, /coaches, /venues, /competitions, /trainings, /seasons, and /addresses. You should utilise both list endpoints (e.g., /api/v1/athletes) and detail endpoints (e.g., /api/v1/athletes/{public_id}) as dictated by your designs.

Component expansion.

Add at least 3 new functional components to your project to accommodate the new user stories and data presentation.

State and asynchrony.

Use useEffect and useState, add loading and error states:

    Use useEffect to trigger your fetch calls when the relevant components mount.
    Use useState to store the incoming JSON data.
    You must implement a loading state (e.g., showing a spinner, skeleton loader, or "Loading..." text while waiting for the API response) and an error state (e.g., a gracefully designed error message if the fetch fails or the Docker container is not running).

Mandatory routing.

Implement react-router-dom to create actual navigation. Your app must have at least two distinct views (e.g., a global navigation bar that switches between /athletes and /competitions, or clicking on a list item to navigate to a detail page).

Component quality and clean code.

React code must follow industry best practices for readability and separation of concerns.

    No spaguetti code. Do not put all your logic, styling, and UI into a single massive component. Break complex UIs into smaller, reusable child components.
    Keep JSX clean. The return (...) block of your component should primarily contain UI. Complex JavaScript logic, data filtering, and event handler functions should be defined above the return statement.
    Styling practices. Avoid heavy use of inline styles, e.g., style={{ color: 'red', margin: '10px' }}. Use standard external CSS files, CSS modules, or a consistent styling framework to keep your component files clean.
    Semantic HTML. Avoid a div soup. Use semantic HTML tags (<header>, <main>, <section>, <nav>, <button>) inside your JSX.

## Data quiality requirements

- Successfully adds 3 or more new functional components. Maintains excellent, modular structure and clear separation of concerns across the whole app.
- Seamlessly replaces mock data with fetch() GET requests across all necessary endpoints. Correctly extracts and utilizes the JSON data from the responses.
- Gracefully handles both Loading (spinners, skeletons) and Error states (friendly messages if the API is down) using useState in the relevant components.
- App runs flawlessly following the updated README.md. ZIP strictly excludes node_modules and files are named perfectly.
- Code is generally well-structured. A few components might be slightly too long, or there is minor use of inline styling, but it remains readable and easy to follow.
