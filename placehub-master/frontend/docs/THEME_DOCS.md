# Theme Documentation

This document outlines the visual identity and design tokens used in PlaceHub.

## Color Palette

We use a professional and clean color palette based on deep navies and teals.

| Color | CSS Variable | Hex | Description | Tailwind Class |
|-------|--------------|-----|-------------|----------------|
| **Primary** | `--color-primary` | `#071952` | Deep Navy - Used for text, headers, and primary branding. | `text-primary`, `bg-primary` |
| **Secondary** | `--color-secondary` | `#088395` | Deep Teal - Used for primary buttons and main actions. | `text-secondary`, `bg-secondary` |
| **Accent** | `--color-accent` | `#37B7C3` | Bright Cyan - Used for highlights, icons, and subtle details. | `text-accent`, `bg-accent` |
| **Background** | `--color-background` | `#EBF4F6` | Soft Ice Blue - Used for app-wide backgrounds and card sections. | `text-background`, `bg-background` |

## Typography

- **Primary Font**: `Inter`
- **Fallback Fonts**: `system-ui`, `sans-serif`

The typography is configured to be clean and readable. We use Tailwind's default font sizes with the `Inter` font family.

## Usage in Components

### Tailwind CSS
You can use these colors anywhere in your components using Tailwind classes:

```jsx
// Utility classes
<div className="bg-primary text-white">...</div>
<button className="bg-secondary hover:bg-accent text-white py-2 px-4 rounded">
  Action
</button>
```

### CSS Variables
The colors are also available as CSS variables if you need to use them in standard CSS:

```css
.custom-component {
  background-color: var(--color-background);
  color: var(--color-primary);
}
```

## Design Principles
1. **Consistency**: Always use the defined theme colors instead of hardcoded hex values.
2. **Contrast**: Ensure text has sufficient contrast against background colors (e.g., use white text on `primary` and `secondary` backgrounds).
3. **Hierarchy**: Use `primary` for the most important information and `accent` for interactive or highlighting elements.
