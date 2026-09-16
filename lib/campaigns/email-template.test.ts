import { describe, it, expect } from "vitest";
import { renderCampaignEmailHtml } from "@/lib/campaigns/email-template";

describe("renderCampaignEmailHtml", () => {
  it("escapes HTML in the subject and body so campaign content can't inject markup", () => {
    const html = renderCampaignEmailHtml({
      subject: "<script>alert('x')</script>",
      body: "Hello & welcome <you>",
      unsubscribeUrl: "https://example.com/unsubscribe/abc",
    });

    expect(html).not.toContain("<script>alert('x')</script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Hello &amp; welcome &lt;you&gt;");
  });

  it("converts newlines in the body to line breaks", () => {
    const html = renderCampaignEmailHtml({
      subject: "Subject",
      body: "Line one\nLine two",
      unsubscribeUrl: "https://example.com/unsubscribe/abc",
    });

    expect(html).toContain("Line one<br>Line two");
  });

  it("always includes a working unsubscribe link", () => {
    const html = renderCampaignEmailHtml({
      subject: "Subject",
      body: "Body",
      unsubscribeUrl: "https://example.com/unsubscribe/xyz",
    });

    expect(html).toContain("https://example.com/unsubscribe/xyz");
    expect(html).toContain("Unsubscribe");
  });

  it("omits the Read more block when no news post is linked", () => {
    const html = renderCampaignEmailHtml({
      subject: "Subject",
      body: "Body",
      unsubscribeUrl: "https://example.com/unsubscribe/xyz",
    });

    expect(html).not.toContain("Read more");
  });

  it("includes a Read more link when a news post is linked", () => {
    const html = renderCampaignEmailHtml({
      subject: "Subject",
      body: "Body",
      newsPostLink: "https://example.com/news/phase-2",
      unsubscribeUrl: "https://example.com/unsubscribe/xyz",
    });

    expect(html).toContain("Read more");
    expect(html).toContain("https://example.com/news/phase-2");
  });
});
