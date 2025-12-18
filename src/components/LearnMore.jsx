import React from "react";
import img1 from "../assets/blood_donation.webp"
import img2 from "../assets/im2.webp"
import img3 from "../assets/im3.webp"
import img4 from "../assets/im4.webp"

const LearnMore = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-[#1c0d0d] space-y-16">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-red-700">
        Learn About Blood Donation
      </h1>

      {/* Why Blood is Needed */}
      <section className="grid md:grid-cols-2 gap-8 items-center">

      <img src={img1} alt="Blood donation" className="w-full h-auto rounded-lg shadow-md" />



        <div>
          <h2 className="text-2xl font-bold mb-4"> Why Do People Need Blood?</h2>
          <p className="text-lg leading-relaxed">
            Blood is vital for surgeries, childbirth, trauma cases, cancer treatments, and chronic diseases. Donated blood saves lives every day. A single unit can support multiple lives — in emergencies, every drop matters.
          </p>
        </div>
      </section>

      {/* Types of Donation */}
      <section className="bg-red-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4"> Types of Blood Donation</h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li><strong>Whole Blood:</strong> Most common. Can be donated every 8 weeks.</li>
          <li><strong>Platelets:</strong> Used for cancer patients. Can be donated every 7 days.</li>
          <li><strong>Plasma:</strong> Can be donated every 28 days.</li>
          <li><strong>Double Red Cells:</strong> Donated every 16 weeks. Requires special equipment.</li>
        </ul>
      </section>

      {/* Eligibility */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4"> Eligibility Criteria</h2>
          <ul className="list-disc list-inside text-lg space-y-2">
            <li>Age between 18–65 years</li>
            <li>Minimum weight: 50 kg</li>
            <li>Good general health</li>
            <li>No recent tattoos or piercings (last 6 months)</li>
            <li>Normal hemoglobin/iron levels</li>
          </ul>
        </div>
        <img src={img2} alt="Blood donation" className="w-full h-auto rounded-lg shadow-md"
        />
      </section>

      {/* Blood Types */}
      <section className="bg-[#fef2f2] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4"> Blood Types & Compatibility</h2>
        <p className="text-lg">
          O- is the universal donor and AB+ is the universal recipient. Some rare types like O- and B- are in constant demand. Knowing your blood type helps in emergencies.
        </p>
      </section>

      {/* Who Can’t Donate */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <img src={img3} alt="Blood donation" className="w-full h-auto rounded-lg shadow-md"
        />
        <div>
          <h2 className="text-2xl font-bold mb-4"> Who Shouldn’t Donate Temporarily</h2>
          <ul className="list-disc list-inside text-lg space-y-2">
            <li>Just had surgery or dental treatment</li>
            <li>Feeling weak or menstruating</li>
            <li>Pregnant or postpartum</li>
            <li>Taking certain medications</li>
            <li>Traveled recently to malaria-prone regions</li>
          </ul>
        </div>
      </section>

      {/* Before & After Donation */}
      <section className="bg-red-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4"> Before and After Donation Tips</h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>Stay hydrated and have a light meal before donating</li>
          <li>No alcohol or smoking before or after donation</li>
          <li>Rest well after donating and avoid heavy exercise</li>
        </ul>
      </section>

      {/* Myths */}
      <section className="bg-white p-6 rounded-lg border border-red-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-4"> Common Myths About Donation</h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>“I’ll feel very weak” – Most donors feel fine after a short rest.</li>
          <li>“It’s unsafe” – Sterile, single-use needles are used every time.</li>
          <li>“My blood type isn’t rare” – Every type is needed consistently.</li>
        </ul>
      </section>

      {/* College Platform Initiative */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4"> College Student Involvement</h2>
          <p className="text-lg leading-relaxed">
            Lifeblood Connect bridges college students and hospitals. Colleges act as nodal centers for blood donor registrations, organized drives, and emergency support. Your one-time donation can be the reason someone lives another day.
          </p>
        </div>
        <img
          src={img4} alt="Blood donation" className="w-full h-auto rounded-lg shadow-md"
        />
      </section>
    </div>
  );
};

export default LearnMore;
