import { createClient } from "@supabase/supabase-js"
import { clientConfig } from "@/config/client.config"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/sections/Navbar"
import { Footer } from "@/components/sections/Footer"
import type { Metadata } from "next"

async function getPost(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null

  const supabase = createClient(url, key)
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  return data
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Post Not Found" }

  const description = post.content.replace(/[#*_\[\]]/g, "").slice(0, 160)
  return {
    title: `${post.title} | ${clientConfig.business.name}`,
    description,
    openGraph: { title: post.title, description, type: "article", publishedTime: post.published_at },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const contentHtml = post.content
    .split("\n")
    .map((line: string) => {
      if (line.startsWith("## ")) return `<h2 style="font-size:20px;font-weight:600;margin:32px 0 12px">${line.slice(3)}</h2>`
      if (line.startsWith("### ")) return `<h3 style="font-size:17px;font-weight:600;margin:24px 0 8px">${line.slice(4)}</h3>`
      if (line.trim() === "") return "<br/>"
      const processed = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      return `<p style="font-size:15px;line-height:1.8;color:#333;margin-bottom:8px">${processed}</p>`
    })
    .join("")

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 80, background: clientConfig.branding.backgroundColor }}>
        <article style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <Link href="/blog" style={{ fontSize: 13, color: clientConfig.branding.accentColor, marginBottom: 16, display: "inline-block" }}>
            ← Back to Blog
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8, color: clientConfig.branding.primaryColor }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 13, color: "#999", marginBottom: 32 }}>
            {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
          </p>
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          <div style={{ marginTop: 48, padding: 24, background: clientConfig.branding.primaryColor, borderRadius: 12, textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 8 }}>Ready to get started?</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 16 }}>Contact {clientConfig.business.name} today</p>
            <a href={`tel:${clientConfig.business.phone}`} style={{
              display: "inline-block", padding: "10px 24px", background: clientConfig.branding.accentColor,
              color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}>
              Call {clientConfig.business.phone}
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
