const fs = require('fs');
const filepath = 'src/pages/artigos/[slug].astro';
let content = fs.readFileSync(filepath, 'utf8');

// Fix the error `Argument of type 'ResponseInit & { readonly headers: Headers; }' is not assignable to parameter of type 'Response'.`
// by changing `Astro.response` to `Astro.response as any` or just remove it if getSession accepts just request, or create a mock Response.
// Let's check getSession signature. Wait, getSession expects Request and Response. Since it's Astro, Astro.response is AstroGlobal['response'].
// We can just use `Astro.response as unknown as Response` or just pass `Astro.response as any`.

content = content.replace("await getSession(Astro.request, Astro.response);", "await getSession(Astro.request, Astro.response as any);");

fs.writeFileSync(filepath, content);
