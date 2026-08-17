var contactNameInput = document.getElementById("contactNameInput");
var contactPhoneInput = document.getElementById("contactPhoneInput");
var contactEmailInput = document.getElementById("contactEmailInput");
var contactAddressInput = document.getElementById("contactAddressInput");
var contactGroupSelect = document.getElementById("contactGroupSelect");
var contactNotesInput = document.getElementById("contactNotesInput");
var contactFavoriteCheck = document.getElementById("contactFavoriteCheck");
var contactEmergencyCheck = document.getElementById("contactEmergencyCheck");

var contactModal = document.getElementById("contactModal");
var photoInput = document.getElementById("photoInput");
var photoPreview = document.getElementById("photoPreview");
var changePhotoBtn = document.getElementById("changePhotoBtn");
var searchInput = document.getElementById("search");

var totalCount = document.getElementById("totalCount");
var favCount = document.getElementById("favCount");
var emgCount = document.getElementById("emgCount");
var allContactsCount = document.getElementById("allContactsCount");

var contactsGrid = document.getElementById("contactsGrid");
var favoritesList = document.getElementById("favoritesList");
var emergencyList = document.getElementById("emergencyList");

var contactList = JSON.parse(localStorage.getItem("contacts")) || [];
var photoDataUrl = "";

if (searchInput) {
  searchInput.addEventListener("input", renderContacts);
}

if (changePhotoBtn) {
  changePhotoBtn.addEventListener("click", function () {
    photoInput.click();
  });
}

