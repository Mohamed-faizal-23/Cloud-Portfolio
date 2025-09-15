// Dark Mode Toggle
const toggleBtn = document.getElementById("darkToggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleBtn.textContent = "☀️ Light Mode";
  } else {
    toggleBtn.textContent = "🌙 Dark Mode";
  }
});

// Typing Effect
const typingElement = document.getElementById("typing");
const roles = ["🚀 Cloud Engineer (AWS)", "☁️ DevOps Enthusiast", "💻 Problem Solver"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentRole = roles[roleIndex];
  const visibleText = currentRole.substring(0, charIndex);

  typingElement.textContent = visibleText;

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex++;
    setTimeout(typeEffect, 120);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 60);
  } else {
    if (!isDeleting) {
      isDeleting = true;
      setTimeout(typeEffect, 1200); // Pause before deleting
    } else {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeEffect, 200);
    }
  }
}

typeEffect();
