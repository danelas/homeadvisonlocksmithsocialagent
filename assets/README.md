# assets/

Drop brand files here.

- **`logo.jpg`** — your Home Advisor Locksmith logo. It gets auto-composited
  into the bottom-right corner of every generated image with a thin brand
  frame. A square or wide logo on a transparent/white background works best.
  **Until this file exists, posts ship unbranded** (the agent logs a warning
  and continues — it won't crash).

- Any real photos you want to post: drop them here and reference them in
  `src/content/posts.ts` with `media: { source: "asset", path: "myphoto.jpg" }`.

The brand-frame color is set in [`src/lib/logo.ts`](../src/lib/logo.ts)
(`FRAME_COLOR`) — change it to match your brand.
