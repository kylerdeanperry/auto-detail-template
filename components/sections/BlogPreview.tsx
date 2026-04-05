import { createClient } from "@supabase/supabase-js"
import { clientConfig } from "@/config/client.config"
import Link from "next/link"

async function getLatestPosts() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []

  const supabase = createClient(url, key)
  const { data } = await supabase
    .from("blog_posts")
    .select("title, slug, content, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3)

  return data || []
}

export async function BlogPreview() {
  const posts = await getLatestPosts()
  if (posts.length === 0) return null

  return (
    <section style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: clientConfig.branding.accentColor, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            Our Blog
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: clientConfig.branding.primaryColor }}>
            Latest Tips & Insights
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <article style={{ padding: 24, borderRadius: 12, border: "1px solid #E5E5E3", height: "100%", transition: "box-shadow 200ms" }}>
                <p style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>
                  {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                </p>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: clientConfig.branding.primaryColor }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>
                  {post.content.replace(/[#*_\[\]]/g, "").slice(0, 120)}...
                </p>
                <span style={{ fontSize: 13, color: clientConfig.branding.accentColor, fontWeight: 500, marginTop: 12, display: "inline-block" }}>
                  Read more →
                </span>
              </article>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/blog" style={{
            display: "inline-block", padding: "10px 24px", border: `1px solid ${clientConfig.branding.accentColor}`,
            color: clientConfig.branding.accentColor, borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none",
          }}>
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  )
}
