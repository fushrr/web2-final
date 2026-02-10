const $ = (id) => document.getElementById(id);

function toast(type, text) {
  const t = $("toast");
  t.classList.remove("hidden", "ok", "err");
  t.classList.add(type === "ok" ? "ok" : "err");
  t.textContent = text;
  setTimeout(() => t.classList.add("hidden"), 2600);
}

function setToken(token) { localStorage.setItem("token", token); }
function getToken() { return localStorage.getItem("token"); }
function clearToken() { localStorage.removeItem("token"); }

async function request(url, method = "GET", body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = "Bearer " + token;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request error");
  return data;
}


function showAuth() {
  $("authView").classList.remove("hidden");
  $("appView").classList.add("hidden");
  $("logoutBtn").classList.add("hidden");
  $("whoami").classList.add("hidden");
}
function showApp() {
  $("authView").classList.add("hidden");
  $("appView").classList.remove("hidden");
  $("logoutBtn").classList.remove("hidden");
  $("whoami").classList.remove("hidden");
}

function setActiveTab(tab) {
  const login = tab === "login";
  $("tabLogin").classList.toggle("active", login);
  $("tabRegister").classList.toggle("active", !login);
  $("loginPane").classList.toggle("hidden", !login);
  $("registerPane").classList.toggle("hidden", login);
}

function clearPetForm() {
  $("petName").value = "";
  $("petSpecies").value = "";
  $("petBreed").value = "";
  $("petAge").value = "";
  $("petDesc").value = "";
  $("petGender").value = "unknown";
  $("petStatus").value = "available";
}

function renderProfile(u) {
  $("whoami").textContent = `${u.username} • ${u.email} • ${u.role}`;
  $("profileBox").innerHTML = `
    <div><b>Username:</b> ${u.username}</div>
    <div><b>Email:</b> ${u.email}</div>
    <div><b>Role:</b> ${u.role}</div>
  `;

  const adminCard = $("adminCard");
  if (adminCard) {
    adminCard.classList.toggle(
      "hidden",
      !(u.role === "admin" || u.role === "superadmin")
    );
  }
}




function badgeClass(status) {
  if (status === "pending") return "pending";
  if (status === "adopted") return "adopted";
  return "available";
}

function normalizeSpecies(value) {
  if (!value) return null; 

  if (value === "dog" || value === "cat") return value;

  
  if (value === "hamster" || value === "bird") return "other";

  return "other";
}



function renderPets(pets) {
  const list = $("petsList");
  if (!pets.length) {
    list.innerHTML = `<div class="empty">No pets yet. Create your first pet above.</div>`;
    return;
  }

  list.innerHTML = pets.map(p => `
    <div class="pet-card">
      <div class="pet-top">
        <div>
          <div class="pet-name">${escapeHtml(p.name)} <span class="pet-meta">(${escapeHtml(p.species)})</span></div>
          <div class="pet-meta">
            ${p.breed ? `Breed: ${escapeHtml(p.breed)} • ` : ""}
            ${p.age != null ? `Age: ${p.age} • ` : ""}
            Gender: ${escapeHtml(p.gender || "unknown")}
          </div>
          ${p.description ? `<div class="pet-meta">${escapeHtml(p.description)}</div>` : ""}
        </div>
        <div class="badge ${badgeClass(p.status)}">${p.status}</div>
      </div>

      <div class="pet-actions">
        <button class="btn-mini" data-action="status" data-id="${p._id}" data-status="available">available</button>
        <button class="btn-mini" data-action="status" data-id="${p._id}" data-status="pending">pending</button>
        <button class="btn-mini" data-action="status" data-id="${p._id}" data-status="adopted">adopted</button>
        <button class="btn-mini btn-danger" data-action="delete" data-id="${p._id}">delete</button>
      </div>
    </div>
  `).join("");
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

$("tabLogin").addEventListener("click", () => setActiveTab("login"));
$("tabRegister").addEventListener("click", () => setActiveTab("register"));

// Register
$("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const username = $("regUsername").value.trim();
    const email = $("regEmail").value.trim();
    const password = $("regPassword").value;

    await request("/api/auth/register", "POST", { username, email, password });
    toast("ok", "Account created! Now login.");
    setActiveTab("login");
    $("loginEmail").value = email;
    $("loginPassword").value = password;
  } catch (err) {
    toast("err", err.message);
  }
});

// Login
$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;

    const data = await request("/api/auth/login", "POST", { email, password });
    setToken(data.token);

    toast("ok", "Logged in!");
    showApp();
    await refreshAll();
  } catch (err) {
    toast("err", err.message);
  }
});

// Logout
$("logoutBtn").addEventListener("click", () => {
  clearToken();
  showAuth();
  setActiveTab("login");
  $("profileBox").innerHTML = `<div class="skeleton"></div>`;
  $("petsList").innerHTML = `<div class="empty">No pets loaded yet.</div>`;
  toast("ok", "Logged out.");
});

