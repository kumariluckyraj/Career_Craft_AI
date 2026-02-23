const fs = require('fs');
const path = require('path');

// Paste your Gemini output array here
const data = [
  {
    id: 1,
    profile_summary: "Computer Science student specializing in Backend Development and Cloud Architecture.",
    goal: "Seeking a Summer Software Engineering Internship.",
    dm_pitch: "Hi [Name], I’ve been following [Company]'s work in scalable infrastructure and was impressed by your recent transition to microservices. As a CS student at [Uni] focusing on backend systems, I’d love to learn what skills your team values most in interns. Do you have 5 minutes for a brief chat?"
  },
  {
    id: 2,
    profile_summary: "Marketing major with a passion for Brand Storytelling and Social Media Analytics.",
    goal: "Informational interview with a Brand Manager.",
    dm_pitch: "Hi [Name], your recent campaign for [Product] really caught my eye—the data-driven approach to storytelling was brilliant. I’m a Marketing junior at [Uni] aspiring to work in brand management. Would you be open to sharing one piece of advice for a student looking to break into the industry?"
  },
  {
    id: 3,
    profile_summary: "Computer Science student specializing in Backend Development and Cloud Architecture.",
    goal: "Seeking a Summer Software Engineering Internship.",
    dm_pitch: "Hi [Name], I’ve been following [Company]'s work in scalable infrastructure and was impressed by your recent transition to microservices. As a CS student at [Uni] focusing on backend systems, I’d love to learn what skills your team values most in interns. Do you have 5 minutes for a brief chat?"
  },
  {
    id: 4,
    profile_summary: "Marketing major with a passion for Brand Storytelling and Social Media Analytics.",
    goal: "Informational interview with a Brand Manager.",
    dm_pitch: "Hi [Name], your recent campaign for [Product] really caught my eye—the data-driven approach to storytelling was brilliant. I’m a Marketing junior at [Uni] aspiring to work in brand management. Would you be open to sharing one piece of advice for a student looking to break into the industry?"
  },
  {
    id: 5,
    profile_summary: "Data Science student proficient in Python, SQL, and Tableau.",
    goal: "Seeking a mentor in Data Analytics.",
    dm_pitch: "Hi [Name], I came across your profile while researching leaders in Data Science. Your career path from [Previous Role] to [Current Role] is inspiring. I'm currently honing my SQL/Python skills at [Uni] and would love to hear your perspective on the future of AI in [Industry] if you have a moment."
  },
  {
    id: 6,
    profile_summary: "Finance student interested in Investment Banking and M&A.",
    goal: "Networking for future recruitment cycles.",
    dm_pitch: "Hi [Name], I’m a Finance student at [Uni] and a frequent reader of your insights on the [Industry] sector. I'm looking to build a career in M&A and would value the chance to ask 2-3 questions about your experience at [Company]. Would you be open to a quick connection?"
  },
  {
    id: 7,
    profile_summary: "Graphic Design student with a focus on UI/UX and Accessibility.",
    goal: "Portfolio feedback from a Senior Designer.",
    dm_pitch: "Hi [Name], your portfolio is a huge inspiration to me, especially the [Specific Project]. I’m a Design student at [Uni] currently building my UI/UX portfolio. If you have a spare moment, I’d be incredibly grateful for a quick critique on one of my layouts. No pressure at all!"
  },
  {
    id: 8,
    profile_summary: "Pre-Law student interested in Corporate Law and Intellectual Property.",
    goal: "Learning about the day-to-day of a Junior Associate.",
    dm_pitch: "Hi [Name], I’m a student at [Uni] planning to pursue Corporate Law. I noticed you specialize in IP at [Firm]—a field I'm deeply curious about. Could you share what a typical day looks like for an associate in your group? I’d love to learn from your journey."
  },
  
  {
    id: 9,
    niche: "Healthcare / Nursing",
    profile_summary: "Nursing student with a clinical focus on Pediatric Care and Emergency Medicine.",
    goal: "Seeking advice on residency programs or specialized units.",
    dm_pitch: "Hi [Name], I’m a Nursing student at [Uni] currently finishing my clinical rotation in Pediatrics. I noticed your experience in [Specialty] at [Hospital] and would love to hear your take on the transition from student to RN in such a high-stakes environment. Any advice for a soon-to-be grad?"
  },
  {
    id: 10,
    niche: "Civil Engineering",
    profile_summary: "Civil Engineering student specializing in Structural Integrity and Sustainable Urban Planning.",
    goal: "Seeking a site visit or informational interview.",
    dm_pitch: "Hi [Name], I've been following [Company]’s work on the [Specific Project]—the sustainable materials used there are fascinating. I’m a Civil Engineering junior at [Uni]. Would you be open to a 10-minute chat about how you balance structural requirements with green building standards?"
  },
  {
    id: 11,
    niche: "Creative Arts / Content Creation",
    profile_summary: "Digital Media student focusing on Short-form Video Production and Motion Graphics.",
    goal: "Seeking freelance opportunities or portfolio review.",
    dm_pitch: "Hi [Name], I love the visual style of your recent campaigns for [Brand]. I’m a Digital Media student at [Uni] building a portfolio in motion graphics. If you’re ever looking for a junior freelancer to help with quick edits or assets, I’d love to share my reel!"
  },
  {
    id: 12,
    niche: "Environmental Science",
    profile_summary: "Environmental Science student researching Renewable Energy Policy and Conservation.",
    goal: "Connecting with a Policy Analyst or Consultant.",
    dm_pitch: "Hi [Name], I read your recent article on [Topic] and it really resonated with my current research at [Uni]. I’m aspiring to work in Environmental Policy and was wondering if you think a Master's degree is essential for the consulting route. I’d value your perspective!"
  },
  {
    id: 13,
    niche: "Psychology / HR",
    profile_summary: "Psychology major interested in Organizational Development and Employee Wellbeing.",
    goal: "Learning about Corporate Culture and HR Tech.",
    dm_pitch: "Hi [Name], I’m a Psych major at [Uni] exploring the intersection of behavioral science and HR. I noticed your work on [Company]’s culture initiatives and found it really innovative. Do you have any recommendations for books or certifications for someone entering this space?"
  },
  {
    id: 14,
    niche: "Cybersecurity",
    profile_summary: "IT student focusing on Pen Testing and Network Security.",
    goal: "Seeking guidance on industry certifications (CompTIA, CISSP, etc.).",
    dm_pitch: "Hi [Name], I’m an IT student currently prepping for my Security+ exam. I see you’ve built an impressive career in [Sector] security. In your experience, which hands-on skills should a student prioritize to stand out for entry-level SOC roles? Thanks for your time!"
  },
  {
    id: 15,
    niche: "Public Relations",
    profile_summary: "PR and Communications student with a focus on Crisis Management.",
    goal: "Networking with Agency Account Executives.",
    dm_pitch: "Hi [Name], I’m a PR student at [Uni] and a big fan of the work [Agency] did for [Client]. Crisis comms is a dream path for me. Would you be open to a quick connection? I’m curious to know what soft skills you find most vital when things get high-pressure."
  },
  {
    id: 16,
    niche: "Biotechnology",
    profile_summary: "Bio-Tech student specializing in CRISPR and Genetic Sequencing.",
    goal: "Seeking lab internship or research assistantship.",
    dm_pitch: "Hi [Name], I’ve been following [Lab/Company]’s breakthroughs in gene editing. I’m a Biotech senior at [Uni] with 2 years of wet-lab experience. I’d love to learn more about your research pipeline if you ever have a moment for a brief virtual coffee."
  },
  {
    id: 17,
    niche: "Architecture",
    profile_summary: "Architecture student interested in Urban Revitilization and Adaptive Reuse.",
    goal: "Seeking an internship at a boutique firm.",
    dm_pitch: "Hi [Name], I recently saw your firm’s work on [Project] and was struck by the way you handled the historical preservation. I’m an Architecture student at [Uni] with a similar focus. Are you currently taking on interns, or could I send my portfolio for future consideration?"
  },
  {
    id: 18,
    niche: "Supply Chain / Logistics",
    profile_summary: "Business student focusing on Global Supply Chain and E-commerce fulfillment.",
    goal: "Learning about the impact of AI on logistics.",
    dm_pitch: "Hi [Name], I’m a junior at [Uni] studying Supply Chain. I saw your post about AI-driven inventory management and found it fascinating. I’m curious—how do you see entry-level roles changing with this tech? I’d love to hear your thoughts."
  },
  {
    id: 19,
    niche: "Journalism",
    profile_summary: "Journalism student with a background in investigative reporting and podcasting.",
    goal: "Connecting with an Editor or Staff Writer.",
    dm_pitch: "Hi [Name], I’m a huge fan of your reporting on [Topic] at [Publication]. I’m a student journalist at [Uni] and was wondering if you have any advice on pitching long-form stories to editors as a freelancer. Thanks for the constant inspiration!"
  },
  {
    id: 20,
    niche: "Fashion Merchandising",
    profile_summary: "Fashion student specializing in Trend Forecasting and Sustainable Sourcing.",
    goal: "Seeking an internship with a sustainable brand.",
    dm_pitch: "Hi [Name], I’ve been following [Brand]’s commitment to ethical sourcing for a while now. I’m a Merchandising student at [Uni] and would love to know what specific experience you look for in a sustainable fashion intern. Thanks so much!"
  },
  {
    id: 21,
    niche: "Aerospace Engineering",
    profile_summary: "Aerospace student focused on Propulsion Systems and Flight Dynamics.",
    goal: "Networking with engineers at major aerospace firms.",
    dm_pitch: "Hi [Name], as an Aerospace student at [Uni], I’ve been closely following [Company]’s latest launch. Your career journey from [University] to Propulsion Lead is exactly the path I hope to take. Would you be open to a quick 5-minute chat about your experience?"
  },
  {
    id: 22,
    niche: "Social Work / Non-Profit",
    profile_summary: "Social Work student focused on Community Outreach and Youth Advocacy.",
    goal: "Learning about program management in the non-profit sector.",
    dm_pitch: "Hi [Name], I’m inspired by the work [Organization] is doing for the [Location] community. I’m a Social Work major at [Uni] and would love to hear how you transitioned from direct advocacy into program management. Do you have any advice for a student in this field?"
  },
  {
    id: 23,
    niche: "Data Analytics",
    profile_summary: "Data Analytics student proficient in PowerBI and Predictive Modeling.",
    goal: "Seeking an entry-level analyst role or mentorship.",
    dm_pitch: "Hi [Name], I’m a Data Analytics senior at [Uni]. I noticed your work on [Specific Data Project/Post] and really appreciated your approach to data visualization. If you have a moment, I'd love to ask what toolset you think is most critical for a 2024 grad. Best, [My Name]."
  },
  
  {
    id: 24,
    field: "Artificial Intelligence / ML",
    profile_summary: "Computer Science student specializing in Natural Language Processing and LLM fine-tuning.",
    dm_pitch: "Hi [Name], I've been following your technical blogs on [Topic] and found your approach to RAG architectures very insightful. I’m a CS student at [Uni] currently researching NLP. Would you be open to a 5-minute chat about the most common mistakes junior ML engineers make when starting out?"
  },
  {
    id: 25,
    field: "UX Research",
    profile_summary: "Cognitive Science student transitioning into User Experience Research.",
    dm_pitch: "Hi [Name], I loved your recent case study on [Project]—the way you translated qualitative interviews into design requirements was brilliant. I’m a CogSci student at [Uni] moving into UXR. Do you have any advice on which research methodologies are most in-demand at [Company] right now?"
  },
  {
    id: 26,
    field: "Renewable Energy",
    profile_summary: "Electrical Engineering student focused on Smart Grid Technology and Solar Integration.",
    dm_pitch: "Hi [Name], I’m an Engineering junior at [Uni] and a big fan of [Company]'s work in grid modernization. As someone aspiring to work in renewables, I’d love to know what technical certifications you’d recommend for a student before graduation. Thanks for your time!"
  },
  {
    id: 27,
    field: "Public Health",
    profile_summary: "Public Health major focusing on Epidemiology and Data-driven Health Policy.",
    dm_pitch: "Hi [Name], I recently read your publication on [Topic] and it perfectly aligns with my thesis work at [Uni]. I’m curious how you bridge the gap between academic research and actionable policy at [Organization]. Would you be open to a brief virtual connection?"
  },
  {
    id: 28,
    field: "Product Management",
    profile_summary: "Business & Tech student with a focus on Product Lifecycle and Agile Methodology.",
    dm_pitch: "Hi [Name], I noticed your transition from [Previous Role] to Product Management at [Company]. I’m a student at [Uni] looking to make a similar pivot. If you have 10 minutes, I’d love to hear how you successfully translated your previous experience into the PM framework."
  },
  {
    id: 29,
    field: "Chemical Engineering",
    profile_summary: "ChemE student interested in Sustainable Manufacturing and Process Optimization.",
    dm_pitch: "Hi [Name], I’m a Chemical Engineering student at [Uni] and have been following [Company]’s efforts in reducing carbon footprints during manufacturing. I’d love to learn more about the role process engineers play in these sustainability initiatives. Do you have any advice for an aspiring engineer?"
  },
  {
    id: 30,
    field: "Sports Management",
    profile_summary: "Sports Management student focused on Fan Engagement and Digital Analytics.",
    dm_pitch: "Hi [Name], your work on [Specific Sports Campaign] was fantastic—it really showed the power of data in fan engagement. I’m a student at [Uni] aiming for a career in sports tech. Would you be open to sharing what you look for in a junior hire at [Team/Company]?"
  },
  {
    id: 31,
    field: "Hospitality & Tourism",
    profile_summary: "Hospitality student specializing in Luxury Hotel Operations and Guest Experience.",
    dm_pitch: "Hi [Name], I’m a student at [Uni] currently interning at [Hotel], but I’ve always admired the service standards at [Company]. I’m curious what you believe is the biggest challenge facing luxury hospitality in 2026. I'd love to hear your perspective if you have a moment!"
  },
  {
    id: 32,
    field: "Game Development",
    profile_summary: "Computer Science student focusing on C++, Unreal Engine, and Game Physics.",
    dm_pitch: "Hi [Name], I’m a huge fan of [Game Name] and the mechanics your team developed. I’m a CS student at [Uni] building my first technical demo in Unreal. Do you have one tip for a student looking to land their first junior dev role in the industry?"
  },
  {
    id: 33,
    field: "Education Technology",
    profile_summary: "Education major interested in Gamified Learning and EdTech accessibility.",
    dm_pitch: "Hi [Name], I’m an Ed student at [Uni] and a frequent user of [Product]. The way you’ve implemented [Feature] is a game-changer for accessibility. I’m looking to move into the EdTech space and would love to hear how your team approaches inclusive design."
  },
  {
    id: 34,
    field: "Urban Planning",
    profile_summary: "Geography & Planning student focused on Transit-oriented Development.",
    dm_pitch: "Hi [Name], I’ve been following the [City Project] you’re involved in—the focus on pedestrian-first design is inspiring. I’m an Urban Planning student at [Uni]. Would you be open to a quick chat about how you navigate public-private partnerships in city development?"
  },
  {
    id: 35,
    field: "Venture Capital",
    profile_summary: "Economics student interested in Startup Ecosystems and Seed-stage Funding.",
    dm_pitch: "Hi [Name], I’ve been following [Firm]’s recent investments in [Industry]. I’m an Econ student at [Uni] and co-lead of our campus VC club. I’d love to know what specific metrics you prioritize when evaluating early-stage founders in today's market."
  },
  {
    id: 36,
    field: "Cyber Law",
    profile_summary: "Law student focusing on Data Privacy, GDPR, and Tech Regulation.",
    dm_pitch: "Hi [Name], I’m a law student at [Uni] specializing in digital privacy. I read your recent post on [Regulation] and found it very insightful. I’m curious how you see the role of 'Privacy Counsel' evolving with new AI laws. Would you be open to a brief connection?"
  },
  {
    id: 37,
    field: "Industrial Design",
    profile_summary: "Industrial Design student focused on Ergonomics and Consumer Electronics.",
    dm_pitch: "Hi [Name], I’m an ID student at [Uni] and a long-time admirer of your work on [Product]. Your focus on minimalist ergonomics is something I try to emulate in my projects. Do you have any advice on how to best present a physical prototype in a digital portfolio?"
  },
  {
    id: 38,
    field: "Non-Profit Management",
    profile_summary: "Sociology major interested in Grant Writing and Sustainable Fundraising.",
    dm_pitch: "Hi [Name], I’m a student at [Uni] and I’ve been following [Organization]’s incredible impact in [Region]. I’m passionate about non-profit growth and was wondering if you’d be open to sharing how you balance donor relations with long-term program scaling."
  },
  {
    id: 39,
    field: "Real Estate Development",
    profile_summary: "Real Estate & Finance student focused on Mixed-use Developments.",
    dm_pitch: "Hi [Name], I’m a student at [Uni] and I’ve been tracking your recent project at [Address]. The integration of retail and residential space is very innovative. I’m looking to break into development—would you recommend starting in brokerage or analyst roles first?"
  },
  {
    id: 40,
    field: "Aviation Management",
    profile_summary: "Aviation student focused on Airport Operations and Airline Sustainability.",
    dm_pitch: "Hi [Name], I’m an Aviation student at [Uni] and I’ve been following [Airline/Airport]’s roadmap to net-zero. I’m curious how operational roles are shifting to accommodate sustainable fuels. I’d love to hear your thoughts if you have a moment!"
  },
  {
    id: 41,
    field: "Bioinformatics",
    profile_summary: "Biology & CS student focused on Genomic Data Analysis.",
    dm_pitch: "Hi [Name], I’m a dual-major student at [Uni] working at the intersection of Bio and CS. I’m a huge fan of [Company]’s work in personalized medicine. In your view, which programming language is becoming most critical for genomic research in the next few years?"
  },
  {
    id: 42,
    field: "Journalism / Media",
    profile_summary: "Journalism student focusing on Multimedia Storytelling and Investigative Tech.",
    dm_pitch: "Hi [Name], I’m a journalism student at [Uni] and a regular listener of your podcast. Your recent episode on [Topic] was incredibly well-researched. I’m looking to specialize in multimedia reporting—do you have any advice on which technical tools a modern journalist should master?"
  },
  {
    id: 43,
    field: "Marine Biology",
    profile_summary: "Marine Bio student focused on Coral Reef Restoration and Ocean Conservation.",
    dm_pitch: "Hi [Name], I’ve been following [Institute]’s research on [Specific Reef] for some time. I’m a Marine Bio senior at [Uni] with fieldwork experience in [Location]. Would you be open to a quick connection? I'm curious about the volunteer or intern pathways at your lab."
  },
  
  {
    id: 44,
    field: "Renewable Energy / Solar",
    profile_summary: "Electrical Engineering student focused on Photovoltaic systems and Grid integration.",
    dm_pitch: "Hi [Name], I’ve been following [Company]’s recent expansion into utility-scale solar. As an EE student at [Uni] focusing on renewables, I’d love to know what technical hurdles your team finds most challenging when integrating with the current grid. Do you have a moment for a quick insight?"
  },
  {
    id: 45,
    field: "Fashion Merchandising",
    profile_summary: "Fashion Business student specializing in Sustainable Sourcing and Trend Forecasting.",
    dm_pitch: "Hi [Name], your recent article on circular economy in retail was incredibly timely. I’m a student at [Uni] researching sustainable supply chains in fashion. Would you be open to a brief chat about how [Company] vets its ethical suppliers?"
  },
  {
    id: 46,
    field: "Clinical Psychology",
    profile_summary: "Psychology senior interested in Neuropsychology and Adolescent Mental Health.",
    dm_pitch: "Hi [Name], I’m a Psych student at [Uni] and a big fan of your research on [Topic]. I’m currently looking at PhD programs and would value your perspective on which clinical skills are most vital for a research-heavy career. Any advice for an aspiring clinician?"
  },
  {
    id: 47,
    field: "Aerospace Engineering",
    profile_summary: "Mechanical Engineering student focused on Propulsion Systems and Aerodynamics.",
    dm_pitch: "Hi [Name], I saw your work on the [Specific Engine/Model] at [Company]. I’m an Aero-focused student at [Uni] and was curious if you think the industry is shifting more toward electric propulsion or hydrogen in the next decade. I'd love to hear your thoughts!"
  },
  {
    id: 48,
    field: "Supply Chain Management",
    profile_summary: "Logistics major interested in Last-mile Delivery and E-commerce fulfillment.",
    dm_pitch: "Hi [Name], I’m a student at [Uni] and have been tracking [Company]’s innovative approach to automated warehousing. I’m looking to break into logistics—would you recommend a focus on operations management or data analytics for someone starting out?"
  },
  {
    id: 49,
    field: "Public Relations",
    profile_summary: "Communications student focusing on Crisis Management and Brand Reputation.",
    dm_pitch: "Hi [Name], your handling of the [Recent Event] PR campaign was masterclass-level. I’m a PR student at [Uni] and would love to know what soft skills you prioritize most when navigating high-pressure media cycles. Could we connect?"
  },
  {
    id: 50,
    field: "Marine Biology",
    profile_summary: "Marine Science student specializing in Coral Reef Restoration and Oceanography.",
    dm_pitch: "Hi [Name], I’ve been following [Institute]’s work on reef resilience. I’m a Marine Bio junior at [Uni] with fieldwork experience in [Location]. Do you have any advice for a student looking to secure their first research assistantship in this field?"
  },
  {
    id: 51,
    field: "Real Estate Finance",
    profile_summary: "Finance student interested in Commercial Real Estate and Urban Development.",
    dm_pitch: "Hi [Name], I’m a Finance student at [Uni] and a frequent reader of your insights on the [City] real estate market. I'm looking to build a career in CRE and would value the chance to ask 2-3 questions about your experience at [Firm]. Open to a quick connection?"
  },
  {
    id: 52,
    field: "Cybersecurity / GRC",
    profile_summary: "IT student focusing on Governance, Risk, and Compliance (GRC) and Data Privacy.",
    dm_pitch: "Hi [Name], I’m an IT student at [Uni] currently prepping for my CISA. I see you’ve built an impressive career in GRC at [Company]. In your experience, how much does a technical background help when pivoting into the policy side of security?"
  },
  {
    id: 53,
    field: "Non-Profit Management",
    profile_summary: "Sociology student passionate about Community Outreach and Grant Writing.",
    dm_pitch: "Hi [Name], I’m inspired by the work [Org] is doing for the [Community]. I’m a student at [Uni] and would love to hear how you successfully manage donor relations while scaling your programs. Would you be open to a 5-minute virtual coffee?"
  },
  {
    id: 54,
    field: "Sports Analytics",
    profile_summary: "Statistics major interested in Player Performance and Recruitment Data.",
    dm_pitch: "Hi [Name], I saw your presentation on [Topic] at the [Conference]. I’m a Stats student at [Uni] and a huge fan of how [Team] uses data in recruiting. Do you have any recommendations for specific tools (R vs. Python) for a student entering sports analytics?"
  },
  {
    id: 55,
    field: "Architecture",
    profile_summary: "Architecture student focusing on Biophilic Design and Sustainable Urbanism.",
    dm_pitch: "Hi [Name], your recent project for [Project Name] is a huge inspiration—the way you integrated greenery into the facade is beautiful. I’m an Arch student at [Uni] and would love to know if your firm values LEED certification in junior designers."
  },
  {
    id: 56,
    field: "Hospitality Management",
    profile_summary: "Hospitality student specializing in Luxury Hotel Operations.",
    dm_pitch: "Hi [Name], I’m a student at [Uni] currently interning at [Hotel], but I’ve always admired the service standards at [Company]. I’m curious what you believe is the biggest challenge facing luxury hospitality in 2026. I'd love to hear your perspective!"
  },
  {
    id: 57,
    field: "Fine Arts / Curation",
    profile_summary: "Art History student focusing on Modern Art and Museum Curation.",
    dm_pitch: "Hi [Name], I recently visited your exhibition at [Gallery] and found the narrative flow incredible. I’m an Art History student at [Uni] and would love to learn more about the day-to-day of an assistant curator. Any advice for a student in this space?"
  },
  {
    id: 58,
    field: "Geology / Oil & Gas",
    profile_summary: "Geology student interested in Subsurface Mapping and Energy Exploration.",
    dm_pitch: "Hi [Name], I’m a Geology student at [Uni] and have been following [Company]’s recent exploration projects in [Region]. I’m curious how your team is utilizing AI for subsurface mapping. Would you be open to a brief chat about the future of the field?"
  },
  {
    id: 59,
    field: "Interior Design",
    profile_summary: "Interior Design student focused on Workplace Strategy and Ergonomics.",
    dm_pitch: "Hi [Name], I love the way your firm redesigned the [Client] offices—the focus on flexible workspaces is fascinating. I’m a student at [Uni] building my portfolio. Could you share one thing you look for in a junior designer's presentation?"
  },
  {
    id: 60,
    field: "Bioinformatics",
    profile_summary: "Biology & CS student focused on Computational Genomics.",
    dm_pitch: "Hi [Name], I’m a dual-major student at [Uni] working at the intersection of Bio and CS. I’m a fan of [Company]’s work in personalized medicine. In your view, which programming language is most critical for genomic research in the next few years?"
  },
  {
    id: 61,
    field: "International Relations",
    profile_summary: "IR student interested in Diplomatic Strategy and Global Security.",
    dm_pitch: "Hi [Name], I read your recent commentary on [Geopolitical Event] and found it very insightful. I’m an IR student at [Uni] and would love to know what skills you think are most important for someone entering the foreign service today. Thanks for your time!"
  },
  {
    id: 62,
    field: "User Research",
    profile_summary: "Anthropology student transitioning into Tech and UX Research.",
    dm_pitch: "Hi [Name], I noticed your background in [Previous Major] before moving into UXR. As an Anthro student at [Uni] looking to do the same, I’d love to know how you translate ethnographic research into product design. Would you be open to a quick connection?"
  },
  {
    id: 63,
    field: "Journalism",
    profile_summary: "Journalism student focusing on Multimedia Storytelling and Data Reporting.",
    dm_pitch: "Hi [Name], I’m a journalism student at [Uni] and a regular listener of your podcast. Your recent episode on [Topic] was incredibly well-researched. I’m looking to specialize in multimedia reporting—do you have any advice on which technical tools a modern journalist should master?"
  }



];

// Open a write stream
const stream = fs.createWriteStream('dm_pitch.jsonl', { flags: 'w' });

data.forEach(item => {
  const jsonl = {
    prompt: `Student Profile: ${item.profile_summary}\nGoal: ${item.goal}\nWrite a professional, concise DM pitch to introduce this student:`,
    completion: ` ${item.dm_pitch}` // note the space before completion
  };

  stream.write(JSON.stringify(jsonl) + '\n');
});

stream.end(() => {
  console.log("dm_pitch.jsonl created successfully at:", path.join(__dirname, 'dm_pitch.jsonl'));
});