import type { Scholarship } from "./types";

export interface Option {
  id: string;
  bn: string;
  en: string;
  tags?: string[];
}

export interface Question {
  id: string;
  bn: string;
  en: string;
  hintBn: string;
  hintEn: string;
  options: Option[];
}

export interface Track {
  id: string;
  en: string;
  bn: string;
  category: string;
  demand: "High" | "Medium";
  salary: string;
  salaryBn: string;
  emoji: string;
}

export const QUESTIONS: Question[] = [
  {
    id: "interest",
    bn: "কোন ধরনের কাজ আপনাকে সবচেয়ে বেশি টানে?",
    en: "Which kind of work excites you the most?",
    hintBn: "একটি বেছে নিন",
    hintEn: "Pick one",
    options: [
      { id: "tech", bn: "কম্পিউটার, কোডিং ও টেকনোলজি", en: "Computers, coding & technology", tags: ["tech"] },
      { id: "design", bn: "ডিজাইন, ছবি ও সৃজনশীলতা", en: "Design, visuals & creativity", tags: ["design"] },
      { id: "business", bn: "মার্কেটিং, ব্যবসা ও উদ্যোগ", en: "Marketing, business & entrepreneurship", tags: ["business"] },
      { id: "data", bn: "নম্বর, তথ্য ও বিশ্লেষণ", en: "Numbers, data & analysis", tags: ["data"] },
      { id: "people", bn: "মানুষের সাথে কথা বলা ও সাহায্য করা", en: "Talking to & helping people", tags: ["people"] },
      { id: "content", bn: "লেখা, গল্প ও যোগাযোগ", en: "Writing, stories & communication", tags: ["content"] },
    ],
  },
  {
    id: "education",
    bn: "আপনার বর্তমান শিক্ষাগত অবস্থা কী?",
    en: "What is your current education level?",
    hintBn: "সর্বোচ্চ সম্পন্ন/চলমান",
    hintEn: "Highest completed / ongoing",
    options: [
      { id: "ssc", bn: "SSC / সমমান", en: "SSC / equivalent", tags: ["9-10"] },
      { id: "hsc", bn: "HSC / সমমান", en: "HSC / equivalent", tags: ["11-12"] },
      { id: "undergrad", bn: "অনার্স চলছে", en: "Undergraduate (ongoing)", tags: ["undergrad"] },
      { id: "graduate", bn: "স্নাতক সম্পন্ন", en: "Graduate degree", tags: ["graduate"] },
      { id: "other", bn: "অন্য / আত্মশিক্ষিত", en: "Other / self-taught", tags: ["other"] },
    ],
  },
  {
    id: "hours",
    bn: "সপ্তাহে কত সময় শেখার জন্য দিতে পারবেন?",
    en: "How much time can you give to learning weekly?",
    hintBn: "বাস্তবসম্মত থাকুন",
    hintEn: "Be realistic",
    options: [
      { id: "low", bn: "৫ ঘণ্টার কম", en: "Less than 5 hours" },
      { id: "mid", bn: "৫–১০ ঘণ্টা", en: "5–10 hours" },
      { id: "high", bn: "১০–২০ ঘণ্টা", en: "10–20 hours" },
      { id: "full", bn: "২০+ ঘণ্টা (ফুল টাইম)", en: "20+ hours (full time)" },
    ],
  },
  {
    id: "english",
    bn: "ইংরেজিতে আপনার দক্ষতা কেমন?",
    en: "How strong is your English?",
    hintBn: "লিখা ও পড়া",
    hintEn: "Reading & writing",
    options: [
      { id: "low", bn: "দুর্বল", en: "Weak" },
      { id: "medium", bn: "মাঝারি", en: "Moderate" },
      { id: "high", bn: "ভালো", en: "Strong" },
    ],
  },
  {
    id: "device",
    bn: "শেখার জন্য আপনার কাছে কী আছে?",
    en: "What do you have for learning?",
    hintBn: "যা সত্যিই ব্যবহার করতে পারেন",
    hintEn: "What you can actually use",
    options: [
      { id: "phone-low", bn: "শুধু স্মার্টফোন (কম ডেটা)", en: "Smartphone only (low data)" },
      { id: "phone", bn: "স্মার্টফোন (ভালো ইন্টারনেট)", en: "Smartphone (good internet)" },
      { id: "laptop", bn: "ল্যাপটপ / কম্পিউটার", en: "Laptop / computer" },
      { id: "both", bn: "স্মার্টফোন + ল্যাপটপ", en: "Smartphone + laptop" },
    ],
  },
  {
    id: "experience",
    bn: "কোনো ডিজিটাল স্কিলে আপনার অভিজ্ঞতা কতটুকু?",
    en: "How much experience do you have in any digital skill?",
    hintBn: "যেকোনো একটি",
    hintEn: "Any one skill",
    options: [
      { id: "none", bn: "একেবারে নতুন", en: "Complete beginner" },
      { id: "some", bn: "একটু শিখেছি", en: "Learned a little" },
      { id: "confident", bn: "নিজের উপর আত্মবিশ্বাস আছে", en: "Confident" },
    ],
  },
  {
    id: "goal",
    bn: "আপনার প্রধান লক্ষ্য কী?",
    en: "What is your main goal?",
    hintBn: "একটি বেছে নিন",
    hintEn: "Pick one",
    options: [
      { id: "first-job", bn: "প্রথম চাকরি পাওয়া", en: "Get my first job" },
      { id: "upgrade", bn: "বর্তমান চাকরি থেকে ভালো কিছু", en: "Upgrade my current job" },
      { id: "freelance", bn: "অনলাইনে ফ্রিল্যান্সিং", en: "Freelance online" },
      { id: "abroad", bn: "বিদেশে উচ্চশিক্ষা / স্কলারশিপ", en: "Study abroad / scholarship" },
      { id: "business", bn: "নিজের ব্যবসা শুরু করা", en: "Start my own business" },
    ],
  },
  {
    id: "learning",
    bn: "আপনি কীভাবে সবচেয়ে ভালো শিখেন?",
    en: "How do you learn best?",
    hintBn: "একটি বেছে নিন",
    hintEn: "Pick one",
    options: [
      { id: "video", bn: "ভিডিও দেখে", en: "By watching videos" },
      { id: "reading", bn: "পড়ে ও লিখে", en: "By reading & writing" },
      { id: "practice", bn: "প্রজেক্ট করে", en: "By building projects" },
      { id: "live", bn: "লাইভ ক্লাস/মেন্টরশিপে", en: "Live class / mentorship" },
    ],
  },
];

