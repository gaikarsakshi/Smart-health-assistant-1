// Smart Health & Fitness Assistant
// User CRUD + Wellness Analysis + Local Storage

const STORAGE_KEY = "smartHealthUsers";

const FALLBACK_TIPS = {
  "Weight Loss": [
    "Maintain a small calorie deficit and prefer home-cooked meals.",
    "Eat more fibre-rich foods such as salad, sprouts and oats.",
    "Limit sugary drinks and prefer water or green tea.",
    "Track portions and avoid fried snacks."
  ],

  "Muscle Gain": [
    "Eat protein-rich foods such as dal, paneer, eggs and curd.",
    "Aim for adequate protein throughout the day.",
    "Progress strength training gradually.",
    "Take a protein-rich snack after your workout."
  ],

  "General Fitness": [
    "Follow a balanced diet with fruits and vegetables.",
    "Walk at least 7,000 steps a day.",
    "Drink at least 8 glasses of water.",
    "Sleep 7-8 hours on a consistent schedule."
  ]
};


// -----------------------------
// Default Users
// -----------------------------

const DEFAULT_USERS = [
  {
    name: "Aarav Sharma",
    goal: "Weight Loss",
    activity: "Low",
    sleep: 6,
    water: 5
  },
  {
    name: "Sakshi Gaikar",
    goal: "Weight Loss",
    activity: "Moderate",
    sleep: 7.5,
    water: 9
  },
  {
    name: "Priya Patel",
    goal: "General Fitness",
    activity: "High",
    sleep: 8,
    water: 9
  },
  {
    name: "Rohit Mehta",
    goal: "Muscle Gain",
    activity: "Moderate",
    sleep: 6.5,
    water: 7
  },
  {
    name: "Neha Iyer",
    goal: "Muscle Gain",
    activity: "Low",
    sleep: 5,
    water: 4
  }
];


// -----------------------------
// Local Storage
// -----------------------------

function getUsers() {

  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.log("Storage error:", error);
    }
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(DEFAULT_USERS)
  );

  return [...DEFAULT_USERS];
}


function saveUsers(users) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(users)
  );
}


// -----------------------------
// Wellness Score
// -----------------------------

function calcScore(sleep, water, activity) {

  let score = 50;

  if (sleep >= 7 && sleep <= 9) {
    score += 25;
  } else if (sleep >= 6) {
    score += 10;
  }

  if (water >= 8) {
    score += 25;
  } else if (water >= 5) {
    score += 10;
  }

  if (activity === "Moderate") {
    score += 5;
  }

  if (activity === "High") {
    score += 10;
  }

  return Math.min(score, 100);
}


// -----------------------------
// Status
// -----------------------------

function getStatus(score) {

  if (score >= 75) {
    return {
      text: "On Track",
      className: "good"
    };
  }

  if (score >= 60) {
    return {
      text: "Average",
      className: "warn"
    };
  }

  return {
    text: "Needs Improvement",
    className: "bad"
  };
}


// -----------------------------
// Validation
// -----------------------------

function validate(data) {

  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = "Please enter your name.";
  }

  const age = parseInt(data.age);

  if (isNaN(age) || age < 10 || age > 100) {
    errors.age = "Age must be between 10 and 100.";
  }

  const sleep = parseFloat(data.sleep);

  if (
    isNaN(sleep) ||
    sleep < 0 ||
    sleep > 24
  ) {
    errors.sleep = "Sleep must be between 0 and 24 hours.";
  }

  const water = parseFloat(data.water);

  if (
    isNaN(water) ||
    water < 0 ||
    water > 30
  ) {
    errors.water = "Water must be between 0 and 30 glasses.";
  }

  return errors;
}


// -----------------------------
// Tabs
// -----------------------------

function showTab(id) {

  document.querySelectorAll(".tabs a").forEach(a => {

    a.classList.toggle(
      "active",
      a.dataset.tab === id
    );

  });

  document.querySelectorAll(".tab-pane").forEach(section => {

    section.classList.toggle(
      "active",
      section.id === id
    );

  });
}


document.addEventListener("click", function(event) {

  const tab = event.target.closest(".tabs a");

  if (tab) {

    event.preventDefault();

    showTab(tab.dataset.tab);
  }

});


// -----------------------------
// Render Users Table
// -----------------------------

