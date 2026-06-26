import React from "react";

const DEFAULT_ITEMS = [
  { icon: "fa-mug-hot", title: "Tea & Coffee", desc: "Enjoy complimentary tea/coffee any time." },
  { icon: "fa-shower", title: "Hot Showers", desc: "24/7 hot water with clean bathrooms." },
  { icon: "fa-jug-detergent", title: "Laundry", desc: "Laundry support available on request." },
  { icon: "fa-fan", title: "Air Conditioning", desc: "Comfortable cooling for a better stay." },
  { icon: "fa-wifi", title: "Free Wi‑Fi", desc: "Fast internet for work and entertainment." },
  { icon: "fa-fire-burner", title: "Kitchen", desc: "Kitchen access for simple meals." },
  { icon: "fa-shirt", title: "Ironing", desc: "Iron and board available on request." },
  { icon: "fa-lock", title: "Secure Lockers", desc: "Keep your valuables safe and secure." },
];

const Amenities = ({ styles = {}, items = DEFAULT_ITEMS }) => {
  const { display, gridCols, marginX, paddingY, marginY } = styles;
  const gridClass = `${display || "grid"} ${gridCols || "grid-cols-1 sm:grid-cols-2"} ${
    marginX || ""
  } ${marginY || "mt-6"} ${paddingY || ""} gap-4 sm:gap-5`;

  return (
    <div className={gridClass}>
      {items.map((item) => (
        <div
          key={item.title}
          className="bg-base-100/70 backdrop-blur-xl border border-base-200/60 shadow-lg rounded-2xl p-5 hover:shadow-xl transition"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shrink-0">
              <i className={`fa-solid ${item.icon} text-xl`}></i>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-neutral">{item.title}</h3>
              <p className="text-sm text-neutral/70 mt-1">{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Amenities;