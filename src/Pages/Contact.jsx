import React, { useState } from "react";
import { Parallax } from "react-parallax";
import ConactBanner from "../images/blog-4.webp";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { ENDPOINT } from "../config/env";

const Contact = () => {
  const [sending, setSending] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    if (!data.name || !data.email || !data.subject || !data.message) {
      return toast.error("Please fill in all fields.");
    }

    setSending(true);
    try {
      const res = await fetch(`${ENDPOINT}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Message Sent!",
          text: "We'll get back to you as soon as possible.",
          showConfirmButton: false,
          timer: 2000,
        });
        form.reset();
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Failed to send",
          text: result.error || "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Network error",
        text: "Could not reach the server. Please try again later.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent font-[Poppins]">
      <Parallax
        bgImage={ConactBanner}
        bgImageStyle={{ height: "600px", width: "100%" }}
        strength={400}
        bgClassName="parallax-image"
      >
        <div className="parallex-gradient h-96 flex items-center">
          <div className="app-container">
            <p className="text-lg text-white/90 mt-14 lg:mt-0">
              Home <i className="fa-solid fa-angle-right text-xs"></i> Contact{" "}
              <i className="fa-solid fa-angle-right text-xs"></i>
            </p>
            <h1 className="lg:text-6xl text-4xl font-serif text-white font-semibold mt-6 lg:mt-8">
              Contact
            </h1>
            <p className="text-white/80 mt-4 max-w-2xl">
              Send us a message and we’ll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </Parallax>

      <section className="section-y">
        <div className="app-container">
          {/* Quick contact cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <p className="mt-4 text-sm font-semibold text-neutral">Address</p>
              <p className="mt-1 text-sm text-neutral/70 leading-relaxed">
                Tejgaon Industrial Area, Dhaka, Bangladesh
              </p>
            </div>
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <i className="fa-solid fa-phone"></i>
              </div>
              <p className="mt-4 text-sm font-semibold text-neutral">Phone</p>
              <p className="mt-1 text-sm text-neutral/70">+8801316460386</p>
            </div>
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <p className="mt-4 text-sm font-semibold text-neutral">Email</p>
              <p className="mt-1 text-sm text-neutral/70">info@rental.abujakaria.dev</p>
            </div>
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <i className="fa-solid fa-earth-asia"></i>
              </div>
              <p className="mt-4 text-sm font-semibold text-neutral">Website</p>
              <p className="mt-1 text-sm text-neutral/70">rental.abujakaria.dev</p>
            </div>
          </div>

          <div className="mt-8 grid lg:grid-cols-12 gap-6 items-start">
            {/* Form */}
            <div className="lg:col-span-8 bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-primary tracking-wide">Send a message</p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-neutral mt-2">Get in touch</h2>
                  <p className="text-neutral/70 mt-2">
                    We’re open for suggestions or just a friendly chat.
                  </p>
                </div>
                <div className="text-xs text-neutral/60">Usually replies within 24 hours</div>
              </div>

              <form onSubmit={sendEmail} className="mt-6 contact-form">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral/70" htmlFor="name">
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Jane Doe"
                      className="mt-2 input input-bordered w-full rounded-2xl bg-base-100/60 border-base-200/60 focus:outline-none focus:border-primary/60"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral/70" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="jane@example.com"
                      className="mt-2 input input-bordered w-full rounded-2xl bg-base-100/60 border-base-200/60 focus:outline-none focus:border-primary/60"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-neutral/70" htmlFor="subject">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    className="mt-2 input input-bordered w-full rounded-2xl bg-base-100/60 border-base-200/60 focus:outline-none focus:border-primary/60"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-neutral/70" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="mt-2 textarea textarea-bordered w-full rounded-2xl bg-base-100/60 border-base-200/60 focus:outline-none focus:border-primary/60 resize-none min-h-[140px]"
                    placeholder="Tell us a bit about what you’re looking for..."
                    required
                  ></textarea>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-xs text-neutral/60 leading-relaxed">
                    By sending this message, you agree to be contacted back at the email address you
                    provided.
                  </p>
                  <button type="submit" className="btn btn-secondary text-white" disabled={sending}>
                    {sending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message
                        <i className="fa-solid fa-paper-plane ml-2"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-secondary shadow-xl text-white rounded-2xl overflow-hidden">
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl font-semibold">Contact details</h3>
                  <p className="text-sm text-white/90 mt-2">
                    Prefer a faster channel? Reach us any time.
                  </p>

                  <div className="mt-6 space-y-4 text-sm">
                    <div className="flex gap-4">
                      <i className="text-xl border border-white/25 p-3 rounded-2xl fa-solid fa-location-dot"></i>
                      <div className="leading-relaxed">
                        <p className="font-bold">Address</p>
                        <p className="text-white/90">Tejgaon Industrial Area, Dhaka, Bangladesh</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <i className="text-xl border border-white/25 p-3 rounded-2xl fa-solid fa-phone"></i>
                      <div>
                        <p className="font-bold">Phone</p>
                        <p className="text-white/90">+8801316460386</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <i className="text-xl border border-white/25 p-3 rounded-2xl fa-solid fa-envelope"></i>
                      <div>
                        <p className="font-bold">Email</p>
                        <p className="text-white/90">info@rental.abujakaria.dev</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/15">
                    <p className="text-xs font-semibold tracking-wider uppercase text-white/80">
                      Hours
                    </p>
                    <p className="mt-2 text-sm text-white/90">
                      Mon–Fri: 9:00–18:00
                      <br />
                      Sat–Sun: 10:00–16:00
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl overflow-hidden">
                <div className="p-6">
                  <p className="text-sm font-semibold text-neutral">Location</p>
                  <p className="text-sm text-neutral/70 mt-1">Find us on the map.</p>
                </div>
                <div className="h-56 border-t border-base-200/60 bg-base-100/40">
                  <iframe
                    title="Tejgaon Industrial Area map"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=Tejgaon%20Industrial%20Area%2C%20Dhaka%2C%20Bangladesh&output=embed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
