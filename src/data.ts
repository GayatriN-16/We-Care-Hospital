/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Department, Doctor, Testimonial } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    tagline: 'Keeping your heart beating strong and healthy.',
    description: 'Advanced cardiovascular care utilizing state-of-the-art diagnostic and surgical technologies.',
    longDescription: 'Our Cardiology department is a global leader in cardiovascular care, research, and education. We provide comprehensive services ranging from preventative screenings and wellness programs to advanced interventional procedures and complex heart surgeries. Our state-of-the-art cath labs and electrophysiology suites operate 24/7 to handle critical emergencies, guaranteeing swift and lifesaving interventions when minutes matter most.',
    iconName: 'Heart',
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=800',
    services: [
      'Electrocardiogram (ECG/EKG) & Stress Testing',
      'Coronary Angioplasty & Stenting',
      'Heart Failure & Valve Disease Management',
      'Pacemaker & ICD Implantation',
      'Pediatric Cardiology Consultations',
      'Cardiac Rehabilitation & Preventive Wellness'
    ],
    stats: [
      { label: 'Annual Cardiac Procedures', value: '2,400+' },
      { label: 'Success Rate for Angioplasty', value: '99.2%' },
      { label: 'Emergency Response Time', value: '< 45 mins' }
    ]
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    tagline: 'Compassionate healthcare for our youngest heroes.',
    description: 'Nurturing pediatric care from infancy through adolescence in a warm, friendly environment.',
    longDescription: 'We Care Pediatrics is designed specifically with children and parents in mind. From bright, comforting examination rooms to a team of specialized pediatricians, nurses, and child life specialists, we provide an environment that minimizes anxiety. Our comprehensive pediatric services cover everything from well-child checkups and childhood immunizations to acute pediatric emergency management and specialized chronic pediatric condition therapies.',
    iconName: 'Baby',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
    services: [
      'Newborn & Infant Wellness Assessments',
      'Routine Immunization & Vaccine Counseling',
      'Pediatric Emergency & Acute Care',
      'Childhood Growth & Developmental Tracking',
      'Pediatric Asthma & Allergy Management',
      'Nutrition & Healthy Lifestyle Guidance'
    ],
    stats: [
      { label: 'Healthy Children Tracked', value: '18,000+' },
      { label: 'Pediatric Specialists', value: '14' },
      { label: 'Child-friendly Rooms', value: '100%' }
    ]
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    tagline: 'Restoring mobility and performance to your life.',
    description: 'Expert orthopedic surgical and physical rehabilitation care for joints, bones, and muscles.',
    longDescription: 'Our Orthopedic and Sports Medicine Institute provides comprehensive treatment for all musculoskeletal conditions. Whether you are dealing with chronic arthritis, a complex sports-related tear, or an unexpected fracture, our team offers specialized, world-class care. We combine advanced minimally invasive arthroscopic surgical techniques with customized physical therapy regimes to ensure patients recover quickly, safely, and return to their peak mobility.',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=800',
    services: [
      'Total Hip, Knee & Shoulder Replacements',
      'Minimally Invasive Arthroscopic Surgery',
      'Sports Injury Management & Ligament Repairs (ACL/MCL)',
      'Pediatric Orthopedics & Deformity Correction',
      'Spine & Back Pain Interventions',
      'On-site Customized Physical Therapy & Rehab'
    ],
    stats: [
      { label: 'Joint Replacements Yearly', value: '1,200+' },
      { label: 'Patient Mobility Success', value: '96.5%' },
      { label: 'Advanced Rehab Equipment', value: 'State-of-the-art' }
    ]
  },
  {
    id: 'neurology',
    name: 'Neurology',
    tagline: 'Leading-edge science for complex neurological care.',
    description: 'Comprehensive diagnostics and advanced treatments for disorders of the brain and nervous system.',
    longDescription: 'The Neurology and Neurosurgery Center at We Care Hospital is dedicated to providing superior neurological care. Equipped with advanced neuro-imaging (including 3T MRI and functional CT scans), we quickly diagnose and treat complex brain, spine, and peripheral nerve disorders. Our designated Comprehensive Stroke Center is staffed by specialists around the clock, implementing immediate thrombolytic and endovascular therapies to save critical nerve tissue.',
    iconName: 'Brain',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800',
    services: [
      'Comprehensive Stroke Therapy & Prevention',
      'Epilepsy Monitoring & Seizure Management',
      'Parkinson Disease & Movement Disorder Care',
      'Alzheimer Disease & Dementia Memory Clinics',
      'Neuro-Ophthalmology & Headache management',
      'Advanced Neuromuscular Electro-diagnostics (EMG/NCS)'
    ],
    stats: [
      { label: 'Stroke Survival Rate', value: '97.8%' },
      { label: 'Neuro-Surgeries/Year', value: '850+' },
      { label: 'Diagnostic Speed (Brain CT)', value: '< 15 mins' }
    ]
  },
  {
    id: 'oncology',
    name: 'Oncology',
    tagline: 'Advancing cancer therapies with clinical precision.',
    description: 'Personalized cancer treatment plans spanning advanced oncology, radiation, and supportive care.',
    longDescription: 'Our Oncology Department represents a hope-filled sanctuary where world-class cancer treatment meets compassionate, patient-centered care. We employ a multidisciplinary tumor board approach, bringing together surgeons, medical oncologists, radiation oncologists, and pathologists to devise highly customized, precision treatment strategies for each patient. Our center offers cutting-edge immunotherapy, targeted molecular drugs, and highly accurate radiation systems.',
    iconName: 'Shield',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f35116f?auto=format&fit=crop&q=80&w=800',
    services: [
      'Precision Chemotherapy & Hormone Therapy',
      'Advanced Immunotherapy & Monoclonal Antibodies',
      'Stereotactic Radiotherapy & Proton Beam Prep',
      'Surgical Resection of Complex Solid Tumors',
      'Genetic Counseling & Inherited Risk Screening',
      'Integrative Supportive Medicine & Pain Management'
    ],
    stats: [
      { label: 'Custom Treatment Plans', value: '100%' },
      { label: 'Clinical Trials Active', value: '45+' },
      { label: 'Survivorship Support Networks', value: 'Comprehensive' }
    ]
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    tagline: 'Comprehensive dermatological expertise for healthy skin.',
    description: 'Medical and cosmetic dermatology services utilizing advanced laser and therapeutic technology.',
    longDescription: 'The Dermatology team at We Care Hospital offers expert management of all skin, hair, and nail conditions. Our double-certified clinical dermatologists perform everything from thorough skin cancer screenings and chronic psoriasis treatment to advanced cosmetic laser therapies and anti-aging treatments. We combine medical rigor with sophisticated aesthetic technologies, giving patients healthy, radiant, and well-protected skin.',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1614859324967-bdf461fcf769?auto=format&fit=crop&q=80&w=800',
    services: [
      'Skin Cancer Screening & Mohs Micrographic Surgery',
      'Chronic Psoriasis, Eczema & Acne Therapy',
      'Aesthetic Laser Treatments for Vascular Lesions',
      'Customized Cosmetic Dermatological Rejuvenation',
      'Hair Loss (Alopecia) & Nail Disorder Management',
      'Pediatric Dermatology Care for Rashes & Birthmarks'
    ],
    stats: [
      { label: 'Skin Screenings Done', value: '12,500+' },
      { label: 'Laser Safe Certifications', value: 'Gold standard' },
      { label: 'Patient Satisfaction', value: '4.9/5.0' }
    ]
  }
];