export const TRACKS: Track[] = [
  { id: "web", en: "Web Development", bn: "ওয়েব ডেভেলপমেন্ট", category: "tech", demand: "High", salary: "৳25k–80k", salaryBn: "৳২৫ হাজার–৮০ হাজার", emoji: "💻" },
  { id: "app", en: "Mobile App Development", bn: "মোবাইল অ্যাপ ডেভেলপমেন্ট", category: "tech", demand: "High", salary: "৳30k–90k", salaryBn: "৳৩০ হাজার–৯০ হাজার", emoji: "📱" },
  { id: "data", en: "Data Analysis", bn: "ডেটা অ্যানালাইসিস", category: "data", demand: "High", salary: "৳30k–70k", salaryBn: "৳৩০ হাজার–৭০ হাজার", emoji: "📊" },
  { id: "dataentry", en: "Data Entry & Virtual Assistance", bn: "ডেটা এন্ট্রি ও ভার্চুয়াল অ্যাসিস্ট্যান্স", category: "data", demand: "Medium", salary: "৳12k–30k", salaryBn: "৳১২ হাজার–৩০ হাজার", emoji: "⌨️" },
  { id: "marketing", en: "Digital Marketing", bn: "ডিজিটাল মার্কেটিং", category: "business", demand: "High", salary: "৳25k–60k", salaryBn: "৳২৫ হাজার–৬০ হাজার", emoji: "📈" },
  { id: "design", en: "Graphic & UI/UX Design", bn: "গ্রাফিক ও UI/UX ডিজাইন", category: "design", demand: "High", salary: "৳20k–70k", salaryBn: "৳২০ হাজার–৭০ হাজার", emoji: "🎨" },
  { id: "content", en: "Content Writing & Copywriting", bn: "কনটেন্ট রাইটিং ও কপিরাইটিং", category: "content", demand: "Medium", salary: "৳18k–50k", salaryBn: "৳১৮ হাজার–৫০ হাজার", emoji: "✍️" },
  { id: "support", en: "Customer Support / BPO", bn: "কাস্টমার সাপোর্ট / BPO", category: "people", demand: "Medium", salary: "৳15k–35k", salaryBn: "৳১৫ হাজার–৩৫ হাজার", emoji: "🎧" },
  { id: "freelance", en: "Freelancing Generalist", bn: "ফ্রিল্যান্সিং জেনারেলিস্ট", category: "business", demand: "Medium", salary: "Variable", salaryBn: "পরিবর্তনশীল", emoji: "🌐" },
];