function renderUsers() {

  const table = document.querySelector("#list table");

  if (!table) {
    return;
  }

  // Remove old rows except header
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  const users = getUsers();

  users.forEach((user, index) => {

    const row = table.insertRow();

    const score = calcScore(
      parseFloat(user.sleep),
      parseFloat(user.water),
      user.activity
    );

    const status = getStatus(score);

    row.innerHTML = `
      <td>${escapeHTML(user.name)}</td>

      <td>${escapeHTML(user.goal)}</td>

      <td>${escapeHTML(user.activity)}</td>

      <td>${user.sleep}</td>

      <td>${user.water}</td>

      <td>
        <span class="pill ${status.className}">
          ${status.text}
        </span>
      </td>

      <td>
        <button
          class="btn view"
          data-index="${index}">
          View
        </button>

        <button
          class="btn edit"
          data-index="${index}">
          Edit
        </button>

        <button
          class="btn del"
          data-index="${index}">
          Delete
        </button>
      </td>
    `;

  });

}


// -----------------------------
// Security helper
// -----------------------------

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// -----------------------------
// Add User
// -----------------------------

function addUser() {

  const name = prompt(
    "Enter User Name:"
  );

  if (!name || !name.trim()) {
    return;
  }


  const age = prompt(
    "Enter Age:",
    "20"
  );

  if (age === null) {
    return;
  }


  const goal = prompt(
    "Enter Goal:\n1. Weight Loss\n2. Muscle Gain\n3. General Fitness",
    "Weight Loss"
  );

  if (goal === null) {
    return;
  }


  const activity = prompt(
    "Enter Activity Level:\nLow / Moderate / High",
    "Moderate"
  );

  if (activity === null) {
    return;
  }


  const sleep = prompt(
    "Enter Sleep Hours:",
    "7"
  );

  if (sleep === null) {
    return;
  }


  const water = prompt(
    "Enter Water Glasses:",
    "8"
  );

  if (water === null) {
    return;
  }


  let finalGoal = goal;

  if (goal === "1") {
    finalGoal = "Weight Loss";
  }

  if (goal === "2") {
    finalGoal = "Muscle Gain";
  }

  if (goal === "3") {
    finalGoal = "General Fitness";
  }


  let finalActivity =
    activity.trim().toLowerCase();

  if (finalActivity === "low") {
    finalActivity = "Low";
  } else if (finalActivity === "high") {
    finalActivity = "High";
  } else {
    finalActivity = "Moderate";
  }


  const newUser = {

    name: name.trim(),

    age: parseInt(age) || 20,

    goal: finalGoal,

    activity: finalActivity,

    sleep: parseFloat(sleep) || 0,

    water: parseFloat(water) || 0

  };


  const users = getUsers();

  users.push(newUser);

  saveUsers(users);

  renderUsers();

  alert(
    "User added successfully! ✅"
  );
}


// -----------------------------
// View User
// -----------------------------

function viewUser(index) {

  const users = getUsers();

  const user = users[index];

  if (!user) {
    return;
  }

  const score = calcScore(
    parseFloat(user.sleep),
    parseFloat(user.water),
    user.activity
  );

  const status = getStatus(score);

  alert(
    "USER DETAILS\n\n" +
    "Name: " + user.name + "\n" +
    "Age: " + user.age + "\n" +
    "Goal: " + user.goal + "\n" +
    "Activity: " + user.activity + "\n" +
    "Sleep: " + user.sleep + " hours\n" +
    "Water: " + user.water + " glasses\n" +
    "Wellness Score: " + score + "/100\n" +
    "Status: " + status.text
  );
}


// -----------------------------
// Edit User
// -----------------------------

function editUser(index) {

  const users = getUsers();

  const user = users[index];

  if (!user) {
    return;
  }


  const name = prompt(
    "Edit Name:",
    user.name
  );

  if (name === null) {
    return;
  }


  const age = prompt(
    "Edit Age:",
    user.age
  );

  if (age === null) {
    return;
  }


  const goal = prompt(
    "Edit Goal:\nWeight Loss / Muscle Gain / General Fitness",
    user.goal
  );

  if (goal === null) {
    return;
  }


  const activity = prompt(
    "Edit Activity:\nLow / Moderate / High",
    user.activity
  );

  if (activity === null) {
    return;
  }


  const sleep = prompt(
    "Edit Sleep Hours:",
    user.sleep
  );

  if (sleep === null) {
    return;
  }


  const water = prompt(
    "Edit Water Glasses:",
    user.water
  );

  if (water === null) {
    return;
  }


  user.name = name.trim();

  user.age = parseInt(age) || user.age;

  user.goal = goal;

  user.activity = activity;

  user.sleep = parseFloat(sleep) || 0;

  user.water = parseFloat(water) || 0;


  saveUsers(users);

  renderUsers();

  alert(
    "User updated successfully! ✅"
  );
}


// -----------------------------
// Delete User
// -----------------------------

