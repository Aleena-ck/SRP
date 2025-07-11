import React from "react";

const LearnMore = () => {
  return (
    <div className="max-w-6xl mx-auto px-8 py-12 text-[#1c0d0d] leading-relaxed">
      <h1 className="text-3xl font-bold mb-8 text-center">Learn About Blood Donation</h1>

      {/* Why Blood is Needed */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">🩸 Why Do People Need Blood?</h2>
        <p>
          Blood is vital for treating patients during surgeries, childbirth, cancer therapies, trauma, anemia, and chronic illnesses like thalassemia and sickle cell disease. Every drop counts and can save lives.
        </p>
      </section>

      {/* Types of Donation */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">🧪 Types of Blood Donation</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Whole Blood:</strong> Most common. Can be donated every 8 weeks.</li>
          <li><strong>Platelets:</strong> Used for cancer patients. Can be donated every 7 days.</li>
          <li><strong>Plasma:</strong> Can be donated every 28 days.</li>
          <li><strong>Double Red Cells:</strong> Donated every 16 weeks. Requires special equipment.</li>
        </ul>
      </section>

      {/* Eligibility Criteria */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">✅ Eligibility Criteria</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Age 18–65 years</li>
          <li>Minimum weight: 50 kg</li>
          <li>Good general health (no fever, cold, etc.)</li>
          <li>No recent tattoos or piercings (within 6 months)</li>
          <li>Iron levels must be normal</li>
        </ul>
      </section>

      {/* Blood Types */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">🧬 Blood Types & Compatibility</h2>
        <p>
          O- is the universal donor and AB+ is the universal recipient. Some types like O- and B- are always in high demand.
        </p>
      </section>

      {/* Who Shouldn’t Donate Temporarily */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">🚫 Who Can’t Donate (Temporarily)</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>After surgery or dental treatment</li>
          <li>If currently menstruating and feeling weak</li>
          <li>Pregnant or just delivered a baby</li>
          <li>On specific medications</li>
          <li>Recent travel to malaria-prone areas</li>
        </ul>
      </section>

      {/* Before & After Donation */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">📌 Before and After Donation</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Stay well-hydrated and have a light meal before donating</li>
          <li>Avoid smoking or alcohol right before or after</li>
          <li>Rest and avoid strenuous activity after donating</li>
        </ul>
      </section>

      {/* Myths */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">💡 Common Myths</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>"I’ll feel very weak" – Usually false. Most people feel fine with some rest.</li>
          <li>"You can get infections" – Not true. Sterile, one-time-use equipment is used.</li>
          <li>"I don’t have rare blood, so I’m not needed" – All types are needed!</li>
        </ul>
      </section>

      {/* College Initiative */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">🎓 College Student Involvement</h2>
        <p>
          Our platform connects college students with blood banks and hospitals. Colleges act as nodal centers, making it easy for students to register, track donations, and contribute to organized drives.
        </p>
      </section>
    </div>
  );
};

export default LearnMore;