export const SCHOLARSHIPS: Scholarship[] = [
  { name: "Bangabandhu Fellowship (ICT)", country: "Bangladesh", level: "Masters / PhD", funding: "Full + stipend", eligibility: "ICT graduates, research proposal", url: "https://ictd.gov.bd" },
  { name: "Chevening Scholarship", country: "United Kingdom", level: "Masters", funding: "Full + living cost", eligibility: "Bachelor's + 2 yrs work exp, IELTS", url: "https://www.chevening.org" },
  { name: "Fulbright Foreign Student Program", country: "United States", level: "Masters / PhD", funding: "Full + stipend", eligibility: "Bachelor's, strong academics, TOEFL/GRE", url: "https://bd.usembassy.gov" },
  { name: "DAAD Scholarship", country: "Germany", level: "Masters / PhD", funding: "Full + monthly stipend", eligibility: "Bachelor's, 2 yrs work exp, IELTS/TOEFL", url: "https://www.daad.de" },
  { name: "MEXT Scholarship", country: "Japan", level: "Undergrad / Masters / PhD", funding: "Full + stipend", eligibility: "Age limits, entrance exam, Japanese/English", url: "https://www.bd.emb-japan.go.jp" },
  { name: "Chinese Government Scholarship (CSC)", country: "China", level: "Undergrad / Masters / PhD", funding: "Full + stipend", eligibility: "Under 35 for masters, HSK/English", url: "https://www.campuschina.org" },
  { name: "Korean Government Scholarship (GKS)", country: "South Korea", level: "Undergrad / Masters / PhD", funding: "Full + stipend", eligibility: "GPA 2.64+, age limit, TOPIK/English", url: "https://www.studyinkorea.go.kr" },
  { name: "Erasmus Mundus Joint Masters", country: "European Union", level: "Masters", funding: "Full + travel + stipend", eligibility: "Bachelor's, strong motivation, IELTS", url: "https://www.eacea.ec.europa.eu" },
  { name: "Stipendium Hungaricum", country: "Hungary", level: "Undergrad / Masters / PhD", funding: "Full tuition + stipend", eligibility: "Bachelor's/HSC, IELTS/TOEFL", url: "https://stipendiumhungaricum.hu" },
  { name: "Commonwealth Scholarship", country: "United Kingdom", level: "Masters / PhD", funding: "Full + stipend", eligibility: "Bachelor's, development relevance", url: "https://cscuk.fcdo.gov.uk" },
  { name: "Türkiye Bürsları (Türkiye Bursları)", country: "Türkiye", level: "Undergrad / Masters / PhD", funding: "Full + stipend + housing", eligibility: "Age limits, GPA, interview", url: "https://www.turkiyeburslari.gov.tr" },
  { name: "Australia Awards", country: "Australia", level: "Masters / PhD", funding: "Full + living cost", eligibility: "Bachelor's + work exp, IELTS", url: "https://www.dfat.gov.au" },
  { name: "ICCR Scholarship (India)", country: "India", level: "Undergrad / Masters / PhD", funding: "Tuition + stipend", eligibility: "Age limits, academic merit", url: "https://www.iccr.gov.bd" },
  { name: "Vanier Canada Graduate Scholarship", country: "Canada", level: "PhD", funding: "CAD 50k/yr", eligibility: "Strong research profile", url: "https://vanier.gc.ca" },
];

export interface Job {
  id: string;
  title: string;
  titleBn: string;
  type: string;
  typeBn: string;
  location: string;
  locationBn: string;
  salary: string;
  salaryBn: string;
  skills: string[];
  track: string;
}