function deleteUser(index) {

  const users = getUsers();

  const user = users[index];

  if (!user) {
    return;
  }


  const confirmed = confirm(
    "Are you sure you want to delete " +
    user.name +
    "?"
  );

  if (!confirmed) {
    return;
  }


  users.splice(index, 1);

  saveUsers(users);

  renderUsers();

  alert(
    "User deleted successfully! ✅"
  );
}


// -----------------------------
// Table Button Events
// -----------------------------

document.addEventListener(
  "click",
  function(event) {

    if (
      event.target.classList.contains("view")
    ) {

      const index =
        parseInt(
          event.target.dataset.index
        );

      viewUser(index);

    }


    if (
      event.target.classList.contains("edit")
    ) {

      const index =
        parseInt(
          event.target.dataset.index
        );

      editUser(index);

    }


    if (
      event.target.classList.contains("del")
    ) {

      const index =
        parseInt(
          event.target.dataset.index
        );

      deleteUser(index);

    }

  }
);


// -----------------------------
// Add New User Button
// -----------------------------

document.addEventListener(
  "click",
  function(event) {

    const button =
      event.target.closest(
        "#list .section-head .btn.primary"
      );

    if (button) {

      event.preventDefault();

      addUser();
    }

  }
);


// -----------------------------
// Apply Session Form
// -----------------------------

const form =
  document.getElementById("frm");


if (form) {

  form.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const formData =
        new FormData(form);

      const data =
        Object.fromEntries(
          formData.entries()
        );


      const errors =
        validate(data);

      const errorBox =
        document.getElementById("errs");

      errorBox.innerHTML = "";


      if (
        Object.keys(errors).length
      ) {

        errorBox.innerHTML =
          '<div class="error">' +
          "<b>Validation failed:</b> " +
          Object.values(errors).join(" ") +
          "</div>";

        return;
      }


      const sleep =
        parseFloat(data.sleep);

      const water =
        parseFloat(data.water);


      const score =
        calcScore(
          sleep,
          water,
          data.activity
        );


      const tips =
        FALLBACK_TIPS[data.goal];


      // Add/update user in local storage

      const users =
        getUsers();


      const existingIndex =
        users.findIndex(
          user =>
            user.name.toLowerCase() ===
            data.name.toLowerCase()
        );


      const newUser = {

        name: data.name,

        age: parseInt(data.age),

        goal: data.goal,

        activity: data.activity,

        sleep: sleep,

        water: water

      };


      if (existingIndex >= 0) {

        users[existingIndex] =
          newUser;

      } else {

        users.push(newUser);

      }


      saveUsers(users);

      renderUsers();


      const aiSrc =
        "Rule-based AI wellness analysis";


      document.getElementById(
        "result"
      ).innerHTML = `

        <h2>
          AI-Generated Wellness Plan -
          ${escapeHTML(data.name)}
        </h2>

        <p style="color:#475569;margin-bottom:8px;">

          Goal:
          <b>${escapeHTML(data.goal)}</b>

          |

          Activity:
          <b>${escapeHTML(data.activity)}</b>

          |

          Wellness Score:

          <span class="pill good">
            ${score} / 100
          </span>

        </p>


        <div class="banner">

          <b>
            AI Wellness Suggestions
            (${aiSrc}):
          </b>

          <br/>

          ${tips
            .slice(0, 4)
            .map(
              (tip, i) =>
                `${i + 1}. ${escapeHTML(tip)}`
            )
            .join("<br/>")}

        </div>


        <table
          class="ai-table"
          style="margin-top:18px;"
        >

          <tr>
            <th>AI Insight</th>
            <th>Explanation</th>
          </tr>


          <tr>

            <td>
              Sleep consistency
            </td>

            <td>
              Sleep of ${sleep} hrs is
              ${
                sleep >= 7
                  ? "in the ideal range"
                  : "below the 7-9 hour recommendation"
              }.
            </td>

          </tr>


          <tr>

            <td>
              Hydration
            </td>

            <td>
              ${water} glasses/day -
              ${
                water >= 8
                  ? "excellent, keep it up"
                  : "try to drink at least 8 glasses"
              }.
            </td>

          </tr>


          <tr>

            <td>
              Activity mix
            </td>

            <td>
              Your activity level is
              <b>
                ${escapeHTML(data.activity)}
              </b>
              -
              ${
                data.activity === "Low"
                  ? "add 30 min brisk walking 5x/week"
                  : "maintain activity and add strength training"
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


      alert(
        "Wellness session saved successfully! ✅"
      );

    }
  );

}


// -----------------------------
// Page Load
// -----------------------------

document.addEventListener(
  "DOMContentLoaded",
  function() {

    // Initialize storage
    getUsers();

    // Display saved users
    renderUsers();

  }
);
    
