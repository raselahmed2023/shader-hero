## Shader Notes

This hero uses a custom GLSL fragment shader rendered with React Three Fiber.

- `u_time` animates the layered sine-wave flow.
- `u_resolution` keeps the shader proportional across different screen sizes.
- `u_mouse` gently bends the color field toward the cursor.
- A vignette darkens the edges to keep the foreground text readable.
- A subtle grain pass adds texture to the final color.

## Performance & Reduced Motion

The WebGL canvas caps devicePixelRatio at 1.5, pauses animation when the browser tab is hidden, and replaces the animated shader with a static gradient when `prefers-reduced-motion` is enabled.