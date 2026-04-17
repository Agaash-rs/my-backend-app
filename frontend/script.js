function scrollToForm() {
  document.getElementById("formSection").scrollIntoView({ behavior: "smooth" });
}

const form = document.getElementById("leadForm");
const msgEl = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    platform: document.getElementById("platform").value,
    message: document.getElementById("message").value.trim()
  };

  if (!data.name) {
    msgEl.innerText = "Name is required.";
    msgEl.style.color = "red";
    return;
  }

  if (!/^\d{10}$/.test(data.phone)) {
    msgEl.innerText = "Phone must be 10 digits.";
    msgEl.style.color = "red";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    msgEl.innerText = "Email must be valid.";
    msgEl.style.color = "red";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/leads", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    const result = await res.json();
    msgEl.innerText = result.message || "Unexpected response.";
    msgEl.style.color = res.ok ? "green" : "red";

    if (res.ok) {
      form.reset();
    }
  } catch (error) {
    msgEl.innerText = "Unable to submit form. Please try again.";
    msgEl.style.color = "red";
    console.error(error);
  }
});