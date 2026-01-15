module.exports = function(eleventyConfig) {
  // Use markdown-it with HTML and math support
  const markdownIt = require("markdown-it");
  // Server-side KaTeX removed: keep raw TeX delimiters for client-side MathJax
  // Add PrismJS syntax highlighting plugin
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  eleventyConfig.addPlugin(syntaxHighlight);

  // Use markdown-it but do NOT convert math server-side; MathJax will handle it in the browser
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  eleventyConfig.setLibrary("md", md);
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  // Ensure explicit media folders are available at site root
  eleventyConfig.addPassthroughCopy({
    "src/assets/images": "assets/images",
    "src/assets/videos": "assets/videos"
  });

  // Copy top-level logo (if present) into the site assets so templates can use it
  // without requiring the file to be moved manually.
  try {
    eleventyConfig.addPassthroughCopy({
      "./logo.png": "assets/images/logo.png"
    });
  } catch (e) {
    // ignore if passthrough registration fails in unusual environments
  }

  // Shortcode for responsive images (usage in templates/markdown with Nunjucks):
  // {% img "assets/images/filename.jpg", "Alt text", "class-name" %}
  eleventyConfig.addShortcode("img", function(src, alt = "", cls = "") {
    if (!src) return "";
    const safeSrc = src.startsWith("/") ? src : `/${src}`;
    const classAttr = cls ? ` class="${cls}"` : "";
    const altAttr = alt ? ` alt="${alt}"` : ' alt=""';
    return `<figure><img src="${safeSrc}"${altAttr}${classAttr} loading="lazy" decoding="async"><figcaption>${alt || ""}</figcaption></figure>`;
  });

  // Shortcode for simple video embedding (MP4 fallback). Usage:
  // {% video "assets/videos/clip.mp4", "assets/images/poster.jpg", "class-name" %}
  eleventyConfig.addShortcode("video", function(src, poster = "", cls = "") {
    if (!src) return "";
    const safeSrc = src.startsWith("/") ? src : `/${src}`;
    const posterAttr = poster ? (' poster="' + (poster.startsWith("/") ? poster : ('/' + poster)) + '"') : "";
    const classAttr = cls ? ` class="${cls}"` : "";
    return `<video controls${classAttr}${posterAttr}>
      <source src="${safeSrc}" type="video/mp4">
      Your browser does not support the video tag.
    </video>`;
  });

  // Collections by language
  eleventyConfig.addCollection("postsEn", function(collection) {
    return collection.getFilteredByGlob("src/en/**/*.md").reverse();
  });
  eleventyConfig.addCollection("postsAr", function(collection) {
    return collection.getFilteredByGlob("src/ar/**/*.md").reverse();
  });

  // Date filter used in templates (simple yyyy-mm-dd or year)
  eleventyConfig.addFilter("date", function(value, format = "yyyy-MM-dd") {
    if (value === "now") return String(new Date().getFullYear());
    const d = (value instanceof Date) ? value : new Date(value);
    if (isNaN(d)) return value;
    if (format === "yyyy") return String(d.getFullYear());
    return d.toISOString().split('T')[0];
  });

  // Word count filter (strips HTML and counts words)
  eleventyConfig.addFilter("wordCount", function(html) {
    if (!html) return 0;
    const text = String(html).replace(/<[^>]*>/g, ' ');
    const matches = text.trim().split(/\s+/).filter(Boolean);
    return matches.length;
  });

  // Reading time (approx, default 200 wpm)
  eleventyConfig.addFilter("readingTime", function(html, wpm = 200) {
    const words = String(html).replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / (wpm || 200)));
    return mins;
  });

  // Generate a Table of Contents (server-side) from rendered HTML content
  eleventyConfig.addFilter('generateToc', function(html) {
    if (!html) return '';
    const headingRegex = /<(h[2-4])([^>]*)>(.*?)<\/\1>/gi;
    const slugs = {};
    const items = [];
    let m;
    while ((m = headingRegex.exec(html)) !== null) {
      const tag = m[1];
      const inner = m[3].replace(/<[^>]*>/g, '').trim();
      if (!inner) continue;
      const base = inner.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '').trim().replace(/\s+/g, '-');
      let slug = base || 'heading';
      let i = 1;
      while (slugs[slug]) { slug = base + '-' + (i++); }
      slugs[slug] = true;
      items.push({ level: parseInt(tag.substr(1), 10), text: inner, slug });
    }
    if (!items.length) return '';
    let out = '<ul class="toc-list">';
    for (const it of items) {
      out += `<li class="toc-item toc-h${it.level}"><a href="#${it.slug}">${it.text}</a></li>`;
    }
    out += '</ul>';
    return out;
  });

  // Add id attributes to headings (h2-h4) in rendered HTML so TOC links work
  eleventyConfig.addFilter('addHeadingIds', function(html) {
    if (!html) return '';
    const slugs = {};
    return String(html).replace(/<(h[2-4])([^>]*)>(.*?)<\/\1>/gi, function(_, tag, attrs, inner) {
      // If id already present, leave as-is
      if (/\sid=["']?([^"'\s>]+)["']?/.test(attrs)) {
        return `<${tag}${attrs}>${inner}</${tag}>`;
      }
      const text = inner.replace(/<[^>]*>/g, '').trim();
      const base = text.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '').trim().replace(/\s+/g, '-');
      let slug = base || 'heading';
      let i = 1;
      while (slugs[slug]) { slug = base + '-' + (i++); }
      slugs[slug] = true;
      return `<${tag}${attrs} id="${slug}">${inner}</${tag}>`;
    });
  });

  // Detect duplicate output paths during the build to avoid URL conflicts.
  // If two templates would write to the same `outputPath`, the build will fail
  // so the author can fix permalinks/front-matter instead of silently overwriting.
  const _seenOutputs = new Set();
  eleventyConfig.on && eleventyConfig.on('beforeBuild', () => {
    _seenOutputs.clear();
  });

  eleventyConfig.addTransform('detect-duplicate-output', function(content, outputPath) {
    if (!outputPath) return content;
    if (_seenOutputs.has(outputPath)) {
      throw new Error(`Duplicate output path detected: ${outputPath}. Resolve by adjusting permalinks or filenames.`);
    }
    _seenOutputs.add(outputPath);
    return content;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "docs"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md","njk","html"]
  };
};