// Profile refresh
$("refreshProfileBtn").addEventListener("click", async () => {
  try {
    const u = await request("/api/users/profile");
    renderProfile(u);
    toast("ok", "Profile updated.");
  } catch (err) {
    toast("err", err.message);
  }
});

function clearProfileForm() {
  $("profileUsername").value = "";
  $("profileEmail").value = "";
}

$("clearProfileBtn").addEventListener("click", clearProfileForm);

$("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const username = $("profileUsername").value.trim();
    const email = $("profileEmail").value.trim();

    const body = {};
    if (username) body.username = username;
    if (email) body.email = email;

    if (Object.keys(body).length === 0) {
      toast("err", "Enter username or email.");
      return;
    }

    const updated = await request("/api/users/profile", "PUT", body);
    renderProfile(updated);
    toast("ok", "Profile updated!");
    clearProfileForm();
  } catch (err) {
    toast("err", err.message);
  }
});


// Create pet
$("petForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const name = $("petName").value.trim();
    const speciesUI = $("petSpecies").value;
const species = normalizeSpecies(speciesUI);

if (!species) {
  toast("err", "Please select a species.");
  return;
}

    const breed = $("petBreed").value.trim();
    const ageVal = $("petAge").value.trim();
    const age = ageVal === "" ? null : Number(ageVal);
    const gender = $("petGender").value;
    const description = $("petDesc").value.trim();
    const status = $("petStatus").value;

await request("/api/pets", "POST", {
  name,
  species,
  breed: breed === "" ? null : breed,
  age,
  gender,
  description: description === "" ? null : description,
  status,
});



    toast("ok", "Pet created.");
    clearPetForm();
    await loadPets();
  } catch (err) {
    toast("err", err.message);
  }
});

$("clearPetBtn").addEventListener("click", clearPetForm);

// Pets load
$("loadPetsBtn").addEventListener("click", loadPets);

async function loadPets() {
  const pets = await request("/api/pets");
  renderPets(pets);
}

// Pets actions 
$("petsList").addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  try {
    if (action === "delete") {
      await request(`/api/pets/${id}`, "DELETE");
      toast("ok", "Deleted.");
      await loadPets();
      return;
    }

    if (action === "status") {
      const status = btn.dataset.status;
      await request(`/api/pets/${id}`, "PUT", { status });
      toast("ok", "Updated.");
      await loadPets();
    }
  } catch (err) {
    toast("err", err.message);
  }
});

const loadUsersBtn = $("loadUsersBtn");
if (loadUsersBtn) loadUsersBtn.addEventListener("click", async () => {
  try {
    const users = await request("/api/admin/users");
const me = await request("/api/users/profile");

$("adminBox").innerHTML = users.map(u => {
  const isMe = u._id === me._id;
  const isSuper = u.role === "superadmin";

  const canChangeRole = me.role === "superadmin" && !isMe && !isSuper;

  const canKick =
    !isMe &&
    (
      (me.role === "superadmin" && !isSuper) ||
      (me.role === "admin" && u.role === "user")
    );

  return `
    <div class="admin-user">
      <div class="admin-info">
        👤 <b>${escapeHtml(u.username)}</b>
        — ${escapeHtml(u.email)}
        <span class="role">(${escapeHtml(u.role)})</span>
      </div>

      <div class="admin-actions">
        ${canChangeRole ? `
          <button class="btn-mini" data-action="promote" data-id="${u._id}">promote</button>
          <button class="btn-mini" data-action="demote" data-id="${u._id}">demote</button>
        ` : ""}

        ${canKick ? `
          <button class="btn-mini btn-danger" data-action="kick" data-id="${u._id}">kick</button>
        ` : ""}
      </div>
    </div>
  `;
}).join("");

    toast("ok", "Users loaded");
  } catch (err) {
    toast("err", err.message);
  }
});


const adminBox = $("adminBox");
if (adminBox) {
  adminBox.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    try {
      if (action === "promote") {
        await request(`/api/admin/users/${id}/role`, "PATCH", { role: "admin" });
        toast("ok", "Promoted to admin");
      }

      if (action === "demote") {
        await request(`/api/admin/users/${id}/role`, "PATCH", { role: "user" });
        toast("ok", "Demoted to user");
      }

      if (action === "kick") {
        if (!confirm("Delete this user?")) return;
        await request(`/api/admin/users/${id}`, "DELETE");
        toast("ok", "User deleted");
      }

      
      if ($("loadUsersBtn")) $("loadUsersBtn").click();
    } catch (err) {
      toast("err", err.message);
    }
  });
}


async function refreshAll() {
  $("profileBox").innerHTML = `<div class="skeleton"></div>`;
  const u = await request("/api/users/profile");
  renderProfile(u);
  await loadPets();
}

(function init() {
  setActiveTab("login");
  if (getToken()) {
    showApp();
    refreshAll().catch(() => {
      clearToken();
      showAuth();
    });
  } else {
    showAuth();
  }
})();