export const JOBS: Job[] = [
  { id: "j1", title: "Junior Frontend Developer", titleBn: "জুনিয়র ফ্রন্টএন্ড ডেভেলপার", type: "Full-time", typeBn: "ফুল-টাইম", location: "Dhaka / Remote", locationBn: "ঢাকা / রিমোট", salary: "৳25k–45k", salaryBn: "৳২৫–৪৫ হাজার", skills: ["HTML", "CSS", "JavaScript", "React", "Git"], track: "web" },
  { id: "j2", title: "WordPress Developer", titleBn: "ওয়ার্ডপ্রেস ডেভেলপার", type: "Part-time / Remote", typeBn: "পার্ট-টাইম / রিমোট", location: "Remote", locationBn: "রিমোট", salary: "৳18k–35k", salaryBn: "৳১৮–৩৫ হাজার", skills: ["WordPress", "HTML", "CSS", "SEO"], track: "web" },
  { id: "j3", title: "Junior Data Analyst", titleBn: "জুনিয়র ডেটা অ্যানালিস্ট", type: "Full-time", typeBn: "ফুল-টাইম", location: "Dhaka", locationBn: "ঢাকা", salary: "৳30k–50k", salaryBn: "৳৩০–৫০ হাজার", skills: ["Excel", "SQL", "Python", "Data Visualization"], track: "data" },
  { id: "j4", title: "Data Entry Executive", titleBn: "ডেটা এন্ট্রি এক্সিকিউটিভ", type: "Full-time / Remote", typeBn: "ফুল-টাইম / রিমোট", location: "Remote", locationBn: "রিমোট", salary: "৳12k–22k", salaryBn: "৳১২–২২ হাজার", skills: ["Excel", "Typing", "Attention to Detail"], track: "dataentry" },
  { id: "j5", title: "Digital Marketing Executive", titleBn: "ডিজিটাল মার্কেটিং এক্সিকিউটিভ", type: "Full-time", typeBn: "ফুল-টাইম", location: "Dhaka", locationBn: "ঢাকা", salary: "৳25k–45k", salaryBn: "৳২৫–৪৫ হাজার", skills: ["SEO", "Facebook Ads", "Google Ads", "Analytics", "Content"], track: "marketing" },
  { id: "j6", title: "Social Media Manager", titleBn: "সোশ্যাল মিডিয়া ম্যানেজার", type: "Part-time / Remote", typeBn: "পার্ট-টাইম / রিমোট", location: "Remote", locationBn: "রিমোট", salary: "৳18k–35k", salaryBn: "৳১৮–৩৫ হাজার", skills: ["Content", "Facebook Ads", "Canva", "Analytics"], track: "marketing" },
  { id: "j7", title: "Junior UI/UX Designer", titleBn: "জুনিয়র UI/UX ডিজাইনার", type: "Full-time", typeBn: "ফুল-টাইম", location: "Dhaka / Hybrid", locationBn: "ঢাকা / হাইব্রিড", salary: "৳25k–50k", salaryBn: "৳২৫–৫০ হাজার", skills: ["Figma", "UI Design", "Prototyping", "User Research"], track: "design" },
  { id: "j8", title: "Graphic Designer", titleBn: "গ্রাফিক ডিজাইনার", type: "Full-time / Freelance", typeBn: "ফুল-টাইম / ফ্রিল্যান্স", location: "Remote", locationBn: "রিমোট", salary: "৳15k–35k", salaryBn: "৳১৫–৩৫ হাজার", skills: ["Photoshop", "Illustrator", "Canva", "Branding"], track: "design" },
  { id: "j9", title: "Content Writer", titleBn: "কনটেন্ট রাইটার", type: "Remote", typeBn: "রিমোট", location: "Remote", locationBn: "রিমোট", salary: "৳18k–35k", salaryBn: "৳১৮–৩৫ হাজার", skills: ["Writing", "SEO", "Research", "Editing"], track: "content" },
  { id: "j10", title: "Customer Support Agent", titleBn: "কাস্টমার সাপোর্ট এজেন্ট", type: "Full-time / Night shift", typeBn: "ফুল-টাইম / নাইট শিফট", location: "Dhaka", locationBn: "ঢাকা", salary: "৳15k–28k", salaryBn: "৳১৫–২৮ হাজার", skills: ["Communication", "English", "CRM", "Problem Solving"], track: "support" },
  { id: "j11", title: "Flutter App Developer", titleBn: "ফ্লাটার অ্যাপ ডেভেলপার", type: "Full-time", typeBn: "ফুল-টাইম", location: "Dhaka / Remote", locationBn: "ঢাকা / রিমোট", salary: "৳30k–70k", salaryBn: "৳৩০–৭০ হাজার", skills: ["Flutter", "Dart", "Firebase", "REST API"], track: "app" },
  { id: "j12", title: "Fiverr / Upwork Freelancer – Design", titleBn: "ফাইভার / আপওয়ার্ক ফ্রিল্যান্সার – ডিজাইন", type: "Freelance", typeBn: "ফ্রিল্যান্স", location: "Online", locationBn: "অনলাইন", salary: "$5–$50/gig", salaryBn: "$৫–$৫০/গিগ", skills: ["Canva", "Branding", "Client Communication"], track: "freelance" },
  { id: "j13", title: "Virtual Assistant", titleBn: "ভার্চুয়াল অ্যাসিস্ট্যান্ট", type: "Remote / Freelance", typeBn: "রিমোট / ফ্রিল্যান্স", location: "Online", locationBn: "অনলাইন", salary: "$4–$15/hr", salaryBn: "$৪–$১৫/ঘণ্টা", skills: ["Excel", "Email Management", "English", "Scheduling"], track: "dataentry" },
  { id: "j14", title: "QA / Manual Tester", titleBn: "QA / ম্যানুয়াল টেস্টার", type: "Full-time", typeBn: "ফুল-টাইম", location: "Dhaka", locationBn: "ঢাকা", salary: "৳20k–40k", salaryBn: "৳২০–৪০ হাজার", skills: ["Testing", "Attention to Detail", "Jira", "Communication"], track: "tech" },
];

