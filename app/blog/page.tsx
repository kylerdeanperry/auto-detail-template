import { createClient } from "@supabase/supabase-js"
import { clientConfig } from "@/config/client.config"
import Link from "next/link"
import { Navbar } from "@/components/sections/Navbar"
import { Footer } from "@/components/sections/Footer"

async function getPosts() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []

  const supabase = createClient(url, key)
  const { data } = await supabase
    .from("blog_posts")
    .select("title, slug, content, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  return data || []
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 80, background: clientConfig.branding.backgroundColor }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Blog</h1>
          <p style={{ fontSize: 15, color: "#666", marginBottom: 40 }}>
            Tips, insights, and updates from {clientConfig.business.name}
          </p>

          {posts.length === 0 && (
            <p style={{ fontSize: 15, color: "#999", textAlign: "center", padding: "60px 0" }}>
              No posts yet. Check back soon!
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {posts.map((post) => (
              <article key={post.slug} style={{ borderBottom: "1px solid #E5E5E3", paddingBottom: 32 }}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: clientConfig.branding.primaryColor }}>
                    {post.title}
                  </h2>
                </Link>
                <p style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>
                  {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                </p>
                <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6 }}>
                  {post.content.replace(/[#*_\[\]]/g, "").slice(0, 200)}...
                </p>
                <Link href={`/blog/${post.slug}`} style={{ fontSize: 14, color: clientConfig.branding.accentColor, fontWeight: 500, marginTop: 12, display: "inline-block" }}>
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
