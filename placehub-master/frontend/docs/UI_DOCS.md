# UI Documentation

This document describes the UI architecture and common patterns used in the PlaceHub frontend.

## Project Structure

- `src/components/`: Reusable UI components (Navbar, Footer, Forms, etc.)
- `src/pages/`: Page-level components corresponding to routes.
- `src/services/`: API calls and business logic.
- `src/docs/`: Documentation for the project.

## Common Components

### Layouts
- **MainLayout**: Wraps most pages to provide consistent Navigation and Footer.
- **ProtectedRoute**: Used for routes that require authentication.

### Navigation
- **Navbar**: The main top navigation bar. It includes links to major sections, a profile dropdown, and mobile menu support.
- **Footer**: The bottom information bar.

### Forms
- **MultiStepForm**: A pattern used for complex data entry (e.g., Profile Setup, Experience Sharing).
- **LoginForm / SignupForm**: Standard authentication forms.

## Design Patterns

### 1. Icons
We use [lucide-react](https://lucide.dev/) for all icons.
```jsx
import { User, Settings, LogOut } from 'lucide-react'

// Usage
<User size={18} className="text-primary" />
```

### 2. Styling
We use **Tailwind CSS** for all styling.
- Use the theme colors (`primary`, `secondary`, `accent`, `background`) as much as possible.
- Use standard Tailwind utility classes for spacing, borders, and shadows.

### 3. Responsive Design
- Mobile-first approach.
- Use `hidden lg:flex` or similar classes to toggle visibility between mobile and desktop views.

### 4. Interactive Elements
- Buttons should have `transition-all` and hover effects (e.g., `hover:bg-accent` or `hover:shadow-lg`).
- Forms should include clear validation and error handling (check `LoginForm.jsx` for reference).

## Integration Guidelines for New Modules

When adding a new module:
1. **Component Creation**: Create smaller, reusable components in `src/components`.
2. **Page Setup**: Create a new page in `src/pages` and wrap it with `MainLayout` if it needs navigation.
3. **Routing**: Add the new route to `src/App.jsx`.
4. **Consistency**: Follow the color theme (see `THEME_DOCS.md`) and use `lucide-react` for icons.
5. **State Management**: Use local state (`useState`) for simple components and consider context or more robust solutions if needed (though currently the app seems to use local state mostly).

## Best Practices
- Keep components focused and small.
- Use descriptive names for props and variables.
- Always include a loading state for data-fetching operations.
- Ensure all images have `alt` text for accessibility.