export const FREE_RESOURCES: Record<string, { title: string; provider: string; url: string; lang: "bn" | "en" | "both" }[]> = {
  web: [
    { title: "Responsive Web Design", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn", lang: "en" },
    { title: "Web Development Bangla", provider: "Programming Hero", url: "https://www.programming-hero.com", lang: "bn" },
    { title: "JavaScript Full Course", provider: "YouTube", url: "https://www.youtube.com", lang: "both" },
  ],
  app: [
    { title: "Flutter Course for Beginners", provider: "freeCodeCamp", url: "https://www.freecodecamp.org", lang: "en" },
    { title: "App Development Bangla", provider: "Learn with Sumit", url: "https://www.youtube.com", lang: "bn" },
  ],
  data: [
    { title: "Data Analysis with Python", provider: "freeCodeCamp", url: "https://www.freecodecamp.org", lang: "en" },
    { title: "Excel & SQL Basics", provider: "Kaggle Learn", url: "https://www.kaggle.com/learn", lang: "en" },
    { title: "Data Analytics Bangla", provider: "10 Minute School", url: "https://10minuteschool.com", lang: "bn" },
  ],
  dataentry: [
    { title: "Excel for Beginners", provider: "Microsoft Learn", url: "https://learn.microsoft.com", lang: "both" },
    { title: "Typing Practice", provider: "TypingClub", url: "https://www.typingclub.com", lang: "both" },
  ],
  marketing: [
    { title: "Fundamentals of Digital Marketing", provider: "Google Digital Garage", url: "https://learndigital.withgoogle.com", lang: "both" },
    { title: "Facebook Ads Basics", provider: "Meta Blueprint", url: "https://www.facebook.com/business/learn", lang: "en" },
    { title: "Digital Marketing Bangla", provider: "10 Minute School", url: "https://10minuteschool.com", lang: "bn" },
  ],
  design: [
    { title: "UI/UX Design Basics", provider: "Coursera (audit free)", url: "https://www.coursera.org", lang: "en" },
    { title: "Figma for Beginners", provider: "YouTube", url: "https://www.youtube.com", lang: "both" },
    { title: "Graphic Design Bangla", provider: "Creative IT", url: "https://www.creativeitinstitute.com", lang: "bn" },
  ],
  content: [
    { title: "Content Writing Course", provider: "HubSpot Academy", url: "https://academy.hubspot.com", lang: "en" },
    { title: "SEO Writing", provider: "Moz", url: "https://moz.com/learn/seo", lang: "en" },
  ],
  support: [
    { title: "Customer Service Fundamentals", provider: "Coursera (audit free)", url: "https://www.coursera.org", lang: "en" },
    { title: "Spoken English Bangla", provider: "10 Minute School", url: "https://10minuteschool.com", lang: "bn" },
  ],
  freelance: [
    { title: "Freelancing Guide for Beginners", provider: "10 Minute School", url: "https://10minuteschool.com", lang: "bn" },
    { title: "Upwork Freelancing Basics", provider: "Upwork Academy", url: "https://www.upwork.com/resources", lang: "en" },
  ],
};

