import React, { useRef } from "react";
import messages from "./contact.messages";

export default function Contact() {
  const formRef = useRef(null);
  const formspreeCode = process.env.REACT_APP_FORMSPREE_CODE;
  const formAction = `https://formspree.io/f/${formspreeCode}`;

  const handleClear = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formRef.current) {
      return;
    }

    try {
      const response = await fetch(formAction, {
        method: "POST",
        body: new FormData(formRef.current),
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        formRef.current.reset();
      }
    } catch {
    }
  };

  return (
    <section className="flex flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <h2 className="contact-anim text-4xl mb-8" style={{ "--contact-delay": "80ms" }}>
          {messages.heading}
        </h2>

        <form
          ref={formRef}
          action={formAction}
          method="POST"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <div className="contact-anim flex flex-col gap-2" style={{ "--contact-delay": "180ms" }}>
            <label
              htmlFor="name"
              className="text-xs uppercase tracking-[0.2em] opacity-80"
            >
              {messages.name}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder={messages.placeholders.name}
              className="p-4 bg-transparent border-[1.5px] border-current focus:outline-none focus:border-opacity-100 border-opacity-30 rounded-none transition-all"
            />
          </div>

          <div className="contact-anim flex flex-col gap-2" style={{ "--contact-delay": "290ms" }}>
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-[0.2em] opacity-80"
            >
              {messages.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder={messages.placeholders.email}
              className="p-4 bg-transparent border-[1.5px] border-current focus:outline-none focus:border-opacity-100 border-opacity-30 rounded-none transition-all"
            />
          </div>

          <div className="contact-anim flex flex-col gap-2" style={{ "--contact-delay": "400ms" }}>
            <label
              htmlFor="message"
              className="text-xs uppercase tracking-[0.2em] opacity-80"
            >
              {messages.message}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows="6"
              placeholder={messages.placeholders.message}
              className="p-4 bg-transparent border-[1.5px] border-current focus:outline-none focus:border-opacity-100 border-opacity-30 rounded-none resize-none transition-all"
            />
          </div>

          <div className="contact-anim flex gap-4 mt-4" style={{ "--contact-delay": "520ms" }}>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-2 border-[1.5px] border-current text-current bg-transparent uppercase text-sm tracking-[0.2em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-none"
            >
              {messages.clear}
            </button>

            <button
              type="submit"
              className="flex-1 py-2 border-[1.5px] border-current bg-black text-white dark:bg-white dark:text-black uppercase text-sm tracking-[0.2em] hover:opacity-80 transition-all rounded-none"
            >
              {messages.submit}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