if (photoInput) {
  photoInput.addEventListener("change", function () {
    var file = photoInput.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function (event) {
      photoDataUrl = event.target.result;
      photoPreview.innerHTML =
        '<img src="' + photoDataUrl + '" alt="Selected photo">';
    };
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value) {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map(function (part) {
      return part[0];
    })
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function openContactModal() {
  contactModal.classList.remove("d-none");
  contactModal.classList.add("d-flex");
}

function closeContactModal() {
  contactModal.classList.remove("d-flex");
  contactModal.classList.add("d-none");
  resetContactForm();
}

function validateContactForm() {
  if (contactNameInput.value.trim().length < 3) {
    alert("Name must be at least 3 characters");
    return false;
  }

  var phoneRegex = /^01[0-2,5][0-9]{8}$/;
  if (!phoneRegex.test(contactPhoneInput.value)) {
    alert("Please enter a valid phone number");
    return false;
  }

  if (contactEmailInput.value.trim() !== "") {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmailInput.value)) {
      alert("Please enter a valid email");
      return false;
    }
  }

  return true;
}

function saveContact() {
  if (!validateContactForm()) {
    return;
  }

  var contact = {
    name: contactNameInput.value.trim(),
    phone: contactPhoneInput.value.trim(),
    email: contactEmailInput.value.trim(),
    address: contactAddressInput.value.trim(),
    group: contactGroupSelect.value,
    notes: contactNotesInput.value.trim(),
    photo: photoDataUrl,
    favorite: contactFavoriteCheck.checked,
    emergency: contactEmergencyCheck.checked,
  };

  contactList.push(contact);
  localStorage.setItem("contacts", JSON.stringify(contactList));

  renderContacts();
  closeContactModal();
}

function resetContactForm() {
  contactNameInput.value = "";
  contactPhoneInput.value = "";
  contactEmailInput.value = "";
  contactAddressInput.value = "";
  contactGroupSelect.value = "";
  contactNotesInput.value = "";
  contactFavoriteCheck.checked = false;
  contactEmergencyCheck.checked = false;
  photoDataUrl = "";
  photoPreview.innerHTML = '<i class="fa-solid fa-user"></i>';
}

function deleteContact(index) {
  contactList.splice(index, 1);
  localStorage.setItem("contacts", JSON.stringify(contactList));
  renderContacts();
}

function buildContactCard(contact, index) {
  var avatar = contact.photo
    ? '<img src="' +
      contact.photo +
      '" alt="' +
      escapeHtml(contact.name) +
      '" class="contact-card__avatar" style="object-fit:cover;">'
    : '<div class="contact-card__avatar">' +
      getInitials(contact.name) +
      "</div>";

  var emailRow = contact.email
    ? '<div class="d-flex align-items-center gap-2 contact-card__meta"><i class="fa-solid fa-envelope"></i><span>' +
      escapeHtml(contact.email) +
      "</span></div>"
    : "";

  var addressRow = contact.address
    ? '<div class="d-flex align-items-center gap-2 contact-card__meta mt-1"><i class="fa-solid fa-location-dot"></i><span>' +
      escapeHtml(contact.address) +
      "</span></div>"
    : "";

  var groupBadge = contact.group
    ? '<span class="badge bg-primary text-capitalize">' +
      escapeHtml(contact.group) +
      "</span>"
    : "";

  var favoriteBadge = contact.favorite
    ? '<span class="badge" style="background:var(--color-favorite-soft);color:var(--color-favorite);" title="Favorite"><i class="fa-solid fa-star"></i></span>'
    : "";

  var emergencyBadge = contact.emergency
    ? '<span class="badge" style="background:var(--color-emergency-soft);color:var(--color-emergency);" title="Emergency"><i class="fa-solid fa-heart-pulse"></i></span>'
    : "";

  var emailAction = contact.email
    ? '<a href="mailto:' +
      escapeHtml(contact.email) +
      '" class="contact-action-btn"><i class="fa-solid fa-envelope"></i></a>'
    : "";

  return (
    '<div class="col-12 col-md-6 col-xl-4 mb-4">' +
    '<div class="contact-card">' +
    '<div class="d-flex align-items-center gap-3 mb-3">' +
    avatar +
    '<div class="flex-grow-1 text-truncate">' +
    '<h3 class="contact-card__name text-truncate m-0">' +
    escapeHtml(contact.name) +
    "</h3>" +
    '<span class="contact-card__meta"><i class="fa-solid fa-phone"></i> ' +
    escapeHtml(contact.phone) +
    "</span>" +
    "</div>" +
    "</div>" +
    emailRow +
    addressRow +
    '<div class="d-flex flex-wrap gap-2 contact-card__badges mt-2">' +
    groupBadge +
    favoriteBadge +
    emergencyBadge +
    "</div>" +
    '<div class="d-flex justify-content-between contact-card__actions">' +
    '<a href="tel:' +
    escapeHtml(contact.phone) +
    '" class="contact-action-btn"><i class="fa-solid fa-phone"></i></a>' +
    emailAction +
    '<button type="button" class="contact-action-btn contact-action-btn--danger" onclick="deleteContact(' +
    index +
    ')"><i class="fa-solid fa-trash"></i></button>' +
    "</div>" +
    "</div>" +
    "</div>"
  );
}

function renderContacts() {
  var query = searchInput ? searchInput.value.toLowerCase() : "";
  var cardsMarkup = "";

  for (var i = 0; i < contactList.length; i++) {
    var contact = contactList[i];
    var matchesQuery =
      contact.name.toLowerCase().includes(query) ||
      (contact.phone && contact.phone.includes(query)) ||
      (contact.email && contact.email.toLowerCase().includes(query));

    if (matchesQuery) {
      cardsMarkup += buildContactCard(contact, i);
    }
  }

  if (contactList.length === 0) {
    cardsMarkup =
      '<div class="col-12"><div class="empty-state py-5"><i class="fa-solid fa-address-book"></i><span>No contacts yet — add your first one</span></div></div>';
  } else if (cardsMarkup === "") {
    cardsMarkup =
      '<div class="col-12"><div class="empty-state py-5"><i class="fa-solid fa-magnifying-glass"></i><span>No contacts match your search</span></div></div>';
  }

  contactsGrid.innerHTML = cardsMarkup;

  updateSummaryCounts();
  renderFavorites();
  renderEmergencyContacts();
}

function updateSummaryCounts() {
  totalCount.textContent = contactList.length;
  allContactsCount.textContent = contactList.length;
}

function renderFavorites() {
  var markup = "";
  var favoriteCount = 0;

  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].favorite) {
      favoriteCount++;
      markup += buildMiniContact(contactList[i], "primary");
    }
  }

  favCount.textContent = favoriteCount;
  favoritesList.innerHTML =
    favoriteCount > 0
      ? markup
      : '<div class="empty-state"><i class="fa-solid fa-star"></i><span>No favorite contacts yet</span></div>';
}

function renderEmergencyContacts() {
  var markup = "";
  var emergencyCount = 0;

  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].emergency) {
      emergencyCount++;
      markup += buildMiniContact(contactList[i], "danger");
    }
  }

  emgCount.textContent = emergencyCount;
  emergencyList.innerHTML =
    emergencyCount > 0
      ? markup
      : '<div class="empty-state"><i class="fa-solid fa-heart-pulse"></i><span>No emergency contacts yet</span></div>';
}

function buildMiniContact(contact, variant) {
  var callBtnClass =
    variant === "danger"
      ? "mini-contact__call-btn mini-contact__call-btn--danger"
      : "mini-contact__call-btn";

  return (
    '<div class="mini-contact">' +
    '<div class="text-truncate">' +
    '<div class="mini-contact__name text-truncate">' +
    escapeHtml(contact.name) +
    "</div>" +
    '<div class="mini-contact__phone text-truncate">' +
    escapeHtml(contact.phone) +
    "</div>" +
    "</div>" +
    '<a href="tel:' +
    escapeHtml(contact.phone) +
    '" class="' +
    callBtnClass +
    '">' +
    '<i class="fa-solid fa-phone fa-xs"></i>' +
    "</a>" +
    "</div>"
  );
}

renderContacts();
