import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import blogData from "../../config/blog";

export default function BlogDetail() {
  const { slug } = useParams();
  const item = blogData.find((blogPost) => blogPost.slug === slug);
  const descriptionParagraphs = (item?.description ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const linksDelay = `${380 + descriptionParagraphs.length * 80}ms`;

  if (!item) {
    return (
      <section className="p-4">
        <Link className="detail-item-anim inline-flex items-center gap-2 mb-4 !no-underline" style={{ "--detail-delay": "60ms" }} to="/blog">
          <FaArrowLeft />
          Back to blogs
        </Link>
        <h2 className="detail-item-anim text-3xl mb-2" style={{ "--detail-delay": "140ms" }}>Post not found</h2>
      </section>
    );
  }

  return (
    <section className="p-4">
      <Link className="detail-item-anim inline-flex items-center gap-2 mb-4 !no-underline" style={{ "--detail-delay": "60ms" }} to="/blog">
        <FaArrowLeft />
        Back to blogs
      </Link>
      <h2 className="detail-item-anim text-3xl md:text-4xl mb-2" style={{ "--detail-delay": "140ms" }}>{item.title}</h2>
      <p className="detail-item-anim text-sm opacity-80 mb-4" style={{ "--detail-delay": "220ms" }}>{item.date}</p>
      <img src={item.image} alt={item.title} className="detail-item-anim w-full h-72 object-cover mb-4" style={{ "--detail-delay": "300ms" }} />
      {descriptionParagraphs.map((paragraph, index) => (
        <p
          key={`${item.slug}-paragraph-${index}`}
          className="detail-item-anim mb-4 leading-relaxed"
          style={{ "--detail-delay": `${380 + index * 80}ms` }}
        >
          {paragraph}
        </p>
      ))}

      {item.links && (
        <div className="detail-item-anim flex flex-wrap gap-3" style={{ "--detail-delay": linksDelay }}>
          {Object.entries(item.links).map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
