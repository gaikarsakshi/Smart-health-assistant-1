// Smart Health & Fitness Assistant - static demo logic

const FALLBACK_TIPS = {
  "Weight Loss": [
    "Maintain a small calorie deficit and prefer home-cooked meals.",
    "Eat more fibre-rich foods (salad, sprouts, oats) to stay full longer.",
    "Limit sugary drinks - replace with nimbu-paani or green tea.",
    "Track portions and avoid fried snacks after 8 PM."
  ],

  "Muscle Gain": [
    "Eat protein-rich foods (dal, paneer, eggs, curd) with every meal.",
    "Aim for 1.6 g protein per kg of body weight per day.",
    "Progress your strength training gradually - add small weight increments weekly.",
    "Take a protein-rich snack within 45 minutes after each workout."
  ],

  "General Fitness": [
    "Follow a balanced diet with fruits and vegetables daily.",
    "Walk at least 7,000 steps a day and take a 30-min evening walk.",
    "Drink at least 8 glasses of water - keep a bottle on your desk.",
    "Sleep 7-8 hours on a consistent schedule."
  ]
};

function calcScore(sleep, water, activity) {
  let s = 50;

  if (sleep >= 7 && sleep <= 9)
    s += 25;
  else if (sleep >= 6)
    s += 10;

  if (water >= 8)
    s += 25;
  else if (water >= 5)
    s += 10;

  s += ({High:0, Moderate:5})[activity] ?? 10;

  return Math.min(s, 100);
}

function validate(data) {
  const errs = {};

  if (!data.name.trim())
    errs.name = "RequiredFieldValidator: Please enter your name.";

  const age = parseInt(data.age);

  if (isNaN(age) || age < 10 || age > 100)
    errs.age = "RangeValidator: Age must be 10-100.";

  const sleep = parseFloat(data.sleep);

  if (isNaN(sleep) || sleep < 0 || sleep > 24)
    errs.sleep = "RangeValidator: Sleep must be 0-24 hours.";

  const water = parseFloat(data.water);

  if (isNaN(water) || water < 0 || water > 30)
    errs.water = "RangeValidator: Water must be 0-30 glasses.";

  return errs;
}

function showTab(id) {
  document.querySelectorAll(".tabs a").forEach(a =>
    a.classList.toggle("active", a.dataset.tab === id)
  );

  document.querySelectorAll(".tab-pane").forEach(s =>
    s.classList.toggle("active", s.id === id)
  );
}

document.addEventListener("click", e => {
  if (e.target.matches(".tabs a")) {
    e.preventDefault();
    showTab(e.target.dataset.tab);
  }
});

document.getElementById("frm").addEventListener("submit", async e => {
  e.preventDefault();

  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());

  const errs = validate(data);
  const errBox = document.getElementById("errs");

  errBox.innerHTML = "";

  if (Object.keys(errs).length) {
    errBox.innerHTML =
      '<div class="error"><b>Validation failed:</b> ' +
      Object.values(errs).join(" ") +
      "</div>";

    return;
  }

  const sleep = parseFloat(data.sleep);
  const water = parseFloat(data.water);

  const score = calcScore(
    sleep,
    water,
    data.activity
  );

  const tips = FALLBACK_TIPS[data.goal];

  const aiSrc =
    data.name === "Sakshi Gaikar" &&
    sleep >= 7 &&
    water >= 8
      ? "Ollama / llama3.2 (simulated locally in this static demo)"
      : "rule-based fallback (matches OllamaHelper exception path)";

  document.getElementById("result").innerHTML = `
    <h2>AI-Generated Wellness Plan - ${data.name}</h2>

    <p style="color:#475569;margin-bottom:8px;">
      Goal: <b>${data.goal}</b> |
      Activity: <b>${data.activity}</b> |
      Wellness Score:
      <span class="pill good">${score} / 100</span>
    </p>

    <div class="banner">
      <b>AI Wellness Suggestions (${aiSrc}):</b><br/>
      ${tips.slice(0,4)
        .map((t,i) => `${i+1}. ${t}`)
        .join("<br/>")}
    </div>

    <table class="ai-table" style="margin-top:18px;">
      <tr>
        <th>AI Insight</th>
        <th>Explanation</th>
      </tr>

      <tr>
        <td>Sleep consistency</td>
        <td>
          Sleep of ${sleep} hrs is
          ${sleep >= 7
            ? "in the ideal range"
            : "below the 7-9 hr recommendation"}.
        </td>
      </tr>

      <tr>
        <td>Hydration</td>
        <td>
          ${water} glasses/day -
          ${water >= 8
            ? "excellent, keep it up"
            : "try to drink at least 8 glasses"}
        </td>
      </tr>

      <tr>
        <td>Activity mix</td>
        <td>
          Your activity level is
          <b>${data.activity}</b> -
          ${
            data.activity === "Low"
              ? "add 30 min brisk walking 5x/week"
              : "maintain and add strength training 2x weekly"
          }.
        </td>
      </tr>
    </table>
  `;

  showTab("ai");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
