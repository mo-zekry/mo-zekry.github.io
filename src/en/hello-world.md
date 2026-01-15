---
title: "Hello World — Welcome to My Blog"
date: 2026-01-15
lang: en
layout: layouts/post.njk
tags: [intro, demo]
permalink: "/en/hello-world/"
---

Welcome to my bilingual tech blog! This post demonstrates the blog's features.

## Typography

This blog uses **Source Serif 4** for body text — a beautiful serif font inspired by classic LaTeX typography. Code uses **Fira Code** with ligatures support.

Here's some `inline code` and a code block:

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("World"));

```

## Math with KaTeX

Inline math: The famous equation $E = mc^2$ changed physics forever.

Block math (Euler's identity):

$$
e^{i\pi} + 1 = 0
$$

The quadratic formula:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

## Mermaid Diagrams

Here's a flowchart:

<div class="mermaid">
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
</div>

And a sequence diagram:

<div class="mermaid">
sequenceDiagram
    participant User
    participant Browser
    participant Server
    User->>Browser: Click link
    Browser->>Server: HTTP Request
    Server-->>Browser: HTML Response
    Browser-->>User: Render page
</div>

## Blockquotes

> "The best way to predict the future is to invent it."
> — Alan Kay

## Tables

| Feature       | Status |
|---------------|--------|
| Light Mode    | ✅     |
| Dark Mode     | ✅     |
| RTL Support   | ✅     |
| Mermaid       | ✅     |
| KaTeX Math    | ✅     |

## Lists

1. First item
2. Second item
   - Nested item
   - Another nested item
3. Third item

---

Toggle the 🌙/☀️ button in the header to switch between light and dark modes!