export const DOCTORS: Doctor[] = [
  // Cardiology
  {
    id: 'dr-sarah-jenkins',
    name: 'Dr. Sarah Jenkins',
    role: 'Chief Cardiologist',
    specialty: 'Interventional Cardiology & Valvular Heart Disease',
    departmentId: 'cardiology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Sarah Jenkins is an internationally acclaimed cardiologist with over 15 years of dedicated experience. She specializes in minimally invasive cardiac procedures, coronary interventions, and advanced valve repair therapies. She is heavily involved in clinical trials and passionate about heart-healthy nutrition.',
    education: [
      'M.D., Harvard Medical School',
      'Fellowship in Interventional Cardiology, Johns Hopkins Hospital',
      'Board Certified in Cardiovascular Medicine'
    ],
    experienceYears: 16,
    rating: 4.9,
    reviewsCount: 340,
    availability: ['Mon', 'Wed', 'Fri'],
    timeSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'],
    contactEmail: 's.jenkins@wecarehospital.com'
  },
  {
    id: 'dr-marcus-chen',
    name: 'Dr. Marcus Chen',
    role: 'Senior Consultant',
    specialty: 'Electrophysiology & Cardiac Rhythm Management',
    departmentId: 'cardiology',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Marcus Chen is an expert in heart arrhythmias and pacemaker implantations. Having successfully performed over 1,500 ablation procedures, his precision and clinical expertise are highly regarded. He aims to make cardiac treatments transparent and comfortable for patients.',
    education: [
      'M.D., Stanford University School of Medicine',
      'Residency in Internal Medicine, Mayo Clinic Medical School',
      'Fellowship in Cardiac Electrophysiology, Cleveland Clinic'
    ],
    experienceYears: 11,
    rating: 4.8,
    reviewsCount: 215,
    availability: ['Tue', 'Thu'],
    timeSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM'],
    contactEmail: 'm.chen@wecarehospital.com'
  },

  // Pediatrics
  {
    id: 'dr-emily-taylor',
    name: 'Dr. Emily Taylor',
    role: 'Head of Pediatrics',
    specialty: 'General Pediatrics & Infant Developmental Care',
    departmentId: 'pediatrics',
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Emily Taylor combines outstanding medical knowledge with a warm, comforting demeanor that instantly calms anxious children. She has dedicated her 13-year career to tracking infant milestones, immunization counseling, and guiding parents on childhood nutrition and health.',
    education: [
      'M.D., Yale School of Medicine',
      'Pediatric Residency, Children’s Hospital of Philadelphia (CHOP)',
      'Certified by the American Board of Pediatrics'
    ],
    experienceYears: 13,
    rating: 4.9,
    reviewsCount: 420,
    availability: ['Mon', 'Tue', 'Thu'],
    timeSlots: ['08:30 AM', '10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM'],
    contactEmail: 'e.taylor@wecarehospital.com'
  },
  {
    id: 'dr-david-kojo',
    name: 'Dr. David Kojo',
    role: 'Senior Pediatrician',
    specialty: 'Pediatric Pulmonology & Allergy Care',
    departmentId: 'pediatrics',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. David Kojo specializes in childhood allergies, chronic pediatric asthma, and infectious childhood illnesses. He actively works with families to create manageable home-health strategies for asthmatic children, improving their daily sleep and school experience.',
    education: [
      'M.D., Columbia University Vagelos College',
      'Pediatric Residency, Boston Children’s Hospital',
      'Fellowship in Pediatric Allergy & Pulmonology, Seattle Children’s'
    ],
    experienceYears: 9,
    rating: 4.7,
    reviewsCount: 180,
    availability: ['Wed', 'Fri'],
    timeSlots: ['09:00 AM', '11:00 AM', '01:30 PM', '03:30 PM'],
    contactEmail: 'd.kojo@wecarehospital.com'
  },

  // Orthopedics
  {
    id: 'dr-robert-vance',
    name: 'Dr. Robert Vance',
    role: 'Chief Orthopedic Surgeon',
    specialty: 'Joint Reconstruction & Complex Adult Orthopedics',
    departmentId: 'orthopedics',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Robert Vance is a world-class surgeon specializing in robotic-assisted hip and knee replacement surgeries. With 18 years of experience, he has pioneered rapid-recovery post-surgical pathways that let active seniors return to sports and high mobility in record times.',
    education: [
      'M.D., University of Pennsylvania',
      'Orthopedic Surgery Residency, Mayo Clinic',
      'Fellowship in Adult Reconstruction Surgery, Rush University Medical Center'
    ],
    experienceYears: 18,
    rating: 4.9,
    reviewsCount: 310,
    availability: ['Tue', 'Wed', 'Thu'],
    timeSlots: ['08:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'],
    contactEmail: 'r.vance@wecarehospital.com'
  },
  {
    id: 'dr-aisha-rahman',
    name: 'Dr. Aisha Rahman',
    role: 'Sports Medicine Specialist',
    specialty: 'Arthroscopic Joint Repairs & Ligament Reconstructions',
    departmentId: 'orthopedics',
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Aisha Rahman is an expert sports medicine surgeon, treating elite athletes and weekend warriors alike. She specializes in minimally invasive repair of shoulder labrums, knee ACLs, and ankle ligaments, emphasizing early physical therapy integration.',
    education: [
      'M.D., Georgetown University School of Medicine',
      'Residency in Orthopedic Surgery, NYU Langone Orthopedic Hospital',
      'Fellowship in Sports Medicine, Hospital for Special Surgery (HSS)'
    ],
    experienceYears: 10,
    rating: 4.8,
    reviewsCount: 165,
    availability: ['Mon', 'Fri'],
    timeSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM'],
    contactEmail: 'a.rahman@wecarehospital.com'
  },

  // Neurology
  {
    id: 'dr-elena-rostova',
    name: 'Dr. Elena Rostova',
    role: 'Head of Neurology',
    specialty: 'Comprehensive Stroke Care & Neuroimmunology',
    departmentId: 'neurology',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Elena Rostova is a pioneering neurologist dedicated to brain wellness, migraine blockages, and stroke care. She focuses heavily on early diagnostic technology, striving to optimize clinical processes to ensure patients receive urgent treatments immediately.',
    education: [
      'M.D., Duke University School of Medicine',
      'Neurology Residency, University of California San Francisco (UCSF)',
      'Fellowship in Stroke and Cerebrovascular Disorders, Johns Hopkins'
    ],
    experienceYears: 14,
    rating: 4.9,
    reviewsCount: 220,
    availability: ['Mon', 'Wed'],
    timeSlots: ['09:00 AM', '10:30 AM', '01:30 PM', '03:00 PM'],
    contactEmail: 'e.rostova@wecarehospital.com'
  },
  {
    id: 'dr-james-mcavoy',
    name: 'Dr. James McAvoy',
    role: 'Senior Neurosurgeon',
    specialty: 'Spine Surgery & Minimally Invasive Neurosurgery',
    departmentId: 'neurology',
    image: 'https://images.unsplash.com/photo-1605684954278-9f515a526625?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. James McAvoy is renowned for his surgical mastery in spinal decompression, complex herniated discs, and brain tumors. He utilizes sophisticated neuronavigation systems to maximize surgical success and preserve healthy nerve functionality.',
    education: [
      'M.D., University of Oxford (UK)',
      'Residency in Neurosurgery, Queen Square National Hospital London',
      'Fellowship in Spine Surgery, Cleveland Clinic'
    ],
    experienceYears: 17,
    rating: 4.8,
    reviewsCount: 195,
    availability: ['Tue', 'Thu', 'Fri'],
    timeSlots: ['08:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'],
    contactEmail: 'j.mcavoy@wecarehospital.com'
  },

  // Oncology
  {
    id: 'dr-william-vance',
    name: 'Dr. William Vance',
    role: 'Chief Oncologist',
    specialty: 'Molecular Precision Oncology & Breast/Lung Cancers',
    departmentId: 'oncology',
    image: 'https://images.unsplash.com/photo-1582750433449-64c012015529?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. William Vance has dedicated his 20-year career to expanding cancer cure rates through molecular therapies and targeted biological agents. He chairs our multidisciplinary tumor board, ensuring that complex oncology decisions are collaborative and customized.',
    education: [
      'M.D., Washington University School of Medicine',
      'Residency in Internal Medicine, Massachusetts General Hospital',
      'Hematology/Oncology Fellowship, MD Anderson Cancer Center'
    ],
    experienceYears: 20,
    rating: 4.9,
    reviewsCount: 480,
    availability: ['Mon', 'Tue', 'Thu'],
    timeSlots: ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'],
    contactEmail: 'w.vance@wecarehospital.com'
  },
  {
    id: 'dr-priya-patel',
    name: 'Dr. Priya Patel',
    role: 'Senior Radiation Oncologist',
    specialty: 'Precision Radiotherapy & Stereotactic Radiosurgery',
    departmentId: 'oncology',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Priya Patel is an expert in leveraging targeted radiation systems to eliminate solid tumors while completely safeguarding surrounding tissues. She works hand-in-hand with medical oncologists to coordinate synergistic treatment plans.',
    education: [
      'M.D., Cornell University Medical College',
      'Residency in Radiation Oncology, Memorial Sloan Kettering Cancer Center',
      'Board Certified in Therapeutic Radiology'
    ],
    experienceYears: 12,
    rating: 4.8,
    reviewsCount: 230,
    availability: ['Wed', 'Fri'],
    timeSlots: ['09:30 AM', '11:30 AM', '02:00 PM', '03:30 PM'],
    contactEmail: 'p.patel@wecarehospital.com'
  },

  // Dermatology
  {
    id: 'dr-sofia-al-fayed',
    name: 'Dr. Sofia Al-Fayed',
    role: 'Clinical Dermatologist',
    specialty: 'Early Skin Cancer Screening & Chronic Inflammatory Rashes',
    departmentId: 'dermatology',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Sofia Al-Fayed specializes in chronic eczema, psoriasis, and full-body dermatoscopic screenings for melanomas. She has helped thousands of patients regain active comfort through customized biological therapies and protective guidelines.',
    education: [
      'M.D., Northwestern University Feinberg School',
      'Dermatology Residency, Stanford University Hospital',
      'Diplomate of the American Board of Dermatology'
    ],
    experienceYears: 9,
    rating: 4.8,
    reviewsCount: 190,
    availability: ['Mon', 'Tue', 'Wed'],
    timeSlots: ['09:00 AM', '10:30 AM', '01:30 PM', '03:00 PM'],
    contactEmail: 's.alfayed@wecarehospital.com'
  },
  {
    id: 'dr-liam-gallagher',
    name: 'Dr. Liam Gallagher',
    role: 'Cosmetic Dermatologist',
    specialty: 'Laser Skin Rejuvenation & Cosmetic Scar Corrections',
    departmentId: 'dermatology',
    image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Liam Gallagher offers expert cosmetic skin enhancements, high-precision laser scar remodeling, and treatment of vascular blemishes. He combines safety-first clinical principles with elegant aesthetics to ensure outstanding patient skin wellness.',
    education: [
      'M.D., University of Chicago Pritzker School',
      'Residency in Dermatology, University of Michigan Health',
      'Fellowship in Cosmetic and Laser Dermatology, Boston'
    ],
    experienceYears: 14,
    rating: 4.9,
    reviewsCount: 360,
    availability: ['Thu', 'Fri'],
    timeSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
    contactEmail: 'l.gallagher@wecarehospital.com'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    patientName: 'Richard Henderson',
    age: 62,
    treatment: 'Double bypass heart surgery',
    text: 'The care I received at We Care Hospital cardiology department was exceptional. Dr. Jenkins explained the bypass procedure step-by-step and checked in on me constantly during my ICU recovery. Today, I am walking 3 miles every morning, back to enjoying life with my grandkids.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'test-2',
    patientName: 'Gabriella Reynolds',
    age: 34,
    treatment: 'Pediatric Asthma Management',
    text: 'Finding a pediatrician who understands a mother’s panic is tough. Dr. Emily Taylor and Dr. Kojo are extraordinary. They completely overhauled my son’s asthma tracker and routine. It has been 6 months since his last acute asthma flare-up, and he is playing soccer with total confidence.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'test-3',
    patientName: 'Michael Sterling',
    age: 45,
    treatment: 'Total Knee Replacement',
    text: 'As an active runner, losing joint mobility to severe bone arthritis was painful. Dr. Robert Vance performed robotic knee surgery on me. The advanced rehab gear at We Care got me walking without a cane in just two weeks! I am back on the trails with zero pain.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
  }
];
