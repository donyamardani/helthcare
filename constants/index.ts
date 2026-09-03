export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "دکتر جان گرین",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "دکتر لیزا کامرون",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "دکتر اوان لیوینگستون",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "دکتر پیتر ونس",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "دکتر جین پاول",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "دکتر الکس رامیرز",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "دکتر جاسمین لی",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "دکتر الینا کروز",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "دکتر حسن شریفی",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};