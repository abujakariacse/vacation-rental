import React from "react";
import { Parallax } from "react-parallax";
import { Link } from "react-router-dom";
import AboutBanner from "../images/Aboutpage-Banner.webp";
import Swal from "sweetalert2";

const About = () => {
  const hanldlePolicies = () => {
    Swal.fire({
      title: "Terms & Conditions",
      icon: "info",
      showCloseButton: true,
      confirmButtonText: "Got it",
      confirmButtonColor: "#F43F5E",
      width: 820,
      padding: "1.25rem",
      background: "rgba(255,255,255,.92)",
      backdrop: "rgba(15, 23, 42, .55)",
      html: `
        <div class="text-left">
          <p class="text-sm text-slate-600 mt-1">
            Please review these hotel policies before confirming your booking.
          </p>

          <div class="mt-5 grid sm:grid-cols-2 gap-4">
            <div class="rounded-xl border border-slate-200 bg-white/70 p-4">
              <p class="font-semibold text-slate-900">Check-in & Check-out</p>
              <ul class="mt-2 text-sm text-slate-700 list-disc list-inside space-y-1">
                <li><b>Check-in:</b> 3:00pm</li>
                <li><b>Check-out:</b> 12:00pm</li>
              </ul>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white/70 p-4">
              <p class="font-semibold text-slate-900">Child policy</p>
              <p class="mt-2 text-sm text-slate-700">
                Children under 5 years old may share the room without additional charges using existing bedding.
              </p>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-slate-200 bg-white/70 p-4">
            <p class="font-semibold text-slate-900">Beds & baby cot</p>
            <ul class="mt-2 text-sm text-slate-700 list-disc list-inside space-y-1">
              <li><b>Rollaway beds:</b> Maximum room occupancy is two persons.</li>
              <li><b>Baby cot/crib:</b> Complimentary for one child under two years (subject to availability).</li>
            </ul>
          </div>

          <div class="mt-4 grid sm:grid-cols-2 gap-4">
            <div class="rounded-xl border border-slate-200 bg-white/70 p-4">
              <p class="font-semibold text-slate-900">Breakfast</p>
              <p class="mt-2 text-sm text-slate-700">
                Full buffet breakfast at Cafe Bazar is available at <b>USD 26</b> per adult.
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white/70 p-4">
              <p class="font-semibold text-slate-900">Transport & parking</p>
              <ul class="mt-2 text-sm text-slate-700 list-disc list-inside space-y-1">
                <li><b>Airport shuttle:</b> Available at special rates (contact concierge).</li>
                <li><b>Parking:</b> 24 hours daily, subject to availability.</li>
              </ul>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-slate-200 bg-white/70 p-4">
            <p class="font-semibold text-slate-900">Payments</p>
            <p class="mt-2 text-sm text-slate-700">
              We accept <b>Visa</b>, <b>MasterCard</b>, <b>American Express</b>, and <b>JCB</b>.
            </p>
          </div>

          <div class="mt-4 grid sm:grid-cols-2 gap-4">
            <div class="rounded-xl border border-slate-200 bg-white/70 p-4">
              <p class="font-semibold text-slate-900">Accessibility</p>
              <p class="mt-2 text-sm text-slate-700">
                Wheelchair-accessible rooms and bathrooms are available. Prior reservation is required.
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white/70 p-4">
              <p class="font-semibold text-slate-900">Smoking policy</p>
              <p class="mt-2 text-sm text-slate-700">
                No-smoking policy applies in public areas, rooms and suites. Please ask our team for designated smoking areas.
              </p>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-slate-200 bg-white/70 p-4">
            <p class="font-semibold text-slate-900">Advance purchase</p>
            <p class="mt-2 text-sm text-slate-700">
              Reservations for advance purchases are strictly non-refundable. If a refund is approved due to unforeseen circumstances,
              the hotel is not responsible for foreign currency exchange loss or bank transaction fees.
            </p>
          </div>
        </div>
      `,
    });
  };

  const blueprint = [
    {
      title: "People",
      desc: "Build and develop aligned and engaged associates to create memorable experiences for guests, associates and communities.",
      icon: "fa-users",
    },
    {
      title: "Processes",
      desc: "Simple, effective and innovative—so every stay feels smooth.",
      icon: "fa-diagram-project",
    },
    {
      title: "Positive Culture",
      desc: "Create a culture of trust through mutual respect, communication and shared success.",
      icon: "fa-handshake",
    },
    {
      title: "Profitability",
      desc: "Sustainable business and profitability that supports long-term quality.",
      icon: "fa-chart-line",
    },
  ];

  return (
    <div className="min-h-screen font-[Poppins] bg-accent">
      {/* Hero */}
      <Parallax
        bgImage={AboutBanner}
        strength={500}
        bgImageStyle={{ height: "600px", width: "100%" }}
        bgClassName="parallax-image"
      >
        <div className="parallex-gradient h-96 flex items-center">
          <div className="app-container w-full">
            <p className="text-lg text-white/90">
              Home <i className="fa-solid fa-angle-right text-xs"></i> About{" "}
              <i className="fa-solid fa-angle-right text-xs"></i>
            </p>
            <h1 className="lg:text-6xl text-4xl font-serif text-white font-semibold mt-6">
              About Us
            </h1>
            <p className="text-white/80 mt-4 max-w-2xl">
              A calm, comfortable stay—right in the heart of the city.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/room" className="btn btn-secondary text-white">
                Explore rooms
              </Link>
              <button onClick={hanldlePolicies} className="btn btn-outline text-white border-white/60">
                Hotel policies
              </button>
            </div>
          </div>
        </div>
      </Parallax>

      {/* Story + stats */}
      <section className="py-12 sm:py-16">
        <div className="app-container">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6 sm:p-8">
                <p className="text-sm font-semibold text-primary tracking-wide">Our story</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral mt-2">
                  Unwind at Vacation Rental Dhaka
                </h2>
                <p className="text-neutral/70 mt-4 leading-relaxed">
                  Be inspired by the vibrancy surrounding our premier hotel in Dhaka. Located in
                  the heart of the City Centre, our luxurious accommodation offers a calming
                  respite from the hustle and bustle of downtown Dhaka—where contemporary comfort
                  refreshes your senses.
                </p>
                <p className="text-neutral/70 mt-4 leading-relaxed">
                  Vacation Rental Group is a member of Singapore-listed AOL Group Limited, one of
                  Asia’s most established hotel and property companies with an outstanding
                  portfolio of investment and development properties.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { big: "50+", small: "Hotels & suites" },
                  { big: "31", small: "Cities worldwide" },
                  { big: "2017–2021", small: "Awarded chain" },
                  { big: "24/7", small: "Guest support" },
                ].map((s) => (
                  <div
                    key={s.small}
                    className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-lg rounded-2xl p-5"
                  >
                    <p className="text-2xl font-bold text-neutral">{s.big}</p>
                    <p className="text-sm text-neutral/60 mt-1">{s.small}</p>
                  </div>
                ))}
              </div>

              <div className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6">
                <p className="text-sm font-semibold text-neutral">Our promise</p>
                <p className="text-sm text-neutral/70 mt-2 leading-relaxed">
                  Sincerity is our hallmark. We’re known for reliable comfort, thoughtful service,
                  and simple experiences that reduce travel stress.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to="/contact" className="btn btn-primary text-white btn-sm">
                    Contact us
                  </Link>
                  <Link to="/blogs" className="btn btn-outline btn-sm">
                    Read updates
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Blueprint */}
      <section className="pb-12 sm:pb-16">
        <div className="app-container">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary tracking-wide">Vision blueprint</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral mt-2">
              Vision Blueprint (4Ps)
            </h2>
            <div className="border-b-4 w-40 border-secondary mx-auto mt-4"></div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {blueprint.map((b) => (
              <div
                key={b.title}
                className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-xl rounded-2xl p-6 hover:shadow-2xl transition"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border border-base-200/60 shadow-sm flex items-center justify-center">
                  <i className={`fa-solid ${b.icon} text-primary text-2xl sm:text-3xl`}></i>
                </div>
                <h3 className="text-lg font-bold text-neutral mt-4">{b.title}</h3>
                <p className="text-sm text-neutral/70 mt-2 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;