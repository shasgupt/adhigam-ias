export interface CampusInfo {
  id: string;
  name: string;
  shortName: string;
  address: string;
  landmark: string;
  phone: string;
  email: string;
  operatingHours: string;
  googleMapEmbedUrl?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  subject: string;
  experience: string;
  bio: string;
  avatar?: string;
}

export interface InstituteConfig {
  name: string;
  brandCode: string;
  tagline: string;
  subtitle: string;
  foundedYear: number;
  accreditation: string;
  targetExams: string[];
  
  contact: {
    primaryHelpline: string;
    alternateHelpline: string;
    admissionsEmail: string;
    supportEmail: string;
    grievanceEmail: string;
    whatsappNumber: string;
  };

  campuses: CampusInfo[];

  stats: {
    topSelectionsCount: string;
    activeAspirantsCount: string;
    answerReviewSla: string;
    totalMockTestsEvaluated: string;
    satisfactionRate: string;
  };

  socialLinks: {
    youtube: string;
    telegram: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };

  leadershipAndFaculty: FacultyMember[];

  aboutText: string;
  visionText: string;
  missionText: string;
}

export const INSTITUTE_CONFIG: InstituteConfig = {
  name: "ADHIGAM IAS",
  brandCode: "adhigam_ias",
  tagline: "Premier Civil Services Academy",
  subtitle: "Precision coaching for UPSC CSE Prelims, Mains, Optional & Interview Guidance",
  foundedYear: 2018,
  accreditation: "Registered UPSC CSE Training & Mentorship Institute",
  targetExams: [
    "UPSC Civil Services Examination (IAS/IPS/IFS/IRS)",
    "State Public Service Commissions (UPPSC, BPSC, MPPSC)"
  ],

  contact: {
    primaryHelpline: "+91 11 4500 8899",
    alternateHelpline: "+91 98765 43210",
    admissionsEmail: "admissions@adhigamias.com",
    supportEmail: "support@adhigamias.com",
    grievanceEmail: "director@adhigamias.com",
    whatsappNumber: "+91 98765 43210"
  },

  campuses: [
    {
      id: "orn-campus",
      name: "Old Rajinder Nagar Central Campus",
      shortName: "Old Rajinder Nagar",
      address: "22-B, Pusa Road, Near Karol Bagh Metro Gate 2, New Delhi - 110005",
      landmark: "Near Karol Bagh Metro Station",
      phone: "+91 11 4500 8899",
      email: "delhi.orn@adhigamias.com",
      operatingHours: "Mon - Sat: 8:00 AM - 8:00 PM | Sun: 9:00 AM - 5:00 PM"
    },
    {
      id: "mn-campus",
      name: "Mukherjee Nagar North Campus",
      shortName: "Mukherjee Nagar",
      address: "104, Kingsway Camp, Near GTB Nagar Metro Gate 3, Delhi - 110009",
      landmark: "Near GTB Nagar Metro Station",
      phone: "+91 11 4500 8800",
      email: "delhi.mn@adhigamias.com",
      operatingHours: "Mon - Sat: 8:00 AM - 8:00 PM"
    }
  ],

  stats: {
    topSelectionsCount: "100+",
    activeAspirantsCount: "5,000+",
    answerReviewSla: "24 Hours",
    totalMockTestsEvaluated: "25,000+",
    satisfactionRate: "98.4%"
  },

  socialLinks: {
    youtube: "https://youtube.com/@adhigamias",
    telegram: "https://t.me/adhigamias_official",
    twitter: "https://twitter.com/adhigamias",
    instagram: "https://instagram.com/adhigamias",
    linkedin: "https://linkedin.com/company/adhigamias"
  },

  leadershipAndFaculty: [
    {
      id: "fac-1",
      name: "Dr. Vikramaditya Sharma",
      role: "Academic Director & Faculty Lead",
      subject: "Polity, Governance & International Relations (GS-2)",
      experience: "15+ Years",
      bio: "Former Civil Servant & Senior Academic Consultant specializing in Constitutional Law and UPSC Mains answer structures."
    },
    {
      id: "fac-2",
      name: "Prof. Ananya Roy",
      role: "Head of Public Administration & Ethics",
      subject: "Public Administration Optional & Ethics (GS-4)",
      experience: "12+ Years",
      bio: "Renowned mentor for Public Administration with 290+ score records and expert in Ethics case studies."
    },
    {
      id: "fac-3",
      name: "Dr. Rajeshwar Prasad",
      role: "Senior Faculty & Strategy Consultant",
      subject: "Indian Economy & Internal Security (GS-3)",
      experience: "14+ Years",
      bio: "Author of acclaimed Indian Economy study modules and mentor to over 100+ selected IAS/IPS officers."
    }
  ],

  aboutText: "Adhigam IAS is a dedicated Civil Services Examination institute focusing on conceptual depth, rigorous Mains answer-writing, structured test series, and personal mentorship.",
  visionText: "To democratize high-quality Civil Services preparation with absolute clarity, personal accountability, and research-backed pedagogical tools.",
  missionText: "To empower every aspirant with the analytical mindset, structured presentation, and syllabus coverage needed to crack the UPSC CSE in minimum attempts."
};
