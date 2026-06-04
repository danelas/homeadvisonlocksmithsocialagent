// Minimal site JS. Currently just smooth-closes <details> siblings in the FAQ
// so only one answer is open at a time. Safe no-op if those elements are absent.
document.addEventListener("click", (e) => {
  const summary = e.target.closest(".faq__item > summary");
  if (!summary) return;
  const current = summary.parentElement;
  document.querySelectorAll(".faq__item[open]").forEach((d) => {
    if (d !== current) d.removeAttribute("open");
  });
});
